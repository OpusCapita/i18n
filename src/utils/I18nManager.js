import _ from 'underscore';
import underscoreDeepExtend from 'underscore-deep-extend';
import {DateConverter, NumberConverter} from '../converters';

const DEFAULT_FORMAT_INFO = {
  datePattern: 'dd/MM/yyyy',
  integerPattern: '#,##0',
  numberPattern: '#,##0.00',
  numberDecimalSeparator: '.',
  numberDecimalSeparatorUseAlways: false,
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
   * Where:
   *- locale is current locale
   *- intDatas is an list with messages for different locales.
   *- formatInfos is format pattern data
   *- defaultLocale - fallback locale, 'en' by default
   * (see React Intl Data format)
   */
  constructor(locale, intlDatas, formatInfos, defaultLocale = 'en') {
    _.mixin({deepExtend: underscoreDeepExtend(_)});
    this._intlData = {locales:[locale], messages: {}};

    this._intlDatas = [this._intlData];
    this._components = [];
    // current locale
    this.locale = locale;
    this.defaultLocale = defaultLocale;
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
    this._dateConverter = new DateConverter(this._formatInfo.datePattern);
    this._decimalNumberConverter = new NumberConverter(
      this._formatInfo.numberPattern,
      numberGroupingSeparator,
      this._formatInfo.numberDecimalSeparator,
      this._formatInfo.numberDecimalSeparatorUseAlways
    );
    this._numberConverter = new NumberConverter(
      this._formatInfo.integerPattern,
      numberGroupingSeparator,
      null,
      this._formatInfo.numberDecimalSeparatorUseAlways
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

      var that = this;
      //processing collection of bundle arguments:
      //in the next commnts 'bundle' means js object with the next notation:
      //{locales: [], messages: {}}
      intlDatas.forEach((intlData) => {
        //searching for already existing bundle with 'similliar' locale collection
        var indexToExtend = _.findIndex(that._intlDatas, function(storedIntlData){
          return intersects(storedIntlData.locales, intlData.locales);
        });
        //if we find bundle with locales that intersect with the exteernal one
        //we merge merge map of their messages and unite locales-collections
        if(indexToExtend !== -1){
          that._intlDatas[indexToExtend] = _.extend(
            {},
            {
              locales:_.union(that._intlDatas[indexToExtend].locales, intlData.locales)
            },
            {
              messages:_.deepExtend({}, that._intlDatas[indexToExtend].messages, intlData.messages)
            }
          );
        } else {
          //otherwise we save this bundle to the internal collection of bundles
          that._intlDatas.push(intlData);
        }
      });
      this._intlData = this._getMessageBundleForLocale(this.locale);
      this._components.push(component);
    }

    return this;
  }

  /**
  * Searches for a budle that locales collection containes argument-locale
  */
  _getMessageBundleForLocale(locale){
    return _.find(this._intlDatas, function(storedIntlData){
      return _.indexOf(storedIntlData.locales, locale) !== -1
    });
  }

  /**
  * Returns fallback locale with the next logic: fr-FR->fr->en
  */
  _getFallbackLocale(){
    if(this.locale.indexOf('-') != -1){
      return this.locale.substring(0, this.locale.indexOf('-'));
    } else {
      return this.defaultLocale
    }
  }

  getMessage = (path, args = {}) => {
    let messages = this._intlData.messages;
    const pathParts = path.split(".");

    let message;
    try{
      message = pathParts.reduce((obj, pathPart) => obj[pathPart], messages);
    } catch(e){
      try{
        message = pathParts.reduce((obj, pathPart) => obj[pathPart], this._getMessageBundleForLocale(this._getFallbackLocale()).messages);
        if(message === undefined){
          throw new ReferenceError("Could not find Intl message: " + path);
        }
      } catch(e){
        try{
          message = pathParts.reduce((obj, pathPart) => obj[pathPart], this._getMessageBundleForLocale(this.defaultLocale).messages);
          if(message === undefined){
            throw new ReferenceError("Could not find Intl message: " + path);
          }
        } catch(e){
            message = path;
        }
      }
    }

    //this check covers use case of object message, f.e. message === { test: 'test component', format: 'min={min}, max={max}' }
    if(!_.isString(message)){
      return path;
    }

    _.each(_.keys(args), function(param){
      let paramValue = args[param];

      if (paramValue !== null && paramValue !== undefined) {
        message = message.replace(`{${param}}`, paramValue.toString());
      }
    });
    return message;
  }

  get dateFormat() {
    return this._formatInfo.datePattern;
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
