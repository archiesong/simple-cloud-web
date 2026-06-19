import { Catch } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { BusinessException } from '../exception/business.exception';

@Catch()
export class DefaultErrorFilter {
  async catch(err: Error, ctx: Context) {
    const requestId = ctx.reqId || ctx.get?.('X-Request-Id');
    ctx.logger.error('DefaultErrorFilter:', err);
    if (err instanceof BusinessException) {
      return {
        code: err.status,
        message: err.message,
        data: null,
        requestId,
      };
    }
    return {
      code: 500,
      message: err.message,
      data: null,
      requestId,
    };
  }
}
