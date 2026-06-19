import { Column, Entity, Index, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';
import { Role } from './role.entity';

export enum MenuTypeEnum {
  DIRECTORY, // 目录
  MENU, // 菜单
  BUTTON, // 按钮
}
@Entity('sys_menu', { comment: '菜单表' })
export class Menu extends BaseEntity {
  @Column({
    unique: true,
    comment: '菜单标题',
    length: 100,
  })
  title: string;
  @Column({
    unique: true,
    comment: '菜单组件名称',
    length: 100,
    nullable: true,
  })
  name: string;
  @Column({
    comment: '排序',
    default: 999,
  })
  sort: number;
  @Column({
    comment: '组件路径',
    nullable: true,
  })
  component: string;
  @Column({
    comment: '路由地址',
    nullable: true,
  })
  path: string;
  @Column({
    comment: '重定向地址',
    nullable: true,
  })
  redirect: string;
  @Column({
    type: 'enum',
    enum: MenuTypeEnum,
    comment: '菜单类型：目录、菜单、按钮',
    default: MenuTypeEnum.MENU,
  })
  type: MenuTypeEnum;
  @Column({
    comment: '权限标识',
    nullable: true,
  })
  permission: string;
  @Column({
    comment: '菜单图标',
    nullable: true,
  })
  icon: string;
  @Column({
    comment: '缓存',
    nullable: true,
  })
  cache: boolean;
  @Column({
    comment: '是否隐藏',
    nullable: true,
  })
  hidden: boolean;
  @Column({
    type: 'bigint',
    nullable: true,
    comment: '上级菜单',
  })
  @Index()
  pid: number;

  @Column({
    comment: '菜单是否启用',
    default: true,
  })
  @Index()
  enabled: boolean;

  @Column({
    comment: '面包屑是否可见',
    default: true,
  })
  breadcrumb: boolean;

  @Column({
    comment: '是否隐藏子菜单',
    default: false,
  })
  hideChildrenInMenu: boolean;

  @Column({
    comment: '是否固定标签页',
    default: false,
  })
  affix: boolean;

  @ManyToMany(() => Role, role => role.menus)
  roles: Role[];
}
