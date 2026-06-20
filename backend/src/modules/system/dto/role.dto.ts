
import { ApiProperty } from "@midwayjs/swagger";
import { Rule, RuleType } from "@midwayjs/validate";
import { PageDto } from "../../../common/dto/page.dto";

export class RoleDto {
  @ApiProperty({
    description: '角色ID',
  })
  @Rule(RuleType.string().required())
  id: number;
  @ApiProperty({
    description: '角色名称',
  })
  @Rule(RuleType.string().required())
  name: string;
  @ApiProperty({
    description: '角色描述',
  })
  @Rule(RuleType.string().required())
  description: string;
}


export class RoleQueryDto extends PageDto {
 @Rule(RuleType.string().allow(''))
  keyword?: string;
  @Rule(RuleType.number().optional())
  enabled?: number;
  @Rule(RuleType.string().optional())
  startTime?: string;
  @Rule(RuleType.string().optional())
  endTime?: string;
}

export class RoleIdDto {
  @ApiProperty({
    description: '角色ID',
  })
  @Rule(RuleType.string().required())
  id: string;
}

export class RoleAssignMenusDto {
  @ApiProperty({
    description: '角色ID',
  })
  @Rule(RuleType.string().required())
  id: string;

  @ApiProperty({
    description: '角色权限菜单ID集合',
    type: String,
    isArray: true,
  })
  @Rule(RuleType.array().items(RuleType.string().required()).required())
  menuIds: string[];
}
