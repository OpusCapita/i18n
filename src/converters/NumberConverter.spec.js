import { assert } from 'chai';

import NumberConverter from './NumberConverter';
import ParseError from './ParseError';
import AccuracyError from './AccuracyError';

describe('NumberConverter', () => {
  it('should decimal format with group separator', () => {
    let dc = new NumberConverter('#,##0.00', ',', '.');

    assert.strictEqual(dc.valueToString(null), null);
    assert.strictEqual(dc.valueToString(10000000), '10,000,000.00');
    assert.strictEqual(dc.valueToString(-10000), '-10,000.00');
    assert.strictEqual(dc.valueToString(1100.99), '1,100.99');
    assert.throws(() => {return dc.valueToString('werwe')}, TypeError, `'werwe' is not a Number!`);

    assert.strictEqual(dc.stringToValue(null), null);
    assert.strictEqual(dc.stringToValue('10,000.00'), 10000);
    assert.strictEqual(dc.stringToValue('-10,000.00'), -10000);
    assert.strictEqual(dc.stringToValue('1,100.99'), 1100.99);
    assert.throws(() => {return dc.stringToValue(12345)}, TypeError, `'12345' is not a String!`);
  });

  it('should decimal format', () => {
    let dc = new NumberConverter('#,##0.00', null, '.');

    assert.strictEqual(dc.valueToString(10000), '10000.00');
    assert.strictEqual(dc.valueToString(-10000), '-10000.00');
    assert.strictEqual(dc.valueToString(1100.99), '1100.99');

    assert.strictEqual(dc.stringToValue('10000.00'), 10000);
    assert.strictEqual(dc.stringToValue('-10000.00'), -10000);
    assert.strictEqual(dc.stringToValue('1100.99'), 1100.99);

    const badValue = '10,000.00';
    assert.throws(() => {
      dc.stringToValue(badValue);
    }, ParseError, `invalid parsed value [${badValue}]`);
  });

  it('should decimal format with space group separator', () => {
    let dc = new NumberConverter('#,##0.00', ' ', ',');

    assert.strictEqual(dc.valueToString(10000), '10 000,00');
    assert.strictEqual(dc.valueToString(-10000), '-10 000,00');
    assert.strictEqual(dc.valueToString(1100.55), '1 100,55');
    assert.strictEqual(dc.valueToString(-1.1), '-1,10');
    assert.strictEqual(dc.valueToString(-1.9), '-1,90');

    assert.strictEqual(dc.stringToValue('10 000,00'), 10000);
    assert.strictEqual(dc.stringToValue('-10 000,00'), -10000);
    assert.strictEqual(dc.stringToValue('1 100,99'), 1100.99);

    const invalidValues = ['test', 'test1321321', '10,000.00', '5435432test'];

    let convertToNumber = (value) => {
      return () => {
        return dc.stringToValue(value);
      }
    };
    for (const value of invalidValues) {
      assert.throws(convertToNumber(value), ParseError, `invalid parsed value [${value}]`);
    }
  });

  it('should integer format with ` group separator', () => {
    // formatting integer values
    let dc = new NumberConverter('#,##0', '`');

    assert.strictEqual(dc.valueToString(10000), '10`000');
    assert.strictEqual(dc.stringToValue('10`000'), 10000);

    assert.strictEqual(dc.valueToString(10000.99), '10`001');

    assert.throws(() => {
      dc.stringToValue('10`000.99');
    }, ParseError, 'invalid parsed value [10`000.99]');
  });

  it('should decimal format with custom decimal separator', () => {
    let dc = new NumberConverter('#.##', null, ',');

    assert.strictEqual(dc.valueToString(100), '100');

    assert.strictEqual(dc.stringToValue('1000'), 1000);
    assert.strictEqual(dc.stringToValue('100000,1'), 100000.1);

    assert.strictEqual(dc.valueToString(100.01), '100,01');

    assert.strictEqual(dc.valueToString(0.0), '0');
    assert.strictEqual(dc.valueToString(0), '0');
  });

  it('should decimal format with always decimal separator', () => {
    let dc = new NumberConverter('#.##', null, ',', true);

    assert.strictEqual(dc.valueToString(100), '100,');

    assert.strictEqual(dc.stringToValue('1000'), 1000);
    assert.strictEqual(dc.stringToValue('100000,1'), 100000.1);

    assert.strictEqual(dc.valueToString(100.01), '100,01');

    assert.strictEqual(dc.valueToString(0.0), '0,');
    assert.strictEqual(dc.valueToString(0.1), '0,1');
  });

  it('should out of max safe integer value', () => {
    let dc = new NumberConverter('#,##0.0#########', ',', '.');
    // throw exceptions on large integers
    assert.throws(() => dc.valueToString(12345678912345678910), AccuracyError);
  });

  it('should zero first for integer format', () => {
    let dc = new NumberConverter('00', null, '.');
    assert.strictEqual(dc.valueToString(9), '09');
  });

  it('should decimal format with custom format', () => {
    let dc = new NumberConverter('#.##########', null, ',', false);
    assert.strictEqual(dc.valueToString(1000000), '1000000');
  });

  it('should decimal format with custom format and group separator', () => {
    let dc = new NumberConverter('#,##0.0#########', ',', '.');
    assert.strictEqual(dc.valueToString(123456789.12), '123,456,789.12');
  });
});
