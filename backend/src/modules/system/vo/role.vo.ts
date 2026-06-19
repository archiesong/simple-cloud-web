import { ApiProperty } from '@midwayjs/swagger';
import { DataScopeEnum, Role } from '../entity/role.entity';
import { MenuVo } from './menu.vo';
import { SuccessWrapper } from '../../../util/success.wrapper';

export class RoleVo {
  @ApiProperty({
    description: 'ID',
  })
  id: number;
  @ApiProperty({
    description: '名称',
  })
  name: string;
  @ApiProperty({
    description: '数据权限',
  })
  dataScope: DataScopeEnum;
  @ApiProperty({
    description: '角色标识',
  })
  code: string;
  @ApiProperty({
    description: '级别',
  })
  level: number;
    @ApiProperty({
    description: '角色是否启用',
  })
  enabled: boolean;
  @ApiProperty({
    description: '描述',
  })
  description: string;
    @ApiProperty({
    description: '创建人',
  })
  create_by: string;
  @ApiProperty({
    description: '更新人',
  })
  update_by: string;
  @ApiProperty({
    description: '创建时间 yyyy-MM-dd HH:mm:ss',
  })
  create_time: Date;
  @ApiProperty({
    description: '更新时间 yyyy-MM-dd HH:mm:ss',
  })
  update_time: Date;
  constructor(role: Role) {
    this.id = role.id;
    this.name = role.name;
    this.dataScope = role.dataScope;
    this.level = role.level;
    this.enabled = role.enabled;
    this.description = role.description;
    this.code = role.code;
    this.create_by = role.create_by;
    this.update_by = role.update_by;
    this.create_time = role.create_time;
    this.update_time = role.update_time;
  }
}

export class RoleSmallVo {
  @ApiProperty({
    description: 'ID',
  })
  id: number;
  @ApiProperty({
    description: '名称',
  })
  name: string;
  @ApiProperty({
    description: '角色标识',
  })
  code: string;
  @ApiProperty({
    description: '数据权限',
  })
  dataScope: DataScopeEnum;
  @ApiProperty({
    description: '级别',
  })
  level: number;
  static fromEntity(role: Role): RoleSmallVo {
    const vo = new RoleSmallVo();
    vo.id = role.id;
    vo.name = role.name;
    vo.level = role.level;
    vo.dataScope = role.dataScope;
    vo.code = role.code;
    return vo;
  }
}


export class RoleListVo {
  constructor(options: {
    data: Role[];
    total: number;
    current: number;
    pageSize: number;
  }) {
    this.data = options.data.map(role => new RoleVo(role));
    this.pageSize = options.pageSize;
    this.current = options.current;
    this.total = options.total;
  }
  @ApiProperty({
    description: '列表数据',
  })
  data: RoleSmallVo[];
  @ApiProperty({ description: '总条数' })
  total: number;
  @ApiProperty({
    description: '当前页',
  })
  current: number;
  @ApiProperty({
    description: '当前条数',
  })
  pageSize: number;
}

export class RoleListResponseVo extends SuccessWrapper<RoleListVo>(
  RoleListVo
) {}

export class RoleDetailVo {
  @ApiProperty({
    description: 'ID',
  })
  id: number;
  @ApiProperty({
    description: '名称',
  })
  name: string;
  @ApiProperty({
    description: '数据权限',
  })
  dataScope: DataScopeEnum;
  @ApiProperty({
    description: '角色标识',
  })
  code: string;
  @ApiProperty({
    description: '级别',
  })
  level: number;
  @ApiProperty({
    description: '角色是否启用',
  })
  enabled: boolean;
  @ApiProperty({
    description: '描述',
  })
  description: string;
  @ApiProperty({
    description: '创建人',
  })
  create_by: string;
  @ApiProperty({
    description: '更新人',
  })
  update_by: string;
  @ApiProperty({
    description: '创建时间 yyyy-MM-dd HH:mm:ss',
  })
  create_time: Date;
  @ApiProperty({
    description: '更新时间 yyyy-MM-dd HH:mm:ss',
  })
  update_time: Date;
  @ApiProperty({
    description: '角色权限菜单',
    type: [MenuVo],
  })
  menus: MenuVo[];

  constructor(role: Role, menus: MenuVo[]) {
    this.id = role.id;
    this.name = role.name;
    this.dataScope = role.dataScope;
    this.level = role.level;
    this.enabled = role.enabled;
    this.description = role.description;
    this.code = role.code;
    this.create_by = role.create_by;
    this.update_by = role.update_by;
    this.create_time = role.create_time;
    this.update_time = role.update_time;
    this.menus = menus;
  }
}

export class RoleDetailResponseVo extends SuccessWrapper<RoleDetailVo>(
  RoleDetailVo
) {}
