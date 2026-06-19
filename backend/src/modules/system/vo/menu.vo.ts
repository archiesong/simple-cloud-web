import { ApiProperty } from '@midwayjs/swagger';
import { SuccessWrapper } from '../../../util/success.wrapper';
import { Menu, MenuTypeEnum } from '../entity/menu.entity';

export class MenuVo {
  @ApiProperty({ description: 'ID' })
  id: string;

  @ApiProperty({ description: '菜单标题' })
  title: string;

  @ApiProperty({ description: '菜单组件名称' })
  name: string;

  @ApiProperty({ description: '排序' })
  sort: number;

  @ApiProperty({ description: '组件路径' })
  component: string;

  @ApiProperty({ description: '路由地址' })
  path: string;

  @ApiProperty({ description: '重定向地址' })
  redirect: string;

  @ApiProperty({ description: '菜单类型：目录、菜单、按钮' })
  type: MenuTypeEnum;

  @ApiProperty({ description: '权限标识' })
  permission: string;

  @ApiProperty({ description: '菜单图标' })
  icon: string;

  @ApiProperty({ description: '缓存' })
  cache: boolean;

  @ApiProperty({ description: '是否隐藏' })
  hidden: boolean;

  @ApiProperty({ description: '上级菜单' })
  pid: string;
  
  @ApiProperty({ description: '菜单是否启用' })
  enabled: boolean;
  
  @ApiProperty({ description: '面包屑是否可见' })
  breadcrumb: boolean;
  
  @ApiProperty({ description: '是否隐藏子菜单' })
  hideChildrenInMenu: boolean;
  
  @ApiProperty({ description: '是否固定标签页' })
  affix: boolean;
  
  @ApiProperty({ description: '子菜单', type: [MenuVo] })
  children: MenuVo[];
  
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
  constructor(
    id?: string,
    name?: string,
    title?: string,
    sort?: number,
    component?: string,
    path?: string,
    redirect?: string,
    type?: MenuTypeEnum,
    permission?: string,
    icon?: string,
    cache?: boolean,
    hidden?: boolean,
    pid?: string,
    enabled?: boolean,
    breadcrumb?: boolean,
    hideChildrenInMenu?: boolean,
    affix?: boolean,
    children?: MenuVo[],
    create_by?: string,
    update_by?: string,
    create_time?: Date,
    update_time?: Date,
  ) {
    this.id = id || '0';
    this.name = name || '';
    this.title = title || '';
    this.sort = sort || 999;
    this.component = component || '';
    this.path = path || '';
    this.redirect = redirect || '';
    this.type = type ?? MenuTypeEnum.MENU;
    this.permission = permission || '';
    this.icon = icon || '';
    this.cache = cache ?? true;
    this.hidden = hidden ?? false;
    this.pid = pid || '0';
    this.enabled = enabled ?? true;
    this.breadcrumb = breadcrumb ?? true;
    this.hideChildrenInMenu = hideChildrenInMenu ?? false;
    this.affix = affix ?? false;
    this.children = children || [];
    this.create_by = create_by || '';
    this.update_by = update_by || '';
    this.create_time = create_time || new Date();
    this.update_time = update_time || new Date();
  }

  static fromEntity(menu: Menu): MenuVo {
    return new MenuVo(
      menu.id.toString(),
      menu.name,
      menu.title,
      menu.sort,
      menu.component,
      menu.path,
      menu.redirect,
      menu.type,
      menu.permission,
      menu.icon,
      menu.cache,
      menu.hidden,
      menu.pid?.toString(),
      menu.enabled,
      menu.breadcrumb,
      menu.hideChildrenInMenu,
      menu.affix,
      undefined,
      menu.create_by,
      menu.update_by,
      menu.create_time,
      menu.update_time,
    );
  }
}

export class MenuRouteVo {
  constructor(routes: MenuVo[]) {
    this.routes = routes;
  }
  @ApiProperty({ description: '菜单列表', type: [MenuVo] })
  routes: MenuVo[];
}

export class MenuRouteResponseVo extends SuccessWrapper<MenuRouteVo>(MenuRouteVo) {}


export class MenuListVo {
 constructor(options: {
    data: MenuVo[];
    total: number;
    current: number;
    pageSize: number;
  }) {
    this.data = options.data;
    this.pageSize = options.pageSize;
    this.current = options.current;
    this.total = options.total;
  }
  @ApiProperty({
    description: '列表数据',
  })
  data: MenuVo[];
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
export class MenuListResponseVo extends SuccessWrapper<MenuListVo>(MenuListVo) {}

export class MenuSelectTreeNodeVo {
  @ApiProperty({ description: '节点值' })
  value: string;
  
  @ApiProperty({ description: '节点标题' })
  title: string;
  
  @ApiProperty({ description: '子节点', type: [MenuSelectTreeNodeVo] })
  children: MenuSelectTreeNodeVo[];

  constructor(value: string, title: string, children: MenuSelectTreeNodeVo[] = []) {
    this.value = value;
    this.title = title;
    this.children = children;
  }

  static fromMenuVo(menu: MenuVo): MenuSelectTreeNodeVo {
    const node = new MenuSelectTreeNodeVo(menu.id.toString(), menu.title);
    if (menu.children && menu.children.length > 0) {
      node.children = menu.children.map(child => MenuSelectTreeNodeVo.fromMenuVo(child));
    }
    return node;
  }
}

export class MenuTreeVo {
  constructor(trees: MenuVo[]) {
    this.trees = trees;
  }
  @ApiProperty({ description: '菜单树列表', type: [MenuVo] })
  trees: MenuVo[];
}
export class MenuTreeResponseVo extends SuccessWrapper<MenuTreeVo>(MenuTreeVo) {}


export class MenuDetailResponseVo extends SuccessWrapper<MenuVo>(MenuVo) {}

export class DeleteMenuVo {}

export class DeleteMenuResponseVo extends SuccessWrapper<DeleteMenuVo>(DeleteMenuVo) {}
