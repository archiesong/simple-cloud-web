import { Menu } from '../entity/menu.entity';
import { MenuVo } from '../vo/menu.vo';

export class MenuUtils {
  /**
   * 去重菜单
   */
  static removeDuplicates(menus: Menu[]): Menu[] {
    const map = new Map<number, Menu>();
    menus.forEach(menu => {
      if (!map.has(menu.id)) {
        map.set(menu.id, menu);
      }
    });
    return Array.from(map.values());
  }

  /**
   * 构建菜单树
   */
  static buildMenuTree(menus: MenuVo[]): MenuVo[] {
    const menuMap = new Map<string, MenuVo>();
    const rootMenus: MenuVo[] = [];

    // 先建立所有菜单的映射
    menus.forEach(menu => {
      menuMap.set(menu.id, menu);
    });

    // 构建树形结构
    menus.forEach(menu => {
      if (!menu.pid || menu.pid === '0') {
        rootMenus.push(menu);
      } else {
        const parentMenu = menuMap.get(menu.pid);
        if (parentMenu) {
          parentMenu.children.push(menu);
        } else {
          // 如果找不到父菜单，也作为根菜单处理
          rootMenus.push(menu);
        }
      }
    });

    // 递归排序子菜单
    this.sortMenus(rootMenus);

    return rootMenus;
  }

  /**
   * 排序菜单（按 sort 字段排序）
   */
  static sortMenus(menus: MenuVo[]): void {
    menus.sort((a, b) => a.sort - b.sort);
    menus.forEach(menu => {
      if (menu.children.length > 0) {
        this.sortMenus(menu.children);
      } else {
        delete menu.children;
      }
    });
  }

  /**
   * 批量将菜单实体转换为 VO
   */
  static entitiesToVos(menus: Menu[]): MenuVo[] {
    return menus.map(MenuVo.fromEntity);
  }
}
