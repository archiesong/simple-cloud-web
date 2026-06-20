import {
  Middleware,
  IMiddleware,
  Config,
  HttpStatus,
  Inject,
} from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
import { JwtService } from '@midwayjs/jwt';
import { BusinessException } from '../exception/business.exception';
import { TokenPayload } from '../interface';
import { JWT_HEADER, TOKEN_START_WITH } from '../common/constant/token';

@Middleware()
export class JwtMiddleware implements IMiddleware<Context, NextFunction> {
  @Config('jwtWhiteList')
  private whiteList: RegExp[];
  @Config('koa.globalPrefix')
  private globalPrefix?: string;
  @Inject()
  jwtService: JwtService;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      if (!ctx.headers[JWT_HEADER.toLowerCase()]) {
        throw new BusinessException('未授权!', HttpStatus.UNAUTHORIZED);
      }
      // 从 header 上获取校验信息
      const parts: string[] = ctx.get(JWT_HEADER).trim().split(' ');
      if (parts.length !== 2) {
        throw new BusinessException('未授权!', HttpStatus.UNAUTHORIZED);
      }
      const [scheme, token]: string[] = parts;
      if (new RegExp(`^${TOKEN_START_WITH}$`, 'i').test(scheme)) {
        try {
          //jwt.verify方法验证token是否有效
          ctx.state.user = (await this.jwtService.verify(
            token
          )) as unknown as TokenPayload;
        } catch (error) {
          throw new BusinessException(
            'token 无效或已过期',
            HttpStatus.UNAUTHORIZED
          );
        }
      }
      return await next();
    };
  }

  static getName(): string {
    return 'jwt';
  }

  // 配置忽略鉴权的路由地址
  public match(ctx: Context): boolean {
    const paths = [ctx.path];
    if (this.globalPrefix) {
      const prefix = this.globalPrefix.startsWith('/')
        ? this.globalPrefix
        : `/${this.globalPrefix}`;
      if (!ctx.path.startsWith(`${prefix}/`)) {
        paths.push(`${prefix}${ctx.path}`);
      }
    }
    return !this.whiteList.some(item => paths.some(path => item.test(path)));
  }
}
