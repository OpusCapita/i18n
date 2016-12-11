# JS - i18n 

## Synopsis

Provides data <-> value converters for:
- Dates
- Numbers
- Empty values (Strip to null converter)

Provides simple i18n mechanism for JS applications/modules.

## Installation

Using npm:
```shell
$ npm i --save @opuscapita/i18n
```

## Npm scripts

Linting:
```shell
$ npm run lint
```

Runing tests
```shell
$ npm run test //with coverage
$ npm run testonly //only test resylts
```

Cleaning work directory (removing built docs, etc.)
```shell
$ npm runl clean
```

## Usage & API

### Converters
Converter is a class that converts value from object representation to string one and reverse. All converters (Date, Number, StripToNull) implement the same interfase that provides two methods _valueToString_ and _stringToValue_.

**Date Converter**
```javascript
import DateConverter from 'js-i18n';

let dc = new DateConverter(''MM/dd/yyyy'', 'en');
dc.valueToString(new Date(2001, 0, 15)) === '01/15/2001' // true
dc.stringToValue('01/15/2001').toISOString() === new Date(2001, 0, 15).toISOString() //true
```

**NumberConverter**
```javascript
import NumberConverter from 'js-i18n';

let nc = new NumberConverter('#,##0.00', ',', '.'); // format, groupSep, decSep, decSepUseAlways = false
nc.valueToString(10000000) === '10,000,000.00' //true
nc.stringToValue('10,000.00') === 10000 //true
```

**Strip to null converter**
```javascript
import StripToNullConverter from 'js-i18n';

let stnc = new StripToNullConverter();
stnc.valueToString(null) === '' // true
converter.stringToValue('') === null //true
```

### I18nManager
Provides mechanism for internationalization according to the locale (with fallback), passed in the constructor. 
Also provides facade function for operating with converters, according to format patterns.
```javascript
import I18nManager from 'js-i18n';

const formatInfos = {
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

let i18n = = new I18nManager('en', [{
  locales: ['en'],
  messages: {
    test: 'test',
    format: 'min={min}, max={max}',
    subcomponent: {
      hint: 'nested hint'
    }
  },
}], formatInfos);

//getting simple translation
i18n.getMessage('test') === 'test' // true

//getting translation with attributes
i18n.getMessage('format', { min: 10, max: 100 }) === min=10, max=100' //true

//adding translations on runtime
i18n = new I18nManager('de-DE', [], {});
i18n.register('test_component', [
  {
    locales: ['en'],
    messages: {
      component: {
        testMessage1: 'en test message 1',
        testMessage2: 'en test message 2',
      },
    },
  },
  {
    locales: ['de'],
    messages: {
      component: {
        testMessage2: 'de test message 2',
      },
    },
  },
]);

//getting fallback message in default locale (en) in case of error (example de-DE -> de -> en)
i18n.getMessage('component.testMessage1') === 'en test message 1' //true

//getting fallback message in root locale in case of error (example de-DE -> de)
i18n.getMessage('component.testMessage2') === 'de test message 2' //true

//getting fallback message key in case no values were found
i18n.getMessage('component.testMessage3') === 'component.testMessage3' ///true

//Converter wrappers
i18n.formatDate(new Date(2001, 0, 10)) === '10/01/2001' //true
i18n.parseDate('10/01/2001').toISOString() === new Date(2001, 0, 10).toISOString() //true
i18n.formatDateTime(new Date(2001, 0, 10)) === '10/01/2001 00:00:00' //true

i18n.formatNumber(10000) === '10,000' //true
i18n.parseNumber('10,000') === 10000 //true

i18n.formatDecimalNumber(10000) === '10,000.00' //true
i18n.parseDecimalNumber('10,000.00') === 10000 //true

//getting some format value
i18n.dateFormat === 'YY' //true

```

## Contributors

* Dmitry Divin dmirty.divin@jcatalog.com
* Daniel Zhitomirsky daniel.zhitomirsky@jcatalog.com
* Alexey Sergeev alexey.sergeev@jcatalog.com

## License

OpusCapita 2016
