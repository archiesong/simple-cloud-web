import { HttpStatus } from '@midwayjs/core';
import { BusinessException } from '../../../src/exception/business.exception';
import { DefaultErrorFilter } from '../../../src/filter/default.filter';

describe('DefaultErrorFilter', () => {
  it('returns the unified error contract with requestId for business errors', async () => {
    const filter = new DefaultErrorFilter();
    const ctx = {
      reqId: 'req-001',
      logger: {
        error: jest.fn(),
      },
    };

    const response = await filter.catch(
      new BusinessException('签名验证失败', HttpStatus.BAD_REQUEST),
      ctx as any
    );

    expect(response).toEqual({
      code: HttpStatus.BAD_REQUEST,
      message: '签名验证失败',
      data: null,
      requestId: 'req-001',
    });
  });
});
