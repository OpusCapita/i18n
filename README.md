[![CircleCI Status](https://circleci.com/gh/OpusCapita/i18n/tree/master.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/OpusCapita/i18n)
[![Coverage Status](https://coveralls.io/repos/github/OpusCapita/i18n/badge.svg?branch=master)](https://coveralls.io/github/OpusCapita/i18n?branch=master)
[![npm version](https://img.shields.io/npm/v/@opuscapita/i18n.svg)](https://npmjs.org/package/@opuscapita/i18n)
[![Dependency Status](https://img.shields.io/david/OpusCapita/i18n.svg)](https://david-dm.org/OpusCapita/i18n)
[![NPM Downloads](https://img.shields.io/npm/dm/@opuscapita/i18n.svg)](https://npmjs.org/package/@opuscapita/i18n)
![badge-license](https://img.shields.io/github/license/OpusCapita/i18n.svg)

# OpusCapita i18n

## Synopsis

- Provides simple i18n mechanism for JS applications/modules.
- Provides data <-> string converters for
  - Dates
  - Numbers
  - Empty values (Strip to null converter)

## Installation

Using npm

```shell
$ npm i --save @opuscapita/i18n
```

or

```shell
$ yarn add @opuscapita/i18n
```

## Usage & API

### I18nManager

Provides mechanism for internationalization according to the locale (with fallback), passed in the constructor.
Also provides facade function for operating with converters, according to format patterns.

#### I18n manager creation

```javascript
import { I18nManager } from '@opuscapita/i18n';

const localeFormattingInfo = {
  'en': {
    datePattern: 'dd/MM/yyyy',
    dateTimePattern: 'dd/MM/yyyy HH:mm:ss',
    integerPattern: '#,##0',
    numberPattern: '#,##0.00#######',
    numberDecimalSeparator: '.',
    numberGroupingSeparator: ',',
    numberGroupingSeparatorUse: true,
  }
};

let i18n = new I18nManager({
  locale: 'de-DE',         // current locale, by default 'en'
  fallbackLocale: 'en', // fallback locale, by default 'en'
  localeFormattingInfo  // by default formatting information is set up for 'en' with values that you see in this sample
})                      
```

**Deprecated constructor, please, don't use it anymore. It will be removed soon!**
```javascript
// obsolete constructor, please don't use it
let i18n = new I18nManager(
  'de-DE',                                // current locale
  [{                                   // default message bundles (use 'register' method for adding bundles)
    locales: ['en'],
    messages: {
      test: 'test message',
      format: 'min={min}, max={max}',
      subcomponent: {
        hint: 'nested hint'
      }
    },
  }],
  localeFormattingInfo,               // by default formatting information is set up for 'en' with values that you see in this sample
  'en'                                // fallback locale
);
```

#### Adding message bundles

Using flat structure (prefferable)
```javascript
i18n.register('test_component', {
  'en': {
    'button.save.label': 'Save',
    'button.cancel.label': 'Cancel'
  },
  'de': {
    'button.cancel.label': 'Abbrechen'
  }
});
```

Using deep nested object structure
```javascript
i18n.register('test_component', {
  'en': {
    button: {
      save: {
        label: 'Save'
      },
      cancel: {
        label:  'Cancel'
      }
    }
  },
  'de': {
    button: {
      cancel: {
        label:  'Abbrechen'
      }
    }
  }
});
```

**Deprecated message bundle structure, please, don't use it anymore. It will be removed soon!**
```javascript
i18n.register('test_component', [
  {
    locales: ['en'],
    messages: {
      button: {
        save: {
          label: 'Save'
        },
        cancel: {
          label:  'Cancel'
        }
      }
    }
  },
  {
    locales: ['de'],
    messages: {
      button: {
        cancel: {
          label:  'Abbrechen'
        }
      }
    }
  },
]);
```

**N.B.** Messages defined in this way:
```javascript
{
  'a.b.c': 'hi'
}
```
or another way
```javascript
{
  a: {
    b: {
      c: 'hi'
    }
  }
}
```
are considered by i18n manager as equal and correspond to the same message key/path 'a.b.c'

#### Retrieving messages

Message is returned for current locale. If is not found then fallback locale logic is use. For example, if current locale is 'de-DE', then its fallback locale will be 'de', so message will be searched using 'de' locale. Final fallback language is the one that is passed in constructor (by default 'en').

```javascript
// getting simple message
i18n.getMessage('test') // returns 'test message'

// getting message with arguments
i18n.getMessage('format', { min: 10, max: 100 }) // returns  'min=10, max=100'

// getting fallback message in default locale (en) in case of error (example de-DE -> de -> en)
i18n.getMessage('button.save.label') // returns 'Save'

// getting fallback message in root locale in case of error (example de-DE -> de)
i18n.getMessage('button.cancel.label') // returns 'de test message 2'

// getting fallback message key in case no values were found
i18n.getMessage('button.saveandnew.label') // returns 'button.saveandnew.label'

#### Data conversion

// Converter wrappers
i18n.formatDate(new Date(2001, 0, 10)) // returns '10/01/2001'
i18n.parseDate('10/01/2001').toISOString() // returns new Date(2001, 0, 10).toISOString()
i18n.formatDateTime(new Date(2001, 0, 10)) // returns '10/01/2001 00:00:00'

i18n.formatNumber(10000) // returns '10,000'
i18n.parseNumber('10,000')// returns 10000

i18n.formatDecimalNumber(10000) // returns '10,000.00'
i18n.parseDecimalNumber('10,000.00') // returns 10000

// Wraps decimal number converter but allows the use of custom patterns
i18n.formatDecimalNumberWithPattern(10000, '#,##0.000000') // returns 10,000.000000

// getting date format
i18n.dateFormat // returns 'dd/MM/yyyy'
```

### Converters

Converter is a class that converts a value from its object representation to string one and reverse. All converters (Date, Number, StripToNull) implement the same interface that provides two methods _valueToString_ and _stringToValue_.

**Date Converter**

```javascript
import DateConverter from '@opuscapita/i18n/DateConverter';

let dc = new DateConverter(''MM/dd/yyyy'', 'en');
dc.valueToString(new Date(2001, 0, 15)) // returns '01/15/2001'
dc.stringToValue('01/15/2001') // returns new Date(2001, 0, 15)
```

**NumberConverter**

Format definition is similar to Java's [_DecimalFormat_](https://docs.oracle.com/javase/7/docs/api/java/text/DecimalFormat.html) class, but **exponent is not supported**

```javascript
import NumberConverter from '@opuscapita/i18n/NumberConverter';

let nc = new NumberConverter('#,##0.00', ',', '.'); // format, groupSep, decSep, decSepUseAlways = false
nc.valueToString(10000000) // returns '10,000,000.00'
nc.stringToValue('10,000.00') // returns 10000
```

**Strip to null converter**

```javascript
import StripToNullConverter from '@opuscapita/i18n/StripToNullConverter';

let stnc = new StripToNullConverter();
stnc.valueToString(null) // returns ''
converter.stringToValue('') // returns null
```

## Contributors

| <img src="https://avatars.githubusercontent.com/u/24733803?v=3" width="100px;"/> | [**Dmitry Divin**](https://github.com/ddivin-sc)     |
| :---: | :---: |
| <img src="https://avatars3.githubusercontent.com/u/24650360?v=3" width="100px;"/> | [**Daniel Zhitomirsky**](https://github.com/dzhitomirsky-sc) |
| <img src="https://avatars.githubusercontent.com/u/24603787?v=3" width="100px;"/> | [**Alexey Sergeev**](https://github.com/asergeev-sc)     |

## License

**OpusCapita i18n** is licensed under the Apache License, Version 2.0. See [LICENSE](./LICENSE) for the full license text.
