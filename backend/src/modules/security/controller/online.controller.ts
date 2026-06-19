import {
  Body,
  Controller,
  Del,
  Get,
  Inject,
  // HttpServerResponse,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ApiOkResponse } from '@midwayjs/swagger';
import { OnlineService } from '../service/online.service';
import { BaseController } from '../../../common/controller/base.controller';

@Controller('/auth/online', {
  description: 'Online Controller',
  tagName: '系统：在线用户管理',
})
export class OnlineController extends BaseController {
  @Inject()
  ctx: Context;
  @Inject()
  onlineUserService: OnlineService;
  @Get('/list', { summary: '查询用户列表' })
  async query(): Promise<any> {}
  @ApiOkResponse({
    description: 'OK',
  })
  @Del('/delete', { summary: '踢出用户' })
  async delete(@Body() keys: string[]) {
    return this.ok(await this.onlineUserService.delete(keys));
  }
}
