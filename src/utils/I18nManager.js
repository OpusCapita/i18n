import lodash from 'lodash';
import { DateConverter, NumberConverter } from '../converters';

import { DEFAULT_FORMAT_INFO } from './constants';

const deepMerge = function(object, source) {
  return lodash.mergeWith(object, source,
    function(objValue, srcValue) {
      if (lodash.isObject(objValue) && srcValue) {
        return deepMerge(objValue, srcValue);
      }
      return undefined;
    }
  );
};

/**
 * Creates and initialize new manager instance.
 * Where:
 *- locale is current locale, 'en' by default
 *- intDatas is an list with messages for different locales.
 *- formatInfos is format pattern data
 *- fallbackLocale - fallback locale, 'en' by default
 * (see React Intl Data format)
 */
const _obsoleteConstructor = function(
  locale = 'en',
  intlDatas = null,
  localeFormattingInfo = {},
  fallbackLocale = 'en') {
  this.locale = locale;
  this.fallbackLocale = fallbackLocale;
  this.localeFormattingInfo = localeFormattingInfo;

  //
  this._intlDatas = [{ locales: [locale], messages: {} }];
  this._components = [];
  if (intlDatas) {
    this.register('default', intlDatas);
  }
};

const createDateConverter = (formattingInfo) => {
  return new DateConverter(formattingInfo.datePattern);
}

const createDateTimeConverter = (formattingInfo) => {
  return new DateConverter(formattingInfo.dateTimePattern);
};

const createDecimalNumberConverter = (formattingInfo) => {
  let numberGroupingSeparator = null;
  if (formattingInfo.numberGroupingSeparatorUse) {
    numberGroupingSeparator = formattingInfo.numberGroupingSeparator;
  }

  return new NumberConverter(
    formattingInfo.numberPattern,
    numberGroupingSeparator,
    formattingInfo.numberDecimalSeparator,
    formattingInfo.numberDecimalSeparatorUseAlways
  )
}

const createNumberConverter = (formattingInfo) => {
  let numberGroupingSeparator = null;
  if (formattingInfo.numberGroupingSeparatorUse) {
    numberGroupingSeparator = formattingInfo.numberGroupingSeparator;
  }

  return new NumberConverter(
    formattingInfo.integerPattern,
    numberGroupingSeparator,
    formattingInfo.numberDecimalSeparator,
    formattingInfo.numberDecimalSeparatorUseAlways
  )
};


const _actualConstructor = function({
  locale = 'en',
  fallbackLocale = 'en',
  formattingInfo = {}
} = {}) {

}

/**
 * Manages i18n for JS applications, which includes:
 * - text localization
 * - data formatting
 *
 * @author Alexander Frolov
 * @author Alexey Sergeev
 */
class I18nManager {

  constructor() {
    if (arguments.length === 0 ||
        (arguments.length === 1 && (_.isNil(arguments[0]) || _.isObject(arguments[0])))
      ) {
      _actualConstructor.apply(this, arguments);
    } else {
      _obsoleteConstructor.apply(this, arguments);
    }
  }

  register = (component, intlDatas) => {
    if (this._components.indexOf(component) < 0) {
      // function to check if locales have common elements
      const intersects = (l1, l2) => {
        for (let i = 0; i < l1.length; i++) {
          if (l2.indexOf(l1[i]) >= 0) {
            return true;
          }
        }
        return false;
      };

      const that = this;

      // processing collection of bundle arguments:
      // in the next commnts 'bundle' means js object with the next notation:
      // {locales: [], messages: {}}
      intlDatas.forEach((intlData) => {
        // searching for already existing bundle with 'similliar' locale collection
        const indexToExtend = lodash.findIndex(that._intlDatas, (storedIntlData) => {
          return intersects(storedIntlData.locales, intlData.locales);
        });

        // if we find bundle with locales that intersect with the exteernal one
        // we merge merge map of their messages and unite locales-collections
        if (indexToExtend !== -1) {
          that._intlDatas[indexToExtend] = lodash.extend(
            {},
            { locales: lodash.union(that._intlDatas[indexToExtend].locales, intlData.locales) },
            {
              messages: deepMerge(
                that._intlDatas[indexToExtend].messages,
                intlData.messages
              ),
            }
          );
        } else {
          // otherwise we save this bundle to the internal collection of bundles
          that._intlDatas.push(intlData);
        }
      });
      this._components.push(component);
    }

    return this;
  };

  /**
  * Searches for a bundle that locales collection containes argument-locale
  */
  _getMessageBundleForLocale(locale) {
    return lodash.find(this._intlDatas, (storedIntlData) => {
      return lodash.indexOf(storedIntlData.locales, locale) !== -1;
    });
  }

  /**
  * Returns fallback locale with the next logic: fr-FR->fr->en
  */
  _getFallbackLocale() {
    if (this.locale.indexOf('-') !== -1) {
      return this.locale.substring(0, this.locale.indexOf('-'));
    }

    return this.fallbackLocale;
  }

  getMessage = (path, args = {}) => {
    const pathParts = lodash.toPath(path);

    let message = undefined;
    try {
      message = pathParts.reduce(
        (obj, pathPart) => obj[pathPart],
        this._getMessageBundleForLocale(this.locale).messages
      );
    } catch (e) {
      // ignore and go next
    }
    if (message === undefined) {
      try {
        message = pathParts.reduce(
          (obj, pathPart) => obj[pathPart],
          this._getMessageBundleForLocale(this._getFallbackLocale()).messages
        );
      } catch (e) {
        // ignore and go next
      }
    }
    if (message === undefined) {
      try {
        message = pathParts.reduce(
          (obj, pathPart) => obj[pathPart],
          this._getMessageBundleForLocale(this.fallbackLocale).messages
        );
      } catch (eee) {
        // ignore and go next
      }
    }
    if (message === undefined) {
      message = path;
    }

    // this check covers use case of object message,
    // f.e. message === { test: 'test component', format: 'min={min}, max={max}' }
    if (!lodash.isString(message)) {
      return path;
    }

    Object.keys(args).forEach((param) => {
      const paramValue = args[param];

      if (paramValue !== null && paramValue !== undefined) {
        message = message.replace(new RegExp(`{${param}}`, 'g'), paramValue.toString());
      }
    });
    return message;
  };

  // todo: add locale fallback logic usage
  _findFormattingInfo = () => {
    if (this.localeFormattingInfo[this.locale]) {
      return this.localeFormattingInfo[this.locale];
    }
    return DEFAULT_FORMAT_INFO;
  }

  get dateFormat() {
    return this._findFormattingInfo().datePattern;
  }

  formatDate = (date) => {
    return createDateConverter(this._findFormattingInfo()).valueToString(date);
  };

  formatDateTime = (date) => {
    return createDateTimeConverter(this._findFormattingInfo()).valueToString(date);
  };

  formatDecimalNumber = (number) => {
    return createDecimalNumberConverter(this._findFormattingInfo()).valueToString(number);
  };

  formatNumber = (number) => {
    return createNumberConverter(this._findFormattingInfo()).valueToString(number);
  };

  parseDate = (string) => {
    return createDateConverter(this._findFormattingInfo()).stringToValue(string);
  };

  parseDecimalNumber = (string) => {
    return createDecimalNumberConverter(this._findFormattingInfo()).stringToValue(string);
  };

  parseNumber = (string) => {
    return createNumberConverter(this._findFormattingInfo()).stringToValue(string);
  };
}

export default I18nManager;
