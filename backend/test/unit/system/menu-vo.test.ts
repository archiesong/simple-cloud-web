import { MenuTypeEnum } from '../../../src/modules/system/entity/menu.entity';
import { MenuUtils } from '../../../src/modules/system/util/menu.util';
import { MenuVo } from '../../../src/modules/system/vo/menu.vo';

describe('MenuVo', () => {
  const createMenu = (options: {
    id: number;
    title: string;
    name: string;
    sort: number;
    path: string;
  }) =>
    ({
      id: options.id,
      name: options.name,
      title: options.title,
      sort: options.sort,
      component: options.name,
      path: options.path,
      redirect: null,
      type: MenuTypeEnum.MENU,
      permission: options.path,
      icon: '',
      cache: true,
      hidden: false,
      pid: 0,
      enabled: true,
      breadcrumb: true,
      hideChildrenInMenu: false,
      affix: false,
      create_by: 'system',
      update_by: 'system',
      create_time: new Date('2026-01-01T00:00:00.000Z'),
      update_time: new Date('2026-01-01T00:00:00.000Z'),
    } as any);

  it('keeps sort 0 so dashboard remains before system routes', () => {
    const dashboard = MenuVo.fromEntity(
      createMenu({
        id: 10,
        title: '仪表盘',
        name: 'Dashboard',
        sort: 0,
        path: 'dashboard',
      })
    );
    const system = MenuVo.fromEntity(
      createMenu({
        id: 1,
        title: '系统管理',
        name: 'System',
        sort: 10,
        path: '/system',
      })
    );

    expect(dashboard.sort).toBe(0);
    expect(MenuUtils.buildMenuTree([system, dashboard]).map(menu => menu.title)).toEqual([
      '仪表盘',
      '系统管理',
    ]);
  });
});
