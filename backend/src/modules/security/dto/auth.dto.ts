import { ApiProperty } from '@midwayjs/swagger';
import { Rule, RuleType } from '@midwayjs/validate';

export class AuthDto {
  @ApiProperty({
    description: '用户名',
    default: 'admin',
  })
  @Rule(RuleType.string().required())
  username: string;

  @ApiProperty({
    description: '密码',
    default:
      'NhMRW3md6TluB4hv1k0htEUchlAxtbwnud3l/yu5HKPwu3tpANQTZSTPt/Xu0FLDWtN2wfj9cEBN7rPxSeQysk65ldrJPtpZIvBKOfs/V/5tLFVdVzyN+A3n544G1aR9iG9GiQrkneNTlWTAHi7XtWQ3FEBouG7R80i0Td9HCrvPMlqDJolkfsBumyowSKqq8uwQQExrb6aLKtnr5EYS4r5wDC5RsTByJz7qpnpsq+HZsa+29PQcmbFFwlm190k722Y+iLoiMNvRiN91GcuMZmtZXOkyXvbQkDGhYBNb+Us4zw5Qqbu6Cm6IBcatkx+lRx/TR7FiFzY/EaBcr1x0HQ== ',
  })
  @Rule(RuleType.string().required())
  password: string;

  @ApiProperty({
    description: '验证码',
  })
  @Rule(RuleType.string().required())
  captcha: string;

  @ApiProperty({
    description: '验证码ID',
  })
  @Rule(RuleType.string().required())
  captchaId: string;
}
