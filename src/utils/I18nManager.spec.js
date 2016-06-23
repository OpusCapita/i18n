import { assert } from 'chai';
import I18nManager from './I18nManager';

describe('I18nManager', () => {
  let i18n;
  let deI18n;

  before('instantiate new intl manager', () => {
    const formatInfos = {
      'en-US': {
        datePattern: 'dd/MM/yyyy',
        integerPattern: '#,##0',
        numberPattern: '#,##0.00',
        numberDecimalSeparator: '.',
        numberGroupingSeparator: ',',
        numberGroupingSeparatorUse: true,
      },
    };
    i18n = new I18nManager('en-US', [{
      locales: ['en-US'],
      messages: {
        test: 'test',
      },
    }], formatInfos);
    i18n = i18n.register('component', [{
      locales: ['en-US'],
      messages: {
        component: {
          test: 'test component',
          format: 'min={min}, max={max}',
        },
      },
    }]);
  });

  it('should get fallback message', () => {
    deI18n = new I18nManager('de-DE', [], {});

    deI18n.register('test_component', [
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

    assert.equal('en test message 1', deI18n.getMessage('component.testMessage1'));
    assert.equal('de test message 2', deI18n.getMessage('component.testMessage2'));
    assert.equal('component.testMessage3', deI18n.getMessage('component.testMessage3'));
  });

  it('should contain test message', () => {
    const message = i18n.getMessage('test');
    assert.equal('test', message);
  });

  it('should contain component test message', () => {
    const message = i18n.getMessage('component.test');
    assert.equal('test component', message);
  });

  it('test object message', () => {
    const message = i18n.getMessage('component');
    assert.equal('component', message);
  });

  it('should format and parse date', () => {
    const date = new Date(2001, 0, 10);
    const dateAsString = i18n.formatDate(date);
    assert.equal('10/01/2001', dateAsString);

    const dateAsObject = i18n.parseDate(dateAsString);
    assert.equal(date.toString(), dateAsObject.toString());
  });

  it('should format and parse ISO date string', () => {
    const isoDate = '2001-05-26';
    const uiDateString = i18n.formatISODate(isoDate);
    assert.equal('26/05/2001', uiDateString);

    const parsedIsoDate = i18n.parseISODate(uiDateString, '+02:00');
    assert.equal(parsedIsoDate, '2001-05-26T00:00:00+02:00');
  });

  it('should format and parse numbers', () => {
    assert.equal('10,000', i18n.formatNumber(10000));
    assert.equal(10000, i18n.parseNumber('10,000'));

    assert.equal('10,000.00', i18n.formatDecimalNumber(10000));
    assert.equal(10000, i18n.parseDecimalNumber('10,000.00'));
  });

  it('should formatted message', () => {
    let message = i18n.getMessage('component.format');
    assert.equal('min={min}, max={max}', message);

    message = i18n.getMessage('component.format', { min: 10, max: 100 });
    assert.equal('min=10, max=100', message);
  });
});
