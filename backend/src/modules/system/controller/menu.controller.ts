import { Controller, Inject, Get, Query, Post, Put, Body, Del } from '@midwayjs/core';
import { MenuService, MENU_SERVICE_IDENTIFIER } from '../service/menu.service';
import { GetApiResponse } from '../../../common/decorator/auto.api.decorators';
import { BaseController } from '../../../common/controller/base.controller';
import { MenuListResponseVo, MenuRouteResponseVo, MenuRouteVo, MenuTreeResponseVo, MenuTreeVo, DeleteMenuResponseVo, MenuDetailResponseVo } from '../vo/menu.vo';
import { Context } from '@midwayjs/koa';
import { Validate } from '@midwayjs/validate';
import { MenuQueryDto, CreateMenuDto, MenuDto, DeleteMenuDto, MenuIdDto, MenuTreeDto } from '../dto/menu.dto';
@Controller('/menus', {
  description: 'Menu Controller',
  tagName: '系统：菜单管理',
})
export class MenuController extends BaseController {
  @Inject()
  ctx: Context;
  @Inject(MENU_SERVICE_IDENTIFIER)
  menuService: MenuService;
  @Get('/list', { summary: '查询菜单列表' })
  @GetApiResponse({
    successDescription: 'OK',
    successType: MenuListResponseVo,
  })
  @Validate()
  async query(@Query() parmas: MenuQueryDto): Promise<MenuListResponseVo> {
    return this.ok(await this.menuService.query(parmas));
  }
  @Get('/routes', { summary: '获取前端所需菜单' })
  @GetApiResponse({
    successDescription: 'OK',
    successType: MenuRouteResponseVo,
  })
  async routes(): Promise<MenuRouteResponseVo> {
    return this.ok(new MenuRouteVo(await this.menuService.routes()));
  }
  @Get('/tree', { summary: '获取菜单选择树' })
  @GetApiResponse({
    successDescription: 'OK',
    successType: MenuTreeResponseVo,
  })
  @Validate()
  async tree(@Query() params?: MenuTreeDto): Promise<MenuTreeResponseVo> {
    return this.ok(new MenuTreeVo(await this.menuService.tree(params)));
  }
  @Get('/detail', { summary: '获取菜单详情' })
  @GetApiResponse({
    successDescription: 'OK',
    successType: MenuDetailResponseVo,
  })
  @Validate()
  async detail(@Query() params: MenuIdDto): Promise<MenuDetailResponseVo> {
    return this.ok(await this.menuService.findById(params.id));
  }
  @Post('/create', { summary: '新增菜单' })
  @GetApiResponse({
    successDescription: 'OK',
  })
  @Validate()
  async create(@Body() menu: CreateMenuDto) {
    this.ctx.logger.info('create menu:', menu);
    await this.menuService.create(menu);
    return this.ok();
  }
  @Put('/update', { summary: '修改菜单' })
  @GetApiResponse({
    successDescription: 'OK',
  })
  @Validate()
  async update(@Body() menu: MenuDto) {
    this.ctx.logger.info('update menu:', menu);
    await this.menuService.update(menu);
    return this.ok();
  }
  @Del('/delete', { summary: '删除菜单' })
  @GetApiResponse({
    successDescription: 'OK',
    successType: DeleteMenuResponseVo,
  })
  @Validate()
  async delete(@Body() ids: DeleteMenuDto) {
    this.ctx.logger.info('delete menu ids:', ids);
    await this.menuService.delete(ids);
    return this.ok();
  }
}
