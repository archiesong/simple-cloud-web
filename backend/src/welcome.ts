import { Controller, Get, Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ApiExcludeController } from '@midwayjs/swagger';

@ApiExcludeController()
@Controller('/', { ignoreGlobalPrefix: true })
export class WelcomeController {
  @Inject()
  ctx: Context;
  @Get('/', { summary: 'swagger-ui接口文档界面' })
  public async welcome() {
    this.ctx.redirect('/swagger-ui/index.html');
  }
}
