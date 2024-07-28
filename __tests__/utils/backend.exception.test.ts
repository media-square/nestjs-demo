import * as assert from 'assert';
import { describe, it } from 'node:test';
import BackendException from '../../src/utils/backend.exception';

const mockUserContext = { user: { id: 1 } };

describe('BackendException', () => {
  it('should create an exception with a given message', () => {
    const exception = new BackendException('Not Found');

    assert.strictEqual(exception.message, 'Not Found');
    assert.strictEqual(exception.code, 'NOT_FOUND');
    assert.strictEqual(exception.statusCode, undefined);
    assert.deepStrictEqual(exception.context, undefined);
  });

  it('should create an exception with a given message and code', () => {
    const exception = new BackendException('Not Found', 'PRODUCT_NOT_FOUND');

    assert.strictEqual(exception.message, 'Not Found');
    assert.strictEqual(exception.code, 'PRODUCT_NOT_FOUND');
  });

  it('should create an exception with a given message, code, and statusCode', () => {
    const exception = new BackendException('Not Found', 'PRODUCT_NOT_FOUND', 404);

    assert.strictEqual(exception.message, 'Not Found');
    assert.strictEqual(exception.code, 'PRODUCT_NOT_FOUND');
    assert.strictEqual(exception.statusCode, 404);
    assert.deepStrictEqual(exception.context, undefined);
  });

  it('should create an exception with a given message, code, statusCode, and context', () => {
    const context = { user: { id: 1 } };
    const exception = new BackendException('Not Found', 'PRODUCT_NOT_FOUND', 404, context);

    assert.strictEqual(exception.message, 'Not Found');
    assert.strictEqual(exception.code, 'PRODUCT_NOT_FOUND');
    assert.strictEqual(exception.statusCode, 404);
    assert.deepStrictEqual(exception.context, context);
  });

  it('should convert to JSON correctly', () => {
    const exception = new BackendException('Not Found', 'PRODUCT_NOT_FOUND', 404, mockUserContext);

    const expectedJson = {
      message: 'Not Found',
      code: 'PRODUCT_NOT_FOUND',
      statusCode: 404,
      context: mockUserContext,
    };

    assert.deepStrictEqual(exception.toJSON(), expectedJson);
  });

  it('should convert to string correctly', () => {
    const exception = new BackendException('Not Found', 'PRODUCT_NOT_FOUND', 404, mockUserContext);

    const expectedString = JSON.stringify({
      message: 'Not Found',
      code: 'PRODUCT_NOT_FOUND',
      statusCode: 404,
      context: mockUserContext,
    });

    assert.strictEqual(exception.toString(), expectedString);
  });
});
