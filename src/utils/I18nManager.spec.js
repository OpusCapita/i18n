import {assert} from 'chai';
import I18nManager from './I18nManager';

describe('I18nManager', function () {
  before('instantiate new intl manager', function () {
    let formatInfos = {
      'en-US': {
        datePattern: 'dd/MM/yyyy',
        integerPattern: '#,##0',
        numberPattern: '#,##0.00',
        numberDecimalSeparator: '.',
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
          test: 'test component',
          format: 'min={min}, max={max}'
        }
      }
    }]);
  });

  it("should get fallback message", function(){
    this.de_i18n = new I18nManager('de-DE', [] , {});

    this.de_i18n.register('test_component', [
      {
        locales: ['en'],
        messages: {
          component: {
            testMessage1: 'en test message 1',
            testMessage2: 'en test message 2',
          }
        }
      },
      {
        locales: ['de'],
        messages: {
          component: {
            testMessage2: 'de test message 2'
          }
        }
      }
  ]);

    assert.equal('en test message 1', this.de_i18n.getMessage('component.testMessage1'));
    assert.equal('de test message 2', this.de_i18n.getMessage('component.testMessage2'));
    assert.equal('component.testMessage3', this.de_i18n.getMessage('component.testMessage3'));
  });

  it('should contain test message', function () {
    let message = this.i18n.getMessage('test');
    assert.equal('test', message);
  });

  it('should contain component test message', function () {
    let message = this.i18n.getMessage('component.test');
    assert.equal('test component', message);
  });

  it('test object message', function () {
    let message = this.i18n.getMessage('component');
    assert.equal('component', message);
  });

  it('should format and parse date', function() {
    let date = new Date(2001, 0, 10);
    let dateAsString = this.i18n.formatDate(date);
    assert.equal('10/01/2001', dateAsString);

    let dateAsObject = this.i18n.parseDate(dateAsString);
    assert.equal(date.toString(), dateAsObject.toString());
  });

  it('should format and parse numbers', function() {
    assert.equal('10,000', this.i18n.formatNumber(10000));
    assert.equal(10000, this.i18n.parseNumber('10,000'));

    assert.equal('10,000.00', this.i18n.formatDecimalNumber(10000));
    assert.equal(10000, this.i18n.parseDecimalNumber('10,000.00'));
  });

  it('should formatted message', function() {
    let message = this.i18n.getMessage('component.format');
    assert.equal('min={min}, max={max}', message);

    message = this.i18n.getMessage('component.format', {min: 10, max: 100});
    assert.equal('min=10, max=100', message);
  });
});
