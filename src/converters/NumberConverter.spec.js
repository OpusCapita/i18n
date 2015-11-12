import { assert } from 'chai';
import NumberConverter  from './NumberConverter';
import ParseError  from './ParseError';

describe('NumberConverter', function () {
  it('should convert number to value and value to number', function () {
    //formating decimal values
    let dc = new NumberConverter('#,##0.00', ',', '.');

    assert.equal(dc.valueToString(10000), '10,000.00');
    assert.equal(dc.valueToString(-10000), '-10,000.00');
    assert.equal(dc.valueToString(1100.99), '1,100.99');
    assert.equal(dc.valueToString('werwe'), 'werwe');

    assert.equal(dc.stringToValue('10,000.00'), 10000);
    assert.equal(dc.stringToValue('-10,000.00'), -10000);
    assert.equal(dc.stringToValue('1,100.99'), 1100.99);

    dc = new NumberConverter('#,##0.00', null, '.');

    assert.equal(dc.valueToString(10000), '10000.00');
    assert.equal(dc.valueToString(-10000), '-10000.00');
    assert.equal(dc.valueToString(1100.99), '1100.99');

    assert.equal(dc.stringToValue('10000.00'), 10000);
    assert.equal(dc.stringToValue('-10000.00'), -10000);
    assert.equal(dc.stringToValue('1100.99'), 1100.99);

    let badValue = '10,000.00';
    assert.throws(() => {
      dc.stringToValue(badValue);
    }, ParseError, `invalid parsed value [${badValue}]`);

    dc = new NumberConverter('#,##0.00', ' ', ',');

    assert.equal(dc.valueToString(10000), '10 000,00');
    assert.equal(dc.valueToString(-10000), '-10 000,00');
    assert.equal(dc.valueToString(1100.55), '1 100,55');

    assert.equal(dc.stringToValue('10 000,00'), 10000);
    assert.equal(dc.stringToValue('-10 000,00'), -10000);
    assert.equal(dc.stringToValue('1 100,99'), 1100.99);

    let invalidValues = ['test', 'test1321321', '10,000.00', '5435432test'];

    for (let value of invalidValues) {
      assert.throws(() => {
        dc.stringToValue(value);
      }, ParseError, `invalid parsed value [${value}]`);
    }

    //formating integer values
    dc = new NumberConverter('#,##0', '`');

    assert.equal(dc.valueToString(10000), '10`000');
    assert.equal(dc.stringToValue('10`000'), 10000);

    assert.equal(dc.valueToString(10000.99), '10`001');

    assert.throws(() => {
      dc.stringToValue('10`000.99');
    }, ParseError, "invalid parsed value [10`000.99]");
  });
});
