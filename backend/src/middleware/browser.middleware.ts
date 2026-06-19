import { IMiddleware, Inject, Middleware } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import { UAParser } from 'ua-parser-js';
import { IPUtils } from '../util/ip';
@Middleware()
export class BrowserMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  ipUtils: IPUtils;
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const userAgent = ctx.get('user-agent');
      const ip = this.ipUtils.query(ctx.get('ip'));
      const parser = new UAParser(userAgent);
      // 将浏览器信息挂载到 ctx 上
      ctx.browserInfo = {
        userAgent,
        ip,
        browser: parser.getBrowser(),
        os: parser.getOS(),
        device: parser.getDevice(),
        engine: parser.getEngine(),
      };
      return await next();
    };
  }
  static getName(): string {
    return 'browser';
  }
}
