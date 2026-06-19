import type{ MenuQueryDto, CreateMenuDto, DeleteMenuDto, MenuDto, MenuTreeDto } from "../dto/menu.dto";
import type {  MenuListVo, MenuVo } from "../vo/menu.vo";

// 定义常量
export const MENU_SERVICE_IDENTIFIER = 'MenuService';


export interface MenuService {
  /**
   * 查询菜单列表
   * @param query
   * @returns
   */
  query(query: MenuQueryDto): Promise<MenuListVo>;
  /**
   * 获取前端所需菜单
   * @returns
   */
  routes(): Promise<MenuVo[]>;
  /**
   * 获取菜单选择树（用于新增/编辑菜单时选择父菜单
   * @param params
   * @returns
   */
  tree(params?: MenuTreeDto): Promise<MenuVo[]>;
  /**
   * 根据 ID 查询菜单详情
   * @param id
   * @returns
   */
  findById(id: string): Promise<MenuVo>;
  /**
   * 新增菜单
   * @param menu
   * @returns
   */
  create(menu: CreateMenuDto): Promise<void>;
  /**
   * 修改菜单
   * @param menu
   * @returns
   */
  update(menu: MenuDto): Promise<void>;
  /**
   * 删除菜单
   * @param ids
   */
  delete(ids: DeleteMenuDto): Promise<void>;
}
