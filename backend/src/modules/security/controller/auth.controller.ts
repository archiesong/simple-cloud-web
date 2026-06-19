import { Body, Controller, Get, Inject, Post, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { Validate } from '@midwayjs/validate';
import { ApiBearerAuth } from '@midwayjs/swagger';
import { BaseController } from '../../../common/controller/base.controller';
import {
  GetApiResponse,
  PostApiResponse,
} from '../../../common/decorator/auto.api.decorators';
import { AuthService } from '../service/auth.service';
import { AuthDto } from '../dto/auth.dto';
import {
  LoginResponseVo,
  CaptchaResponseVo,
  LogoutResponseVo,
  InfoResponseVo,
  PublicKeyResponseVo,
} from '../vo/auth.vo';

@Controller('/auth', {
  description: 'Authorization Controller',
  tagName: '系统：系统授权接口',
})
export class AuthController extends BaseController {
  @Inject()
  ctx: Context;
  @Inject()
  authService: AuthService;
  @GetApiResponse({
    successType: PublicKeyResponseVo,
    successDescription: 'OK',
  })
  @Get('/publicKey', { summary: '获取公钥' })
  async publicKey(): Promise<PublicKeyResponseVo> {
    return this.ok(await this.authService.publicKey());
  }
  @Get('/captcha', { summary: '获取验证码' })
  @GetApiResponse({
    successDescription: 'OK',
    successType: CaptchaResponseVo,
  })
  async captcha(
    @Query('height') height: number,
    @Query('width') width: number
  ): Promise<CaptchaResponseVo> {
    return this.ok(await this.authService.captcha({ width, height }));
  }

  @PostApiResponse({
    successType: LoginResponseVo,
    successDescription: 'OK',
  })
  @Post('/login', { summary: '登录授权', description: '用户登录' })
  @Validate()
  async login(@Body() authUser: AuthDto): Promise<LoginResponseVo> {
    return this.ok(await this.authService.login(authUser));
  }
  @ApiBearerAuth('BasicAuth')
  @GetApiResponse({
    successType: InfoResponseVo,
    successDescription: 'OK',
  })
  @Get('/info', { summary: '获取用户信息' })
  async info(): Promise<InfoResponseVo> {
    return this.ok(await this.authService.info());
  }
  @GetApiResponse({
    successType: LogoutResponseVo,
    successDescription: 'OK',
  })
  @Get('/logout', { summary: '退出登录' })
  async logout(): Promise<LogoutResponseVo> {
    return this.ok(await this.authService.logout(), '退出成功!');
  }
}
