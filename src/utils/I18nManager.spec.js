import { assert } from 'chai';
import I18nManager from './I18nManager';
import { DEFAULT_FORMAT_INFO } from './constants';

describe('I18nManager', () => {
  let i18n;

  before('instantiate new intl manager', () => {
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
    i18n = new I18nManager('en-US', null, formatInfos);
  });

  describe('I18nManager.getMessage', () => {
    beforeEach(() => {
      i18n = new I18nManager('de-DE', [], {});
    });

    it('should get a message directly by the code', () => {
      i18n.register('component', [{
        locales: ['de-DE'],
        messages: {
          'user.name': 'User name',
          'user.organization.name': 'My organization'
        }
      }]);

      assert.strictEqual(i18n.getMessage('user.name'), 'User name');
      assert.strictEqual(i18n.getMessage('user.organization.name'), 'My organization');
    });

    it('should get a message directly by the code using fallback locale', () => {
      i18n.register('component', [{
        locales: ['de'],
        messages: {
          'user.name': 'User name',
          'user.organization.name': 'My organization'
        }
      }]);

      assert.strictEqual(i18n.getMessage('user.name'), 'User name');
      assert.strictEqual(i18n.getMessage('user.organization.name'), 'My organization');
    });

    it('should get a message directly by the code using default locale', () => {
      i18n.register('component', [{
        locales: [i18n.defaultLocale],
        messages: {
          'user.name': 'User name',
          'user.organization.name': 'My organization'
        }
      }]);

      assert.strictEqual(i18n.getMessage('user.name'), 'User name');
      assert.strictEqual(i18n.getMessage('user.organization.name'), 'My organization');
    });

    it('should get a message by the looking in a nested objects', () => {
      i18n.register('component', [{
        locales: ['de-DE'],
        messages: {
          user: {
            name: 'User name',
            organization: {
              name: 'My organization'
            }
          }
        }
      }]);

      assert.strictEqual(i18n.getMessage('user.name'), 'User name');
      assert.strictEqual(i18n.getMessage('user.organization.name'), 'My organization');
    });

    it('should get a message by the looking in a nested objects using fallback locale', () => {
      i18n.register('component', [{
        locales: ['de'],
        messages: {
          user: {
            name: 'User name',
            organization: {
              name: 'My organization'
            }
          }
        }
      }]);

      assert.strictEqual(i18n.getMessage('user.name'), 'User name');
      assert.strictEqual(i18n.getMessage('user.organization.name'), 'My organization');
    });

    it('should get a message by the looking in a nested objects using default locale', () => {
      i18n.register('component', [{
        locales: [i18n.defaultLocale],
        messages: {
          user: {
            name: 'User name',
            organization: {
              name: 'My organization'
            }
          }
        }
      }]);

      assert.strictEqual(i18n.getMessage('user.name'), 'User name');
      assert.strictEqual(i18n.getMessage('user.organization.name'), 'My organization');
    });

    it('should return a code as a message', () => {
      assert.strictEqual(i18n.getMessage('user.name'), 'user.name');
      assert.strictEqual(i18n.getMessage('user.organization.name'), 'user.organization.name');
    });

    it('should substitute params in message', () => {
      i18n = new I18nManager('en-US', [{
        locales: ['en-US'],
        messages: {}
      }]);
      i18n = i18n.register('component', [{
        locales: ['en-US'],
        messages: {
          component: {
            format: 'min={min}, max1={max}, max2={max}, max3={max}',
            'Next W': 'Next Week'
          },
        },
      }]);

      let message = i18n.getMessage('component.format');
      assert.equal('min={min}, max1={max}, max2={max}, max3={max}', message);

      message = i18n.getMessage('component.format', { min: 10, max: 100 });
      assert.equal('min=10, max1=100, max2=100, max3=100', message);

      message = i18n.getMessage('component["Next W"]');
      assert.equal('Next Week', message);
    });

    it('should get a message by the code with spaces', () => {
      i18n = new I18nManager('en-US', [{
        locales: ['en-US'],
        messages: {}
      }]);
      i18n = i18n.register('component', [{
        locales: ['en-US'],
        messages: {
          component: {
            'Next W': 'Next Week'
          },
        },
      }]);

      assert.equal(i18n.getMessage('component["Next W"]'), 'Next Week');
    });
  });

  it('should format and parse date', () => {
    const date = new Date(2001, 0, 10);
    const dateAsString = i18n.formatDate(date);
    assert.equal('10/01/2001', dateAsString);

    const dateAsObject = i18n.parseDate(dateAsString);
    assert.equal(date.toString(), dateAsObject.toString());
  });

  it('should format and parse date and time', () => {
    const date = new Date(2001, 0, 10);
    const dateTimeAsString = i18n.formatDateTime(date);
    assert.equal('10/01/2001 00:00:00', dateTimeAsString);
  });

  it('should format and parse numbers', () => {
    assert.equal('10,000', i18n.formatNumber(10000));
    assert.equal(10000, i18n.parseNumber('10,000'));

    assert.equal('10,000.00', i18n.formatDecimalNumber(10000));
    assert.equal(10000, i18n.parseDecimalNumber('10,000.00'));

    assert.strictEqual(i18n.formatDecimalNumber(123456789.12), '123,456,789.12');
    assert.strictEqual(i18n.formatDecimalNumber(55454545.12), '55,454,545.12');
  });

  it('should format and parse numbers with numberDecimalSeparatorUseAlways=true (1)', () => {
    const formatInfos = {
      'en-US': {
        datePattern: 'dd/MM/yyyy',
        dateTimePattern: 'dd/MM/yyyy HH:mm:ss',
        integerPattern: '#,##0',
        numberPattern: '#,##0.00#######',
        numberDecimalSeparator: '.',
        numberGroupingSeparator: ',',
        numberGroupingSeparatorUse: true,
        numberDecimalSeparatorUseAlways: true
      },
    };
    let i18n = new I18nManager('en-US', null, formatInfos);

    assert.equal('10,000.', i18n.formatNumber(10000));
    assert.equal(10000, i18n.parseNumber('10,000'));
  });

  it('should format and parse numbers with numberDecimalSeparatorUseAlways=true (2)', () => {
    const formatInfos = {
      'en-US': {
        datePattern: 'dd/MM/yyyy',
        dateTimePattern: 'dd/MM/yyyy HH:mm:ss',
        integerPattern: '#,##0.00',
        numberPattern: '#,##0.00#######',
        numberDecimalSeparator: '.',
        numberGroupingSeparator: ',',
        numberGroupingSeparatorUse: true,
        numberDecimalSeparatorUseAlways: true
      },
    };
    let i18n = new I18nManager('en-US', null, formatInfos);

    assert.equal('10,000.00', i18n.formatNumber(10000));
    assert.equal(10000, i18n.parseNumber('10,000.00'));
  });

  it('dateFormat returns configured date format', () => {
    const i18n = new I18nManager('es', null,
      {
        'es': {
          datePattern: 'YY',
          dateTimePattern: 'dd/MM/yyyy HH:mm:ss',
          integerPattern: '#,##0',
          numberPattern: '#,##0.00#######',
          numberDecimalSeparator: '.',
          numberGroupingSeparator: ',',
          numberGroupingSeparatorUse: true,
        }
      }
    );
    // configured date pattern
    assert.strictEqual(i18n.dateFormat, 'YY');
  });

  it('dateFormat returns default date format', () => {
    const i18n = new I18nManager('en', null);
    // default date pattern
    assert.strictEqual(i18n.dateFormat, DEFAULT_FORMAT_INFO.datePattern);
  });
});
