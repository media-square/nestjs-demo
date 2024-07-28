import * as assert from 'node:assert';
import { describe, it } from 'node:test';
import { isStringTruthy } from '../../src/utils/string';

describe('isStringTruthy', () => {
  it('should return false if input is undefined', () => {
    assert.strictEqual(isStringTruthy(undefined), false);
  });

  it('should return false if input is null', () => {
    assert.strictEqual(isStringTruthy(null), false);
  });

  it('should return false if input is empty string', () => {
    assert.strictEqual(isStringTruthy(''), false);
  });

  it('should return false if input is false', () => {
    assert.strictEqual(isStringTruthy('false'), false);
  });

  it('should return false if input is NaN', () => {
    assert.strictEqual(isStringTruthy('NaN'), false);
  });

  it('should return true if input is a string', () => {
    assert.strictEqual(isStringTruthy('true'), true);
  });
});
