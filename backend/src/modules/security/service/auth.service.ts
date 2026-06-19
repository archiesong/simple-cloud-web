import { Config, Inject, Provide } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { CaptchaService, CaptchaOptions } from '@midwayjs/captcha';
import { JwtService } from '@midwayjs/jwt';
import { AuthDto } from '../dto/auth.dto';
import {
  AuthInfoVo,
  AuthUserVo,
  CaptchaVo,
  LoginVo,
  PublicKeyVo,
} from '../vo/auth.vo';
import { BusinessException } from '../../../exception/business.exception';
import {
  USER_SERVICE_IDENTIFIER,
  UserService,
} from '../../system/service/user.service';
import { RsaUtils } from '../../../util/rsa';
import { HashEncoder } from '../../../util/hash.encoder';
import { OnlineService } from './online.service';
import { TokenService } from '../../../common/service/token.service';
import { UserVo } from '../../system/vo/user.vo';

@Provide()
export class AuthService {
  @Inject()
  ctx: Context;
  @Inject()
  captchaService: CaptchaService;
  @Inject()
  jwtService: JwtService;
  @Inject(USER_SERVICE_IDENTIFIER)
  userService: UserService;
  @Inject()
  tokenService: TokenService;
  @Inject()
  onlineService: OnlineService;
  @Inject()
  rsaUtils: RsaUtils;
  @Config('captcha')
  captchaConfig: CaptchaOptions;
  @Config('login.singleLogin')
  isSingleLogin: boolean;
  @Config('rsaKeyPair')
  rsaKeyPair: {
    privateKey: string;
    publicKey: string;
  };
  @Inject()
  hashEncoder: HashEncoder;

  /**
   * 获取公钥
   */
  async publicKey(): Promise<PublicKeyVo> {
    return Promise.resolve(
      new PublicKeyVo(
        this.rsaKeyPair.publicKey
          .replace('-----BEGIN PUBLIC KEY-----', '')
          .replace('-----END PUBLIC KEY-----', '')
          .replace(/\s+/g, '')
      )
    );
  }
  /**
   * 获取验证码
   * @param {object} options - 验证码对象参数
   * @param {number} options.width - 验证码对象参数的 width 属性
   * @param {number} options.height - 验证码对象参数的 height 属性
   * @returns {object} 图片验证码
   */
  async captcha(options: {
    width?: number;
    height?: number;
  }): Promise<CaptchaVo> {
    const width =
      this.captchaConfig.image.width || this.captchaConfig.default.width;
    const height =
      this.captchaConfig.image.height || this.captchaConfig.default.height;
    const { id: captchaId, imageBase64: captcha } =
      await this.captchaService.image({
        ...this.captchaConfig.image,
        width: options.width || width,
        height: options.height || height,
      });
    return Promise.resolve(new CaptchaVo(captchaId, captcha));
  }
  /**
   * 用户登录
   * @param {object} authUser - 登录参数
   * @param {string} authUser.captchaId - 验证码ID
   * @param {string} authUser.captcha - 验证码
   * @param {string} authUser.username - 用户名
   * @param {string} authUser.password - 密码
   * @returns {string} 用户唯一身份令牌
   */
  async login(authUser: AuthDto): Promise<LoginVo> {
    // 密码解密
    const password = this.rsaUtils.decryptByPrivateKey(
      authUser.password,
      this.rsaKeyPair.privateKey
    );
    const isCorrect: boolean = await this.captchaService.check(
      authUser.captchaId,
      authUser.captcha
    );
    if (!isCorrect) throw new BusinessException('验证码错误或已过期!');
    // 获取用户信息
    const loginUser = await this.userService.findLoginUserByUsername(
      authUser.username
    );
    // 验证用户密码
    if (!(await this.hashEncoder.matches(password, loginUser.password)))
      throw new BusinessException('登录密码错误');
    // 如果是单点登录
    if (this.isSingleLogin) {
      // 踢掉之前已经登录的token
      await this.onlineService.kickOutForUsername(authUser.username);
    }
    // 生成令牌
    const token = await this.tokenService.createToken({
      userId: loginUser.id,
      username: authUser.username,
    });
    // 保存在线信息
    await this.onlineService.save(UserVo.fromEntity(loginUser), token);
    return Promise.resolve(new LoginVo(token));
  }

  /**
   * 用户信息
   * @returns {UserVo} 返回用户信息
   */
  async info(): Promise<AuthInfoVo> {
    const userVo = await this.userService.findUserByUsername(this.ctx.state.user.username);
    return Promise.resolve(AuthInfoVo.fromUser(userVo));
  }
  /**
   * 用户退出
   */
  async logout(): Promise<AuthUserVo> {
    return {};
  }
}
