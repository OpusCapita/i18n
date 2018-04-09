import { assert } from 'chai';

import DateConverter from './DateConverter';
import ParseError from './ParseError';

describe('DateConverter', () => {
  it('should convert null to empty string', () => {
    let dc = new DateConverter('MM/dd/yyyy');
    assert.strictEqual(dc.valueToString(null), '');
  });

  it('should convert empty or null or undefined string to null', () => {
    let dc = new DateConverter('MM/dd/yyyy');
    assert.strictEqual(dc.stringToValue(null), null);
    assert.strictEqual(dc.stringToValue(''), null);
    assert.strictEqual(dc.stringToValue(undefined), null);
  });

  it('should convert date to string', () => {
    const date = new Date(2001, 2, 15);

    let dc = new DateConverter('MM/dd/yyyy');
    assert.equal(dc.valueToString(date), '03/15/2001');

    dc = new DateConverter('dd/MM/yyyy');
    assert.equal(dc.valueToString(date), '15/03/2001');

    dc = new DateConverter('MM/dd/yy');
    assert.equal(dc.valueToString(date), '03/15/01');

    dc = new DateConverter('dd/MM/yy');
    assert.equal(dc.valueToString(date), '15/03/01');

    dc = new DateConverter('MM-dd-yyyy');
    assert.equal(dc.valueToString(date), '03-15-2001');

    dc = new DateConverter('dd-MM-yyyy');
    assert.equal(dc.valueToString(date), '15-03-2001');

    dc = new DateConverter('MM-dd-yy');
    assert.equal(dc.valueToString(date), '03-15-01');

    dc = new DateConverter('dd-MM-yy');
    assert.equal(dc.valueToString(date), '15-03-01');

    dc = new DateConverter('MM.dd.yyyy');
    assert.equal(dc.valueToString(date), '03.15.2001');

    dc = new DateConverter('dd.MM.yyyy');
    assert.equal(dc.valueToString(date), '15.03.2001');

    dc = new DateConverter('MM.dd.yy');
    assert.equal(dc.valueToString(date), '03.15.01');

    dc = new DateConverter('dd.MM.yy');
    assert.equal(dc.valueToString(date), '15.03.01');

    dc = new DateConverter('yyyy/MM/dd');
    assert.equal(dc.valueToString(date), '2001/03/15');

    dc = new DateConverter('yyyy/dd/MM');
    assert.equal(dc.valueToString(date), '2001/15/03');

    dc = new DateConverter('yy/MM/dd');
    assert.equal(dc.valueToString(date), '01/03/15');

    dc = new DateConverter('yy/dd/MM');
    assert.equal(dc.valueToString(date), '01/15/03');

    dc = new DateConverter('yyyy-MM-dd');
    assert.equal(dc.valueToString(date), '2001-03-15');

    dc = new DateConverter('yyyy-dd-MM');
    assert.equal(dc.valueToString(date), '2001-15-03');

    dc = new DateConverter('yy-MM-dd');
    assert.equal(dc.valueToString(date), '01-03-15');

    dc = new DateConverter('yy-dd-MM');
    assert.equal(dc.valueToString(date), '01-15-03');

    dc = new DateConverter('yyyy.MM.dd');
    assert.equal(dc.valueToString(date), '2001.03.15');

    dc = new DateConverter('yyyy.dd.MM');
    assert.equal(dc.valueToString(date), '2001.15.03');

    dc = new DateConverter('yy.MM.dd');
    assert.equal(dc.valueToString(date), '01.03.15');

    dc = new DateConverter('yy.dd.MM');
    assert.equal(dc.valueToString(date), '01.15.03');
  });

  it('should convert string to date', () => {
    const date = new Date(2001, 2, 15);

    let dc = new DateConverter('MM/dd/yyyy');
    let stringAsDate = dc.stringToValue('03/15/2001');
    assert.equal(stringAsDate.toString(), date.toString());

    dc = new DateConverter('dd/MM/yyyy');
    stringAsDate = dc.stringToValue('15/03/2001');
    assert.equal(stringAsDate.toString(), date.toString());

    dc = new DateConverter('MM/dd/yy');
    stringAsDate = dc.stringToValue('03/15/01');
    assert.equal(stringAsDate.toString(), date.toString());

    dc = new DateConverter('dd/MM/yy');
    stringAsDate = dc.stringToValue('15/03/01');
    assert.equal(stringAsDate.toString(), date.toString());

    dc = new DateConverter('yyyy/MM/dd');
    stringAsDate = dc.stringToValue('2001/03/15');
    assert.equal(stringAsDate.toString(), date.toString());

    dc = new DateConverter('yyyy/dd/MM');
    stringAsDate = dc.stringToValue('2001/15/03');
    assert.equal(stringAsDate.toString(), date.toString());

    dc = new DateConverter('yy/MM/dd');
    stringAsDate = dc.stringToValue('01/03/15');
    assert.equal(stringAsDate.toString(), date.toString());

    dc = new DateConverter('yy/dd/MM');
    stringAsDate = dc.stringToValue('01/15/03');
    assert.equal(stringAsDate.toString(), date.toString());

    dc = new DateConverter('MM-dd-yyyy');
    stringAsDate = dc.stringToValue('03-15-2001');
    assert.equal(stringAsDate.toString(), date.toString());

    dc = new DateConverter('dd-MM-yyyy');
    stringAsDate = dc.stringToValue('15-03-2001');
    assert.equal(stringAsDate.toString(), date.toString());

    dc = new DateConverter('MM-dd-yy');
    stringAsDate = dc.stringToValue('03-15-01');
    assert.equal(stringAsDate.toString(), date.toString());

    dc = new DateConverter('dd-MM-yy');
    stringAsDate = dc.stringToValue('15-03-01');
    assert.equal(stringAsDate.toString(), date.toString());

    dc = new DateConverter('yyyy-MM-dd');
    stringAsDate = dc.stringToValue('2001-03-15');
    assert.equal(stringAsDate.toString(), date.toString());

    dc = new DateConverter('yyyy-dd-MM');
    stringAsDate = dc.stringToValue('2001-15-03');
    assert.equal(stringAsDate.toString(), date.toString());

    dc = new DateConverter('yy-MM-dd');
    stringAsDate = dc.stringToValue('01-03-15');
    assert.equal(stringAsDate.toString(), date.toString());

    dc = new DateConverter('yy-dd-MM');
    stringAsDate = dc.stringToValue('01-15-03');
    assert.equal(stringAsDate.toString(), date.toString());
  });

  it('should convert string to date with time', () => {
    const date = new Date(2001, 2, 15, 10, 25, 25);

    let dc = new DateConverter('dd/MM/yyyy HH:mm:ss');
    let stringAsDate = dc.stringToValue('15/03/2001 10:25:25');
    assert.equal(stringAsDate.toString(), date.toString());

    // dc = new DateConverter('dd/MM/yyyy');
    // stringAsDate = dc.stringToValue('15/03/2001');
    // assert.equal(stringAsDate.toString(), date.toString());
  });

  it('should convert date to string 2', () => {
    let dc = new DateConverter('MM/dd/yyyy');

    const date = new Date(2001, 0, 15);
    const dateAsString = dc.valueToString(date);

    assert.equal(dateAsString, '01/15/2001');

    const stringAsDate = dc.stringToValue(dateAsString);
    assert.equal(stringAsDate.toString(), date.toString());

    dc = new DateConverter('dd/MM/yy');
    assert.strictEqual(dc.valueToString(date), '15/01/01');

    dc = new DateConverter('MM/dd/yy');
    assert.strictEqual(dc.valueToString(date), '01/15/01');

    assert.throws(() => {
      assert.isNull(dc.stringToValue('aaaa'));
    }, ParseError, 'invalid parsed value [aaaa]');

    assert.throws(() => {
      assert.isNull(dc.stringToValue('11111'));
    }, ParseError, 'invalid parsed value [11111]');
  });

  it('should not throw error if no `format` argument specified', () => {
    assert.doesNotThrow(() => {
      let dc = new DateConverter(); // eslint-disable-line no-unused-vars
    });
  });
});
