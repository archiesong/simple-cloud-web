import { ApiProperty } from '@midwayjs/swagger';
import { SuccessWrapper } from '../../../util/success.wrapper';
import { DataScopeEnum } from '../../system/entity/role.entity';
import { UserVo } from '../../system/vo/user.vo';

export class AuthUserVo {}

export class AuthInfoVo {
  @ApiProperty({ description: '用户ID' })
  id: number;

  @ApiProperty({ description: '用户名' })
  username: string;

  @ApiProperty({ description: '昵称' })
  nick: string;

  @ApiProperty({ description: '头像' })
  avatar: string;

  @ApiProperty({ description: '角色标识列表' })
  roles: string[];

  @ApiProperty({ description: '权限标识列表' })
  permissions: string[];

  @ApiProperty({
    description: '数据权限范围列表',
    enum: DataScopeEnum,
    isArray: true,
  })
  dataScopes: DataScopeEnum[];

  static fromUser(user: UserVo): AuthInfoVo {
    const vo = new AuthInfoVo();
    vo.id = user.id;
    vo.username = user.username;
    vo.nick = user.nick;
    vo.avatar = user.avatar;
    vo.roles = user.roleCodes ?? [];
    vo.permissions = user.permissions ?? [];
    vo.dataScopes = user.dataScopes ?? [];
    return vo;
  }
}

export class CaptchaVo {
  constructor(captchaId: string, captcha: string) {
    this.captchaId = captchaId;
    this.captcha = captcha;
  }
  @ApiProperty({
    description: '验证码ID',
  })
  captchaId: string;
  @ApiProperty({
    description: '验证码',
  })
  captcha: string;
}

export class LoginVo {
  constructor(token: string) {
    this.token = token;
  }
  @ApiProperty({
    description: '登录用户唯一身份令牌',
  })
  token: string;
}

export class PublicKeyVo {
  constructor(publicKey: string) {
    this.publicKey = publicKey;
  }
  @ApiProperty({
    description: '加密公钥',
  })
  publicKey: string;
}

export class PublicKeyResponseVo extends SuccessWrapper<PublicKeyVo>(
  PublicKeyVo
) {}
export class LoginResponseVo extends SuccessWrapper<LoginVo>(LoginVo) {}

export class CaptchaResponseVo extends SuccessWrapper<CaptchaVo>(CaptchaVo) {}

export class InfoResponseVo extends SuccessWrapper<AuthInfoVo>(AuthInfoVo) {}

export class LogoutResponseVo extends SuccessWrapper<AuthUserVo>(AuthUserVo) {}
