import { assert } from 'chai';
import moment from 'moment';

import DateStringConverter from './DateStringConverter';
import ParseError from './ParseError';

describe('DateStringConverter', () => {
  it('should convert ISO string to UI local string', () => {
    let dc = new DateStringConverter('MM/dd/yyyy', null, '+02:00');

    //Year:
    let isoString = '2001-01-01';
    let localString = dc.valueToString(isoString);
    assert.equal(localString, '01/01/2001');

    //Year and month:
    isoString = '2001-12-01';
    localString = dc.valueToString(isoString);
    assert.equal(localString, '12/01/2001');

    isoString = dc.stringToValue(localString);
    assert.equal(isoString, '2001-12-01T00:00:00+02:00');

    //Complete date:
    isoString = '2001-12-25';
    localString = dc.valueToString(isoString);
    assert.equal(localString, '12/25/2001');

    //Complete date plus hours and minutes:
    isoString = '2001-07-16T19:20+02:00';
    localString = dc.valueToString(isoString);
    assert.equal(localString, '07/16/2001');

    isoString = dc.stringToValue(localString);
    assert.equal(isoString, '2001-07-16T00:00:00+02:00');

    //Complete date plus hours, minutes and seconds:
    isoString = '2001-07-16T19:20:30+02:00';
    localString = dc.valueToString(isoString);
    assert.equal(localString, '07/16/2001');

    dc = new DateStringConverter('dd/MM/yy', 'de', '+02:00');
    //Complete date plus hours, minutes, seconds and a decimal fraction of a  second
    isoString = '2001-07-16T19:20:30.45+03:00';
    localString = dc.valueToString(isoString);
    assert.equal(localString, '16/07/01');

    isoString = dc.stringToValue(localString);
    assert.equal(isoString, '2001-07-16T00:00:00+02:00');

    dc = new DateStringConverter('MM/dd/yyyy HH:mm:ss', null, '+02:00');
    //Complete date plus hours and minutes:
    isoString = '2001-07-16T19:20+02:00';
    localString = dc.valueToString(isoString);
    assert.equal(localString, '07/16/2001 19:20:00');

    isoString = dc.stringToValue(localString);
    assert.equal(isoString, '2001-07-16T19:20:00+02:00');

    assert.throws(() => {
      assert.isNull(dc.stringToValue('aaaa'));
    }, ParseError, 'invalid parsed value [aaaa]');

    assert.throws(() => {
      assert.isNull(dc.stringToValue('11111'));
    }, ParseError, 'invalid parsed value [11111]');

    assert.throws(() => {
      assert.isNull(dc.stringToValue('31/31/2001'));
    }, ParseError, 'invalid parsed value [31/31/2001]');

    assert.throws(() => {
      assert.isNull(dc.valueToString('31-31-2001'));
    }, ParseError, 'invalid parsed value [31-31-2001]');
  });
});
