import {
  Body,
  Controller,
  Del,
  Get,
  Inject,
  Query,
  Post,
  Put,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService, USER_SERVICE_IDENTIFIER } from '../service/user.service';
import { ApiOkResponse } from '@midwayjs/swagger';
import { CreateUserDto, DeleteUserDto, UserQueryDto, UserDto } from '../dto/user.dto';
import { Validate } from '@midwayjs/validate';
import { DeleteUserResponseVo, UserListResponseVo } from '../vo/user.vo';
import { GetApiResponse } from '../../../common/decorator/auto.api.decorators';
import { BaseController } from '../../../common/controller/base.controller';

@Controller('/users', {
  description: 'User Controller',
  tagName: '系统：用户管理',
})
export class UserController  extends BaseController {
  @Inject()
  ctx: Context;

  @Inject(USER_SERVICE_IDENTIFIER)
  userService: UserService;
  @Get('/list', { summary: '查询用户列表' })
   @GetApiResponse({
    successDescription: 'OK',
    successType: UserListResponseVo,
  })
  @Validate()
  async query(@Query() parmas: UserQueryDto): Promise<UserListResponseVo> {
    return this.ok(await this.userService.query(parmas));
  }
  @ApiOkResponse({
    description: 'OK',
  })
  @Post('/create', { summary: '新增用户' })
  @Validate()
  async create(@Body() user: CreateUserDto) {
    this.ctx.logger.info('create:user', user);
    // return ResponseHelper.ok(this.userService.create(user));
  }
  @ApiOkResponse({
    description: 'OK',
  })
  @Validate()
  @Post('/update', { summary: '修改用户' })
  async update(@Body() user: UserDto) {
    this.ctx.logger.info('update:user', user);
    // return ResponseHelper.ok(await this.userService.update(user));
  }
  @ApiOkResponse({
    type: DeleteUserResponseVo,
    description: 'OK',
  })
  @Del('/delete', { summary: '删除用户' })
  async delete(@Body() ids: DeleteUserDto) {
    this.ctx.logger.info('ids', ids);
    // return ResponseHelper.ok(await this.userService.delete(ids));
  }
  @Put('/center', { summary: '修改用户：个人资料' })
  async updateProfile() {}
}
