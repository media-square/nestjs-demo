import * as assert from 'assert';
import { describe, it } from 'node:test';
import { BadRequestException, ArgumentMetadata } from '@nestjs/common';
import { z } from 'zod';

import { ZodValidationPipe } from '../../src/utils/validation.pipe';

export const MockSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(12),
  name: z.string().min(1).max(255),
});

describe('ZodValidationPipe', () => {
  const pipe = new ZodValidationPipe(MockSchema);
  const mocks = {
    advisor: {
      email: 'email@gmail.com',
      password: '123456789012',
      name: 'John',
    },
  };

  it('should validate and return the value if it matches the schema', () => {
    const metadata: ArgumentMetadata = { type: 'body' };

    assert.deepStrictEqual(pipe.transform(mocks.advisor, metadata), mocks.advisor);
  });

  it('should throw BadRequestException if the value does not match the schema', () => {
    const advisor = { ...mocks.advisor, password: 'short' };
    const metadata: ArgumentMetadata = { type: 'body' };

    assert.throws(
      () => pipe.transform(advisor, metadata),
      (error) => {
        assert(error instanceof BadRequestException);
        assert.strictEqual((error as BadRequestException).message, 'Bad Request Exception');
        return true;
      },
    );
  });

  it('should return the value as-is if the metadata type is custom', () => {
    const user = { user: 'user' };
    const metadata: ArgumentMetadata = { type: 'custom' };

    assert.deepStrictEqual(pipe.transform(user, metadata), user);
  });
});
