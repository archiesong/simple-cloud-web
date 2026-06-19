import { USER_SERVICE_IDENTIFIER, UserService } from '../user.service';
import { Config, Inject, InjectClient, Provide } from '@midwayjs/core';
import { BaseService } from '../../../../common/service/base.service';
import { User } from '../../entity/user.entity';
import { Context } from '@midwayjs/koa';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { CachingFactory, MidwayCache } from '@midwayjs/cache-manager';
import {
  CreateUserDto,
  DeleteUserDto,
  UserQueryDto,
  UserDto,
} from '../../dto/user.dto';
import { UserListVo, UserVo } from '../../vo/user.vo';
import { BusinessException } from '../../../../exception/business.exception';
import { RandomUtils } from '../../../../util/random';
import { LOGIN_USER_KEY } from '../../../../common/constant/cache.key';

@Provide(USER_SERVICE_IDENTIFIER)
export class UserServiceImpl extends BaseService<User> implements UserService {
  @Inject()
  ctx: Context;
  @InjectEntityModel(User)
  model: Repository<User>;
  @InjectClient(CachingFactory, 'default')
  cache: MidwayCache;
  @Config('login.userCache.idleTime')
  idleTime: number;
  async query(query: UserQueryDto): Promise<UserListVo> {
    // 分页查用户
    const page = await this.lambdaPage(this.model, query, wrapper =>
      wrapper
        // 部门
        .leftJoinAndSelect('sys_user.dept', 'dept')
        .leftJoinMany('sys_user.roles', 'roles')
        .leftJoinMany('sys_user.jobs', 'jobs')
        .keyword(query.keyword, [
          'sys_user.username',
          'sys_user.nick_name',
          'sys_user.phone',
          'sys_user.email',
        ])
        .eq('sys_user.enabled', query.enabled)
        .between('sys_user.create_time', query.startTime, query.endTime)
        .eq('sys_user.is_delete', false)
        .orderByDesc('sys_user.id')
    );
    return Promise.resolve(new UserListVo(page));
  }
  async create(user: CreateUserDto) {
    console.log(user);
  }
  async delete(ids: DeleteUserDto) {
    console.log(ids);
  }
  async update(user: UserDto): Promise<any> {
    console.log(user);
  }
  async findLoginUserByUsername(username: string): Promise<User> {
    const user = await this.model.findOne({
      where: { username },
      relations: ['dept', 'roles', 'roles.menus', 'jobs'],
    });
    if (!user) throw new BusinessException('用户不存在!');
    if (!user.enabled) throw new BusinessException('账号未激活!');
    return user;
  }
  async findUserByUsername(username: string): Promise<UserVo> {
    const key = `${LOGIN_USER_KEY}${username}`;
    let userVo = await this.cache.get<UserVo>(key);
    if (!userVo) {
      const user = await this.findLoginUserByUsername(username);
      userVo = UserVo.fromEntity(user);
      const ttl = Number(this.idleTime) + RandomUtils.randomInt(900, 1800);
      await this.cache.set(key, userVo, ttl);
    }
    return Promise.resolve(userVo);
  }
}
