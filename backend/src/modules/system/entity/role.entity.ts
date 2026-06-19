import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';
import { User } from './user.entity';
import { Menu } from './menu.entity';
import { Dept } from './dept.entity';

export enum DataScopeEnum {
  ALL, //全部的数据权限 = '全部'
  THIS_LEVEL , // 自己部门的数据权限 = '本级'
  CUSTOMIZE, //自定义的数据权限  = '自定义'
}

@Entity('sys_role', { comment: '角色表' })
export class Role extends BaseEntity {
  @Column({
    unique: true,
    length: 100,
    comment: '名称',
  })
  name: string;
  @Column({
    comment: '数据权限：全部 、本级 、自定义',
    type: 'tinyint',
    default: DataScopeEnum.THIS_LEVEL,
  })
  dataScope: number;
  @Column({
    comment: '角色是否启用',
    default: true,
  })
  @Index()
  enabled: boolean;
   @Column({
    comment: '角色标识',
    nullable: true,
  })
  code: string;
  @Column({
    comment: '级别，数值越小，级别越大',
    default: 3,
  })
  @Index()
  level: number;
  @Column({
    comment: '描述',
    nullable: true,
  })
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToMany(type => User, user => user.roles)
  users: User[];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToMany(type => Menu, menu => menu.roles, {
    createForeignKeyConstraints: false,
  })
  @JoinTable({
    name: 'sys_roles_menus',
    joinColumn: {
      name: 'role_id',
    },
    inverseJoinColumn: {
      name: 'menu_id',
    },
  })
  menus: Menu[];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToMany(type => Dept, dept => dept.roles, {
    createForeignKeyConstraints: false,
  })
  @JoinTable({
    name: 'sys_roles_depts',
    joinColumn: {
      name: 'role_id',
    },
    inverseJoinColumn: {
      name: 'dept_id',
    },
  })
  depts: Dept[];
}
