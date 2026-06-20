import { Inject, Provide } from '@midwayjs/core';
import { BaseService } from '../../../../common/service/base.service';
import { ROLE_SERVICE_IDENTIFIER, RoleService } from '../role.service';
import { Role } from '../../entity/role.entity';
import { Context } from '@midwayjs/koa';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { In, Repository } from 'typeorm';
import { RoleAssignMenusDto, RoleQueryDto } from '../../dto/role.dto';
import { RoleListVo, RoleDetailVo } from '../../vo/role.vo';
import { MenuVo } from '../../vo/menu.vo';
import { BusinessException } from '../../../../exception/business.exception';
import { MenuUtils } from '../../util/menu.util';
import { Menu } from '../../entity/menu.entity';

@Provide(ROLE_SERVICE_IDENTIFIER)
export class RoleServiceImpl extends BaseService<Role> implements RoleService {
  @Inject()
  ctx: Context;
  @InjectEntityModel(Role)
  model: Repository<Role>;
  @InjectEntityModel(Menu)
  menuModel: Repository<Menu>;
  /**
   * 查询角色列表
   * @param query
   * @returns
   */
  async query(query: RoleQueryDto): Promise<RoleListVo> {
     // 分页查角色
      const page = await this.lambdaPage(this.model, query, wrapper =>
        wrapper
          .keyword(query.keyword, [
            'sys_role.name',
          ])
          .eq('sys_role.enabled', query.enabled)
          .between('sys_role.create_time', query.startTime, query.endTime)
          .orderByDesc('sys_role.id')
      );
      return Promise.resolve(new RoleListVo(page));
  }

  async findById(id: string): Promise<RoleDetailVo> {
    // 查询角色及其关联的菜单
    const role = await this.model.findOne({
      where: { id: Number(id) },
      relations: ['menus'],
    });

    if (!role) {
      throw new BusinessException('角色不存在');
    }

    // 转换菜单为 VO
    let menuVos: MenuVo[] = [];
    if (role.menus && role.menus.length > 0) {
      const uniqueMenus = MenuUtils.removeDuplicates(role.menus);
      menuVos = MenuUtils.entitiesToVos(uniqueMenus);
    }

    return Promise.resolve(new RoleDetailVo(role, menuVos));
  }

  async assignMenus(dto: RoleAssignMenusDto): Promise<void> {
    const role = await this.model.findOne({
      where: { id: Number(dto.id) },
      relations: ['menus'],
    });

    if (!role) {
      throw new BusinessException('角色不存在');
    }

    const menuIds = Array.from(new Set(dto.menuIds.map(id => Number(id))));
    if (menuIds.some(id => !Number.isInteger(id) || id <= 0)) {
      throw new BusinessException('菜单不存在或已禁用');
    }

    if (menuIds.length === 0) {
      role.menus = [];
      await this.model.save(role);
      return Promise.resolve();
    }

    const menus = await this.menuModel.find({
      where: { id: In(menuIds), enabled: true },
    });

    if (menus.length !== menuIds.length) {
      throw new BusinessException('菜单不存在或已禁用');
    }

    role.menus = menus;
    await this.model.save(role);
    return Promise.resolve();
  }
}
