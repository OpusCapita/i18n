import { assert } from 'chai';

import StripToNullConverter from './StripToNullConverter';

let converter = new StripToNullConverter();
describe('StripToNullConverter', () => {
  it('valueToString', () => {
    assert.strictEqual(converter.valueToString(null), '');
    assert.strictEqual(converter.valueToString(''), '');
    assert.strictEqual(converter.valueToString('test'), 'test');
  });
  it('stringToValue', () => {
    assert.strictEqual(converter.stringToValue(''), null);
    assert.strictEqual(converter.stringToValue(null), null);
    assert.strictEqual(converter.stringToValue('test'), 'test');
  });
});
