import { ApiProperty } from '@midwayjs/swagger';
import { Rule, RuleType, OmitDto } from '@midwayjs/validate';
import { PageDto } from '../../../common/dto/page.dto';

export class UserDto {
  @ApiProperty({
    description: '用户ID',
  })
  @Rule(RuleType.string().required())
  id: number;
  @ApiProperty({
    description: '用户名',
  })
  @Rule(RuleType.string().required())
  username: string;
  @ApiProperty({
    description: '用户昵称',
  })
  nick: string;
  @ApiProperty({
    description: '用户邮箱',
  })
  @Rule(RuleType.string().required())
  email: string;
  @ApiProperty({
    description: '用户手机号',
  })
  @Rule(RuleType.string().required())
  phone: string;
  @ApiProperty({
    description: '用户性别',
  })
  gender: string;
  @ApiProperty({
    description: '用户状态',
  })
  enable: boolean;
}

export class DeleteUserDto {
  @ApiProperty({
    description: '删除用户的id集合 如：[1,2,3]',
    type: String,
    isArray: true,
  })
  @Rule(RuleType.array().items(RuleType.string().required()).required())
  ids: string[];
}


export class UserQueryDto extends PageDto {
 @Rule(RuleType.string().allow(''))
  keyword?: string;
  @Rule(RuleType.number().optional())
  enabled?: number;
  @Rule(RuleType.string().optional())
  startTime?: string;
  @Rule(RuleType.string().optional())
  endTime?: string;
}

export class CreateUserDto extends OmitDto(UserDto, ['id']) {}
