import {assert} from 'chai';
import I18nManager from './I18nManager';

describe('I18nManager', function () {
  before('instantiate new intl manager', function () {
    let formatInfos = {
      'en-US': {
        dateFormat: 'dd/MM/yyyy',
        numberFormat: '#,##0',
        decimalNumberFormat: '#,##0.00',
        decimalNumberSeparator: '.',
        numberGroupingSeparator: ',',
        numberGroupingSeparatorUse: true
      }
    };
    this.i18n = new I18nManager('en-US', [{
      locales: ['en-US'],
      messages: {
        test: 'test'
      }
    }], formatInfos);
    this.i18n = this.i18n.register('component', [{
      locales: ['en-US'],
      messages: {
        component: {
          test: 'test component'
        }
      }
    }]);
  });

  it('should contain test message', function () {
    let message = this.i18n.getMessage('test');
    assert.equal('test', message);
  });

  it('should contain component test message', function () {
    let message = this.i18n.getMessage('component.test');
    assert.equal('test component', message);
  });

  it('should format and parse date', function() {
    let date = new Date(2001, 0, 10);
    let dateAsString = this.i18n.formatDate(date);
    assert.equal('10/01/2001', dateAsString);

    let dateAsObject = this.i18n.parseDate(dateAsString);
    assert.equal(date.toString(), dateAsObject.toString());
  });

  it('shuld format and parse numbers', function() {
    assert.equal('10,000', this.i18n.formatNumber(10000));
    assert.equal(10000, this.i18n.parseNumber('10,000'));

    assert.equal('10,000.00', this.i18n.formatDecimalNumber(10000));
    assert.equal(10000, this.i18n.parseDecimalNumber('10,000.00'));
  });
});
