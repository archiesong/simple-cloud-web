import { Inject, InjectClient, Provide } from '@midwayjs/core';
import { Between, Repository, In } from 'typeorm';
import { Context } from '@midwayjs/koa';
import { BaseService } from '../../../../common/service/base.service';
import { MENU_SERVICE_IDENTIFIER, MenuService } from '../menu.service';
import { Menu, MenuTypeEnum } from '../../entity/menu.entity';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { CachingFactory, MidwayCache } from '@midwayjs/cache-manager';
import { MenuListVo, MenuVo } from '../../vo/menu.vo';
import { USER_SERVICE_IDENTIFIER, UserService } from '../user.service';
import { MenuUtils } from '../../util/menu.util';
import {
  MenuQueryDto,
  CreateMenuDto,
  DeleteMenuDto,
  MenuDto,
  MenuTreeDto,
} from '../../dto/menu.dto';
import { BusinessException } from '../../../../exception/business.exception';

@Provide(MENU_SERVICE_IDENTIFIER)
export class MenuServiceImpl extends BaseService<Menu> implements MenuService {
  @Inject()
  ctx: Context;

  @InjectEntityModel(Menu)
  model: Repository<Menu>;

  @InjectClient(CachingFactory, 'default')
  cache: MidwayCache;

  @Inject(USER_SERVICE_IDENTIFIER)
  userService: UserService;

  async query(query: MenuQueryDto): Promise<MenuListVo> {
    const menus = await this.model.find({
      where: {
        title: query.title,
        enabled: query.enabled,
        create_time:
          query.startTime && query.endTime
            ? Between(new Date(query.startTime), new Date(query.endTime))
            : undefined,
      },
      order: {
        sort: 'ASC',
      },
    });
    const uniqueMenus = MenuUtils.removeDuplicates(menus);

    const menuVos = MenuUtils.entitiesToVos(uniqueMenus);

    const treeMenus = MenuUtils.buildMenuTree(menuVos);
    this.ctx.logger.info(treeMenus, menuVos, '查询菜单');
    return Promise.resolve(
      new MenuListVo({
        data: treeMenus,
        total: treeMenus.length,
        current: query.current,
        pageSize: query.pageSize,
      })
    );
  }
  async routes(): Promise<MenuVo[]> {
    const userVo = await this.userService.findUserByUsername(
      this.ctx.state.user.username
    );
    if (!userVo?.roles || userVo.roles.length === 0) {
      return Promise.resolve([]);
    }

    const roleIds = userVo.roles.map(r => r.id);
    // 使用 QueryBuilder 确保正确查询所有菜单
    const menus = await this.model
      .createQueryBuilder('menu')
      .innerJoin('menu.roles', 'role')
      .where('role.id IN (:...roleIds)', { roleIds })
      .andWhere('menu.type != :buttonType', {
        buttonType: String(MenuTypeEnum.BUTTON),
      })
      .andWhere('menu.enabled = :enabled', { enabled: true })
      .orderBy('menu.sort', 'ASC')
      .addOrderBy('menu.id', 'ASC')
      .getMany();
    // 去重 -> 转 VO -> 构建菜单树
    const uniqueMenus = MenuUtils.removeDuplicates(menus);
    const menuVos = MenuUtils.entitiesToVos(uniqueMenus);
    return Promise.resolve(MenuUtils.buildMenuTree(menuVos));
  }
  async tree(params?: MenuTreeDto): Promise<MenuVo[]> {
    const includeButton = params?.includeButton ?? false;
    // 查询所有目录和菜单（根据参数决定是否包含按钮）
    const queryBuilder = this.model
      .createQueryBuilder('menu')
      .where('menu.enabled = :enabled', { enabled: true });
    
    // 如果不包含按钮，添加按钮类型过滤
    if (!includeButton) {
      queryBuilder.andWhere('menu.type != :buttonType', {
        buttonType: String(MenuTypeEnum.BUTTON),
      });
    }
    
    const menus = await queryBuilder
      .orderBy('menu.sort', 'ASC')
      .addOrderBy('menu.id', 'ASC')
      .getMany();
    
    // 去重 -> 转 VO -> 构建菜单树
    const uniqueMenus = MenuUtils.removeDuplicates(menus);
    const menuVos = MenuUtils.entitiesToVos(uniqueMenus);
    return Promise.resolve(MenuUtils.buildMenuTree(menuVos));
  }
  async findById(id: string): Promise<MenuVo> {
    const menu = await this.model.findOne({ where: { id: Number(id) } });
    if (!menu) {
      throw new BusinessException('菜单不存在');
    }
    return Promise.resolve(MenuVo.fromEntity(menu));
  }
  async create(menuDto: CreateMenuDto): Promise<void> {
    // 检查菜单名称是否已存在
    if (menuDto.name) {
      const existName = await this.model.findOne({
        where: { name: menuDto.name },
      });
      if (existName) {
        throw new BusinessException('菜单名称已存在');
      }
    }
    // 检查菜单标题是否已存在
    const existTitle = await this.model.findOne({
      where: { title: menuDto.title },
    });
    if (existTitle) {
      throw new BusinessException('菜单标题已存在');
    }
    // 创建新菜单
    const menu = new Menu();
    Object.assign(menu, menuDto);
    // 如果 name 为空，设置为 null
    if (!menu.name) {
      menu.name = null;
    }
    await this.model.save(menu);
  }

  async update(menuDto: MenuDto): Promise<void> {
    // 检查菜单是否存在
    const existMenu = await this.model.findOne({
      where: { id: Number(menuDto.id) },
    });
    if (!existMenu) {
      throw new BusinessException('菜单不存在');
    }
    // 检查菜单名称是否重复
    if (menuDto.name && menuDto.name !== existMenu.name) {
      const existName = await this.model.findOne({
        where: { name: menuDto.name },
      });
      if (existName) {
        throw new BusinessException('菜单名称已存在');
      }
    }
    // 检查菜单标题是否重复
    if (menuDto.title && menuDto.title !== existMenu.title) {
      const existTitle = await this.model.findOne({
        where: { title: menuDto.title },
      });
      if (existTitle) {
        throw new BusinessException('菜单标题已存在');
      }
    }
    // 更新菜单
    Object.assign(existMenu, menuDto);
    // 如果 name 为空，设置为 null
    if (!existMenu.name) {
      existMenu.name = null;
    }
    await this.model.save(existMenu);
  }

  async delete(deleteDto: DeleteMenuDto): Promise<void> {
    const ids = deleteDto.ids.map(id => Number(id));
    // 检查是否存在子菜单
    const childMenus = await this.model.find({ where: { pid: In(ids) } });
    if (childMenus.length > 0) {
      throw new BusinessException('存在子菜单，无法删除');
    }
    // 检查是否有角色关联
    const menusWithRoles = await this.model.find({
      where: { id: In(ids) },
      relations: ['roles'],
    });
    const menuWithRoleIds = menusWithRoles
      .filter(m => m.roles && m.roles.length > 0)
      .map(m => m.id);
    if (menuWithRoleIds.length > 0) {
      throw new BusinessException('菜单已分配给角色，无法删除');
    }
    // 删除菜单
    await this.model.delete(ids);
  }
}
