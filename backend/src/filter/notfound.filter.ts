import { Catch, httpError, HttpStatus, MidwayHttpError } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch(httpError.NotFoundError)
export class NotFoundFilter {
  async catch(err: MidwayHttpError, ctx: Context) {
    // 404 错误会到这里
    // ctx.status = HttpStatus;
    return {
      code: HttpStatus.NOT_FOUND,
      message: `${err.message} ${ctx.method} ${ctx.path}`,
      data: null,
      requestId: ctx.reqId || ctx.get?.('X-Request-Id'),
    };
  }
}
