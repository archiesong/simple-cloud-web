import { CreateUserDto, DeleteUserDto, UserQueryDto, UserDto } from '../dto/user.dto';
import { User } from '../entity/user.entity';
import { UserListVo, UserVo } from '../vo/user.vo';

// 定义常量
export const USER_SERVICE_IDENTIFIER = 'UserService';

export interface UserService {
  /**
   * 查询用户列表
   * @param  query 查询参数
  //  * @returns {UserListVo[]} 返回用户列表
   */
  query(query: UserQueryDto): Promise<UserListVo>;
  /**
   * 新增用户
   * @param {CreateUserDto} user
   * @returns
   */
  create(user: CreateUserDto): Promise<void>;
  /**
   * 修改用户
   * @param {UserDto} user
   * @returns
   */
  update(user: UserDto): Promise<void>;
  /**
   * 删除用户
   * @param ids 需要删除用户的id集合
   */
  delete(ids: DeleteUserDto): Promise<void>;
  /**
   * 根据用户名查询
   * @param {string} username 用户名
   * @returns {UserVo} 返回用户信息
   */
  findUserByUsername(username: string): Promise<UserVo>;
  /**
   * 根据用户名查询登录校验所需的内部用户实体。
   * 不用于控制器响应，避免密码哈希进入对外 VO。
   */
  findLoginUserByUsername(username: string): Promise<User>;
}
