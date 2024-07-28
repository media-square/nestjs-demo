import * as assert from 'node:assert';
import { describe, it } from 'node:test';
import { toArray } from '../../src/utils/array';

describe('toArray', () => {
  it('should return an empty array if input is undefined', () => {
    assert.deepStrictEqual(toArray(undefined), []);
  });

  it('should return an array with provided string as element', () => {
    const string = 'string';
    assert.deepStrictEqual(toArray(string), [string]);
  });

  it('Should return an array with provided array', () => {
    const array = [1, 2, 3];
    assert.deepStrictEqual(toArray(array), array);
  });
});
