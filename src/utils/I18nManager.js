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

  this.register('default', intlDatas);
};


const _obsoleteRegister = function(component, intlDatas) {
  // console.log(`intlDatas '${JSON.stringify(intlDatas)}'`);

  if (!this._components) {
    this._components = [];
  }
  // if (!this.localeBundles) {
  //   this.localeBundles = {};
  // }
  if (!this._intlDatas) {
    this._intlDatas = [{ locales: [this.locale], messages: {} }];
  }

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

  // console.log(`this._intlDatas '${JSON.stringify(this._intlDatas)}'`);

  return this;
}

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

const _actualRegister = function(component, localeBundles) {
  if (!this._intlDatas) {
    this._intlDatas = [{ locales: [this.locale], messages: {} }];
  }
}

const generateFallbackLocaleList = function(locale, fallbackLocale) {
  const result = [locale];
  // we expect that locale could be in form like this 'en-GB'
  const dashIndex = locale.indexOf('-');
  if (dashIndex !== -1) {
    result.push(locale.substring(0, dashIndex));
  }
  // add configured fallbackLocale
  result.push(fallbackLocale);

  // remove duplicates, null and undefined values
  return lodash.without(lodash.uniq(result), null, undefined);
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
    if (!lodash.isNil(intlDatas) &&
      lodash.isArray(intlDatas) &&
      intlDatas.length > 0 &&
      intlDatas[0].locales &&
      lodash.isArray(intlDatas[0].locales)
    ) {
      return _obsoleteRegister.bind(this, component, intlDatas)();
    }
    // console.log('opa!!!!!!!!');
    // console.log(`component: ${component}`);
    // console.log(JSON.stringify(intlDatas));
    return _actualRegister.apply(this, arguments)
  };

  /**
  * Searches for a bundle that locales collection containes argument-locale
  */
  _getMessagesForLocale(locale) {
    const intlData = lodash.find(this._intlDatas, (storedIntlData) => {
      return lodash.indexOf(storedIntlData.locales, locale) !== -1;
    });
    if (intlData) {
      return intlData.messages
    }
    return {};
  }

  /**
  * Returns fallback locale with the next logic: fr-FR->fr->en
  */
  _getFallbackLocale() {
    const result = this.__getFallbackLocale();
    // console.log(`fallback locale for '${this.locale}' is '${result}'`);
    return result;
  }

  __getFallbackLocale() {
    if (this.locale.indexOf('-') !== -1) {
      return this.locale.substring(0, this.locale.indexOf('-'));
    }

    return this.fallbackLocale;
  }

  /**
   * the following path 'a.b' will be found when locale specific messages are defined
   * in one of the following ways:
   * - {'a.b': "some message"}
   * - {a:
   *     { b: "some message" }
   *   }
   *  Be careful when you define message kyes. Most probably possibility to
   *  define messages as deep nested objects will be depreacted soon. Please,
   *  try to use plain object for all messages without nesting.
   */
  getMessage = (path, args = {}) => {
    const locales = generateFallbackLocaleList(this.locale, this.fallbackLocale);

    let message = undefined;
    for (let localeIndex = 0; localeIndex < locales.length && message === undefined; localeIndex++) {
      message = lodash.get(this._getMessagesForLocale(locales[localeIndex]), path);
    }

    if (message === undefined) {
      return path;
    }

    // this check covers use case of object message,
    // f.e. message === { test: 'test component', format: 'min={min}, max={max}' }
    if (!lodash.isString(message)) {
      return path;
    }

    // fill message parameter placeholders with passed values
    lodash.each(args, function(value, key) {
      if (!lodash.isNil(value)) {
        message = message.replace(new RegExp(`{${key}}`, 'g'), value.toString());
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
