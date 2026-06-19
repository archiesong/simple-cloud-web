import { ApiProperty } from "@midwayjs/swagger";
import { Rule, RuleType, OmitDto } from "@midwayjs/validate";
import { PageDto } from "../../../common/dto/page.dto";
import { MenuTypeEnum } from "../entity/menu.entity";

export class MenuDto {
  @ApiProperty({
	description: '菜单ID',
  })
  @Rule(RuleType.string().required())
  id: string;

  @ApiProperty({
    description: '菜单标题',
  })
  @Rule(RuleType.string().required())
  title: string;

  @ApiProperty({
    description: '菜单组件名称',
  })
  @Rule(RuleType.string().allow('').optional())
  name: string;

  @ApiProperty({
    description: '排序',
  })
  @Rule(RuleType.number().optional())
  sort?: number;

  @ApiProperty({
    description: '组件路径',
  })
  @Rule(RuleType.string().allow('').optional())
  component?: string;

  @ApiProperty({
    description: '路由地址',
  })
  @Rule(RuleType.string().allow('').optional())
  path?: string;

  @ApiProperty({
    description: '重定向地址',
  })
  @Rule(RuleType.string().allow('').optional())
  redirect?: string;

  @ApiProperty({
    description: '菜单类型：目录、菜单、按钮',
    enum: MenuTypeEnum,
  })
  @Rule(RuleType.number().required())
  type: MenuTypeEnum;

  @ApiProperty({
    description: '权限标识',
  })
  @Rule(RuleType.string().allow('').optional())
  permission?: string;

  @ApiProperty({
    description: '菜单图标',
  })
  @Rule(RuleType.string().allow('').optional())
  icon?: string;

  @ApiProperty({
    description: '缓存',
  })
  @Rule(RuleType.boolean().optional())
  cache?: boolean;

  @ApiProperty({
    description: '是否隐藏',
  })
  @Rule(RuleType.boolean().optional())
  hidden?: boolean;

  @ApiProperty({
    description: '上级菜单',
  })
  @Rule(RuleType.string().optional())
  pid?: string;

  @ApiProperty({
    description: '菜单是否启用',
  })
  @Rule(RuleType.boolean().optional())
  enabled?: boolean;

  @ApiProperty({
    description: '面包屑是否可见',
  })
  @Rule(RuleType.boolean().optional())
  breadcrumb?: boolean;

  @ApiProperty({
    description: '是否隐藏子菜单',
  })
  @Rule(RuleType.boolean().optional())
  hideChildrenInMenu?: boolean;

  @ApiProperty({
    description: '是否固定标签页',
  })
  @Rule(RuleType.boolean().optional())
  affix?: boolean;
}

export class CreateMenuDto extends OmitDto(MenuDto, ['id']) {}

export class DeleteMenuDto {
  @ApiProperty({
    description: '删除菜单的id集合 如：[1,2,3]',
    type: String,
    isArray: true,
  })
  @Rule(RuleType.array().items(RuleType.string().required()).required())
  ids: string[];
}

export class MenuQueryDto extends PageDto {
  @ApiProperty({
    description: '查询菜单标题',
    type: String,
  })
 @Rule(RuleType.string().allow(''))
  title?: string;
  @ApiProperty({
    description: '查询菜单是否启用',
    type: Boolean,
  })
  @Rule(RuleType.boolean().optional())
  enabled?: boolean;
  @ApiProperty({
    description: '查询菜单创建时间开始',
    type: String,
  })
  @Rule(RuleType.string().optional())
  startTime?: string;
  @ApiProperty({
    description: '查询菜单创建时间结束',
    type: String,
  })
  @Rule(RuleType.string().optional())
  endTime?: string;
}

export class MenuIdDto {
  @ApiProperty({
    description: '菜单ID',
  })
  @Rule(RuleType.string().required())
  id: string;
}

export class MenuTreeDto {
  @ApiProperty({
    description: '是否包含按钮类型菜单',
    required: false,
  })
  @Rule(RuleType.boolean().optional())
  includeButton?: boolean;
}

