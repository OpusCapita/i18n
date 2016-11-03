import { assert } from 'chai';

import Converter from './Converter';

describe('Converter', () => {
  it('valueToString should throw Error', () => {
    let converter = new Converter();

    assert.throws(() => {
      assert.isNull(converter.valueToString('it does not metter what'));
    }, Error);
  });
  it('stringToValue should throw Error', () => {
    let converter = new Converter();

    assert.throws(() => {
      assert.isNull(converter.stringToValue('it does not metter what'));
    }, Error);
  });
});
