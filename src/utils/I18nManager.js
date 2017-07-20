import lodash from 'lodash';
import { DateConverter, NumberConverter } from '../converters';
import flatten from 'flat';

import { DEFAULT_FORMAT_INFO } from './constants';

/**
 * Creates and initialize new manager instance.
 * Where:
 *- locale is current locale, 'en' by default
 *- localeBundles is an list with messages for different locales. Each bundle has
 *   the following structure {locales: ['en', 'en-GB], messages: {a: {b: {c: 'some message'}}}
 *- formatInfos is format pattern data
 *- fallbackLocale - fallback locale, 'en' by default
 * (see React Intl Data format)
 */
const _obsoleteConstructor = function(
  locale = 'en',
  localeBundles = null,
  localeFormattingInfo = {},
  fallbackLocale = 'en') {
  if (console) {
    console.log(`
Such I18nManager constructor signature is deprecated and will be removed soon!
Instead of:

new I18nmanager(locale, localeBundles, localeFormattingInfo, fallbackLocale)

use the following one:

new I18nManager({locale, localeFormattingInfo, fallbackLocale})

for locale bundle registration use 'register' method
`);
  }

  this.locale = locale;
  this.fallbackLocale = fallbackLocale;
  this.localeFormattingInfo = localeFormattingInfo;

  this.register('default', localeBundles);
};

/**
 * Register translation bundles for specified component
 * @param  {String} component name of the component: 'InputDateField', 'SimMenu'
 * @param  {Array} locale specific message bundle array, where each bundle has
 *   the following structure {locales: ['en', 'en-GB], messages: {a: {b: {c: 'some message'}}}
 * @return {I18NManager} reference to i18n manager instance (method could be used like a builder)
 */
const _obsoleteRegister = function(component, localeBundles = []) {
  if (console) {
    console.log(`
Such I18nManager 'register' method signature is deprecated and its support will be removed soon!
Instead of using locale bundles sturcture like this:

[
  {locales: ['en'], messages: {yes: 'jes'}}
  {locales: ['de'], messages: {yes: 'ja'}}
]

use the following structure:

{
  'en': {yes: 'jes'},
  'de': {yes: 'ja'}
}
`);
  }
  if (this.components.indexOf(component) >= 0) {
    // component was added already -> nothing to do
    return this;
  }

  localeBundles.forEach(({ locales = [], messages = {} }) => {
    locales.forEach((locale) => {
      if (!this.localeBundles[locale]) {
        this.localeBundles[locale] = {};
      }
      this.localeBundles[locale] = { ...this.localeBundles[locale], ...flatten(messages) };
    })
  });
  this.components.push(component);

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
  localeFormattingInfo = {}
} = {}) {
  this.locale = locale;
  this.fallbackLocale = fallbackLocale;
  this.localeFormattingInfo = localeFormattingInfo;
}

/**
 * Reister locale bundles for the component
 * @param  {String} component     component name
 * @param  {[type]} localeBundles {'en': {'a.b.c': 'abc en message'}, 'de': {'a.b.c': 'abc de message'}}
 * @return {I18nManager}          i18n manager instance
 */
const _actualRegister = function(component, localeBundles) {
  if (this.components.indexOf(component) >= 0) {
    // component was added already -> nothing to do
    return this;
  }

  if (!localeBundles) {
    // nothing to register
    return this;
  }

  lodash.each(localeBundles, (bundle, locale) => {
    if (!this.localeBundles[locale]) {
      this.localeBundles[locale] = {};
    }
    this.localeBundles[locale] = { ...this.localeBundles[locale], ...flatten(bundle) };
  })
  this.components.push(component);

  return this;
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
    this.components = [];
    this.localeBundles = {};

    if (arguments.length === 0 ||
        (arguments.length === 1 &&
          (lodash.isNil(arguments[0]) ||
            lodash.isObject(arguments[0])
          )
        )
      ) {
      _actualConstructor.apply(this, arguments);
    } else {
      _obsoleteConstructor.apply(this, arguments);
    }
  }

  register = (component, localeBundles) => {
    if (!lodash.isNil(localeBundles) &&
      lodash.isArray(localeBundles) &&
      localeBundles.length > 0 &&
      localeBundles[0].locales &&
      lodash.isArray(localeBundles[0].locales)
    ) {
      return _obsoleteRegister.bind(this, component, localeBundles)();
    }
    return _actualRegister.bind(this, component, localeBundles)();
  };

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
      message = lodash.get(this.localeBundles[locales[localeIndex]], path);
    }

    if (message === undefined) {
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
