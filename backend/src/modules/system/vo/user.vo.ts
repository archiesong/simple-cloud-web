import { SuccessWrapper } from '../../../util/success.wrapper';
import { ApiProperty } from '@midwayjs/swagger';
import { GenderEnum, User } from '../entity/user.entity';
import { RoleSmallVo } from './role.vo';
import { DeptSmallVo } from './dept.vo';
import { JobSmallVo } from './job.vo';
import { DataScopeEnum } from '../entity/role.entity';
export class UserVo {
  @ApiProperty({
    description: 'ID',
  })
  id: number;
  @ApiProperty({
    description: '部门ID',
  })
  deptId: number;
  @ApiProperty({
    description: '用户名',
  })
  username: string;
  @ApiProperty({
    description: '昵称',
  })
  nick: string;
  @ApiProperty({
    description: '邮箱',
  })
  email: string;
  @ApiProperty({
    description: '电话',
  })
  phone: string;
  @ApiProperty({
    description: '性别',
    enum: GenderEnum,
  })
  gender: GenderEnum;
  @ApiProperty({
    description: '头像',
  })
  avatar: string;
  @ApiProperty({
    description: '角色',
  })
  roles: RoleSmallVo[];
  @ApiProperty({
    description: '角色标识列表',
  })
  roleCodes: string[];
  @ApiProperty({
    description: '权限标识列表',
  })
  permissions: string[];
  @ApiProperty({
    description: '数据权限范围列表',
    enum: DataScopeEnum,
    isArray: true,
  })
  dataScopes: DataScopeEnum[];
  @ApiProperty({
    description: '岗位',
  })
  jobs: JobSmallVo[];
  @ApiProperty({
    description: '部门',
  })
  dept: DeptSmallVo;
  @ApiProperty({
    description: '账号是否启用',
  })
  enabled: boolean;
  @ApiProperty({
    description: '账号是否删除',
  })
  is_delete: boolean;
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
  static fromEntity(user: User): UserVo {
    const vo = new UserVo();
    vo.id = user.id;
    vo.username = user.username;
    vo.email = user.email;
    vo.avatar = user.avatar;
    vo.gender = user.gender;
    vo.phone = user.phone;
    vo.create_by = user.create_by
    vo.create_time = user.create_time
    vo.update_by = user.update_by
    vo.update_time = user.update_time
    vo.is_delete = user.is_delete
    vo.enabled = user.enabled
    vo.nick = user.nick;
    vo.deptId = user.dept_id ?? null;
    vo.roles = (user.roles ?? []).map(RoleSmallVo.fromEntity);
    vo.roleCodes = Array.from(
      new Set(
        (user.roles ?? [])
          .map(role => role.code)
          .filter(code => Boolean(code))
      )
    );
    vo.permissions = Array.from(
      new Set(
        (user.roles ?? [])
          .reduce((menus, role) => menus.concat(role.menus ?? []), [])
          .map(menu => menu.permission)
          .filter(permission => Boolean(permission))
      )
    );
    vo.dataScopes = Array.from(
      new Set((user.roles ?? []).map(role => role.dataScope))
    );
    vo.jobs = (user.jobs ?? []).map(JobSmallVo.fromEntity);
    vo.dept = user.dept ? DeptSmallVo.fromEntity(user.dept) : null;
    return vo;
  }
}

export class DeleteUserVo {}

export class UserListVo {
  constructor(options: {
    data: User[];
    total: number;
    current: number;
    pageSize: number;
  }) {
    this.data = options.data.map(user => UserVo.fromEntity(user));
    this.pageSize = options.pageSize;
    this.current = options.current;
    this.total = options.total;
  }
  @ApiProperty({
    description: '列表数据',
  })
  data: UserVo[];
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

export class UserListResponseVo extends SuccessWrapper<UserListVo>(
  UserListVo
) {}

export class DeleteUserResponseVo extends SuccessWrapper<DeleteUserVo>(
  DeleteUserVo
) {}
