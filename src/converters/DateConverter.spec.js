import { assert } from 'chai';
import DateConverter  from './DateConverter';
import ParseError  from './ParseError';

describe('DateConverter', function () {
  it('should convert date to string', function () {
    let dc = new DateConverter('MM/dd/yyyy');

    let date = new Date(2001, 0, 15)
    let dateAsString = dc.valueToString(date);

    assert.equal(dateAsString, '01/15/2001');

    let stringAsDate = dc.stringToValue(dateAsString);
    assert.equal(stringAsDate.toString(), date.toString());

    dc = new DateConverter('dd/MM/yy');
    assert.equal(dc.valueToString(date), '15/01/01');

    assert.throws(() => {
      assert.isNull(dc.stringToValue('aaaa'));
    }, ParseError, 'invalid parsed value [aaaa]');

    assert.throws(() => {
      assert.isNull(dc.stringToValue('11111'));
    }, ParseError, 'invalid parsed value [11111]');
  });
});
