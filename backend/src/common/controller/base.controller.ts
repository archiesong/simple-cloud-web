import { Init, Inject, Provide } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
/**
 * 控制器基类
 */
@Provide()
export abstract class BaseController {
  @Inject()
  ctx: Context;
  @Init()
  async init() {}
  ok<T>(data?: T, message = 'success') {
    return { code: 200, message, data };
  }
}
