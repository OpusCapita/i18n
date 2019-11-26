import { assert } from 'chai';
import I18nManager from './I18nManager';

const createDefaulti18nManager = _ => {
  return new I18nManager({ locale: 'en-US' }).
    register(
      'first component',
    {
      'en-US': {
        test: 'test',
        subcomponent: {
          hint: 'nested hint',
        }
      }
    }
    ).
    register(
      'second component',
    {
      'en-US': {
        component: {
          test: 'test component',
          format: 'min={min}, max={max}',
          subcomponent: {
            label: 'nested'
          }
        },
      },
    }
    );
}

describe('I18nManager: messages', () => {
  it('should create i18n manager correctly using "obsolete" constructor', () => {
    const locale = 'de-DE';
    const fallbackLocale = 'es-ES';
    const localeFormattingInfo = {};
    const overriddenTranslations = {};
    const i18n = new I18nManager(locale, null, localeFormattingInfo, fallbackLocale, overriddenTranslations);
    // check i18n internals
    assert.equal(i18n.locale, locale);
    assert.equal(i18n.fallbackLocale, fallbackLocale);
    assert.equal(i18n.localeFormattingInfo, localeFormattingInfo);
    assert.equal(i18n.overriddenTranslations, overriddenTranslations);
  });

  it('should create i18n manager correctly using "actual" constructor', () => {
    const locale = 'de-DE';
    const fallbackLocale = 'es-ES';
    const localeFormattingInfo = {};
    const overriddenTranslations = {};
    const i18n = new I18nManager({ locale, fallbackLocale, localeFormattingInfo, overriddenTranslations });
    // check i18n internals
    assert.equal(i18n.locale, locale);
    assert.equal(i18n.fallbackLocale, fallbackLocale);
    assert.equal(i18n.localeFormattingInfo, localeFormattingInfo);
    assert.equal(i18n.overriddenTranslations, overriddenTranslations);
  });

  // eslint-disable-next-line max-len
  it('should not skip silently component registration if it was registered already ("actual" register method)', () => {
    const i18n = new I18nManager();
    // check i18n internals
    const { localeBundles } = i18n.register("component-one",
      { 'en': { 'button.save.label': 'Save' } });
    // component is already registered, i18n manager internal state shpuld be unchanged
    assert.deepEqual(i18n.register("component-one",
      { 'de': { 'button.save.label': 'Speichern' } }).localeBundles, localeBundles);
  });

  // eslint-disable-next-line max-len
  it('should not skip silently component registration if it was registered already ("obsolete" register method)', () => {
    const i18n = new I18nManager();
    // check i18n internals
    const { localeBundles } = i18n.register("component-one",
      [{ locales: ['en'], messages: { 'button.save.label': 'Save' } }]);
    // component is already registered, i18n manager internal state shpuld be unchanged
    assert.deepEqual(i18n.register("component-one",
      [{ locales: ['de'], messages: { 'button.save.label': 'Speichern' } }]).localeBundles, localeBundles);
  });

  it('should get fallback message', () => {
    const i18n = new I18nManager('de-DE', [], {});

    i18n.register('test_component',
      {
        'en': {
          component: {
            testMessage1: 'en test message 1',
            testMessage2: 'en test message 2'
          }
        },
        'de': {
          component: {
            testMessage2: 'de test message 2'
          }
        }
      }
    );

    assert.equal('en test message 1', i18n.getMessage('component.testMessage1'));
    assert.equal('de test message 2', i18n.getMessage('component.testMessage2'));
    assert.equal('component.testMessage3', i18n.getMessage('component.testMessage3'));
  });

  it('should contain test message', () => {
    const message = createDefaulti18nManager().getMessage('test');
    assert.equal('test', message);
  });

  it('should contain component test message', () => {
    const message = createDefaulti18nManager().getMessage('component.test');
    assert.equal('test component', message);
  });

  it('should substitute params in message', () => {
    const formatInfos = {
      'en-US': {
        datePattern: 'dd/MM/yyyy',
        dateTimePattern: 'dd/MM/yyyy HH:mm:ss',
        integerPattern: '#,##0',
        numberPattern: '#,##0.00#######',
        numberDecimalSeparator: '.',
        numberGroupingSeparator: ',',
        numberGroupingSeparatorUse: true,
      },
    };
    const i18n = new I18nManager('en-US', {
      'en-US': {
        test: 'test',
        subcomponent: {
          hint: 'nested hint'
        }
      }
    }, formatInfos).register('component', {
      'en-US': {
        component: {
          test: 'test component',
          format: 'min={min}, max1={max}, max2={max}, max3={max}',
          subcomponent: {
            label: 'nested'
          },
          'Next W': 'Next Week'
        }
      }
    });

    let message = i18n.getMessage('component.format');
    assert.equal('min={min}, max1={max}, max2={max}, max3={max}', message);

    message = i18n.getMessage('component.format', { min: 10, max: 100 });
    assert.equal('min=10, max1=100, max2=100, max3=100', message);

    message = i18n.getMessage('component.Next W');
    assert.equal('Next Week', message);
  });

  it('should replace numerical params with payload array values', () => {
    const i18n = new I18nManager();
    i18n.register('randomCmp', {
      en: {
        'mymessage': 'My message with {0} and {1}.'
      }
    });

    assert.equal('My message with first and last.', i18n.getMessage('mymessage', ['first', 'last']));
    assert.equal('My message with first and {1}.', i18n.getMessage('mymessage', ['first']));
    assert.equal('My message with {0} and {1}.', i18n.getMessage('mymessage'));
  });

  it('should override message with custom translations', () => {
    const overriddenTranslations = {
      'test.a': 'a',
      test: {
        b: 'b {0}'
      }
    };
    const i18n = new I18nManager({ overriddenTranslations });
    i18n.register('messages', {
      en: {
        'test.a': 'en a',
        'test.b': 'en b {0}',
        'test.c': 'en c'
      }
    });

    assert.equal('a', i18n.getMessage('test.a'));
    assert.equal('b arg0', i18n.getMessage('test.b', ['arg0']));
    assert.equal('en c', i18n.getMessage('test.c'));
  });
});
