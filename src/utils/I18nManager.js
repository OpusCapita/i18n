import _ from 'underscore';
import underscoreDeepExtend from 'underscore-deep-extend';
import {DateConverter, NumberConverter} from '../converters';

const DEFAULT_FORMAT_INFO = {
  dateFormat: 'dd/MM/yyyy',
  numberFormat: '#,##0',
  decimalNumberFormat: '#,##0.00',
  decimalNumberSeparator: '.',
  numberGroupingSeparator: ',',
  numberGroupingSeparatorUse: true
};

/**
 * Performs initialization and handling of intl data.
 * It supports intl data in React Intl format.
 *
 * @author Alexander Frolov
 */
class I18nManager {
  /**
   * Creates and initialize new manager instance.
   * Where locale is current locale and intDatas
   * is an list with messages for different locales.
   * (see React Intl Data format)
   */
  constructor(locale, intlDatas, formatInfos) {
    _.mixin({deepExtend: underscoreDeepExtend(_)});
    this._intlData = {locales:[locale], messages: {}};
    this._intlDatas = [this._intlData];
    this._components = [];
    // current locale
    this.locale = locale;
    if(intlDatas) {
      this.register("default", intlDatas);
    }

    this._formatInfos = formatInfos;
    if (formatInfos) {
      this._formatInfo = formatInfos[locale] || DEFAULT_FORMAT_INFO;
    } else {
      this._formatInfo = DEFAULT_FORMAT_INFO;
    }

    let numberGroupingSeparator = this._formatInfo.numberGroupingSeparatorUse ? this._formatInfo.numberGroupingSeparator : null;
    this._dateConverter = new DateConverter(this._formatInfo.dateFormat);
    this._decimalNumberConverter = new NumberConverter(
      this._formatInfo.decimalNumberFormat,
      numberGroupingSeparator,
      this._formatInfo.decimalNumberSeparator
    );
    this._numberConverter = new NumberConverter(
      this._formatInfo.numberFormat,
      numberGroupingSeparator
    );
  }

  register = (component, intlDatas) => {

    if(this._components.indexOf(component) < 0) {
      // function to check if locales have common elements
      const intersects = (l1, l2) => {
        for (var i = 0; i < l1.length; i++) {
          if(l2.indexOf(l1[i]) >= 0) {
            return true;
          }
        }
      }

      intlDatas.forEach((intlData) => {
        for (var i = 0; i < this._intlDatas.length; i++) {
          if(intersects(this._intlDatas[i].locales, intlData.locales)) {
            this._intlDatas[i] = _.extend(
              {},
              {
                locales:_.union(this._intlDatas[i].locales, intlData.locales)
              },
              {
                messages:_.deepExtend({},this._intlDatas[i].messages, intlData.messages)
              }
            );
          }
          var that = this;
          if(_.size(_.find(this._intlDatas[i].locales,function(locale){
            return locale === that.locale
          })) >= 0 ){
            that._intlData = that._intlDatas[i];
          }
        }
      });
      this._components.push(component);
    }

    return this;
  }

  getMessage = (path, args = {}) => {
    let messages = this._intlData.messages;

    const pathParts = path.split(".");

    let message;

    try {
      message = pathParts.reduce((obj, pathPart) => obj[pathPart], messages);
    } finally {
      if (message === undefined) {
        throw new ReferenceError("Could not find Intl message: " + path);
      }
    }

    for (let param of Object.keys(args)) {
      let paramValue = args[param];

      if (paramValue !== null && paramValue !== undefined) {
        message = message.replace(`{${param}}`, paramValue.toString());
      }
    }

    return message;
  }

  get dateFormat() {
    return this._formatInfo.dateFormat;
  }

  formatDate = (date) => {
    return this._dateConverter.valueToString(date);
  }

  formatDecimalNumber = (number) => {
    return this._decimalNumberConverter.valueToString(number)
  }

  formatNumber = (number) => {
    return this._numberConverter.valueToString(number);
  }

  parseDate = (string) => {
    return this._dateConverter.stringToValue(string);
  }

  parseDecimalNumber = (string) => {
    return this._decimalNumberConverter.stringToValue(string);
  }

  parseNumber = (string) => {
    return this._numberConverter.stringToValue(string);
  }
}

export default I18nManager;
