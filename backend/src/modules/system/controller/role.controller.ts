import { Context } from '@midwayjs/koa';
import {  Body, Controller, Get, Inject, Put, Query } from '@midwayjs/core';
import { ROLE_SERVICE_IDENTIFIER, RoleService } from '../service/role.service';
import { BaseController } from '../../../common/controller/base.controller';
import { GetApiResponse } from '../../../common/decorator/auto.api.decorators';
import { Validate } from '@midwayjs/validate';
import { RoleAssignMenusDto, RoleQueryDto, RoleIdDto } from '../dto/role.dto';
import { RoleListResponseVo, RoleDetailResponseVo } from '../vo/role.vo';

@Controller('/roles', {
  description: 'Role Controller',
  tagName: '系统：角色管理',
})
export class RoleController extends BaseController {
  @Inject()
  ctx: Context;

  @Inject(ROLE_SERVICE_IDENTIFIER)
  roleService: RoleService;

  @Get('/list', { summary: '查询角色列表' })
  @GetApiResponse({
    successDescription: 'OK',
    successType: RoleListResponseVo,
  })
  @Validate()
  async query(@Query() parmas: RoleQueryDto): Promise<RoleListResponseVo> {
    return this.ok(await this.roleService.query(parmas));
  }

  @Get('/detail', { summary: '查询角色详情' })
  @GetApiResponse({
    successDescription: 'OK',
    successType: RoleDetailResponseVo,
  })
  @Validate()
  async detail(@Query() parmas: RoleIdDto): Promise<RoleDetailResponseVo> {
    return this.ok(await this.roleService.findById(parmas.id));
  }

  @Put('/menus', { summary: '分配角色菜单权限' })
  @GetApiResponse({
    successDescription: 'OK',
  })
  @Validate()
  async assignMenus(@Body() dto: RoleAssignMenusDto) {
    await this.roleService.assignMenus(dto);
    return this.ok();
  }
}
