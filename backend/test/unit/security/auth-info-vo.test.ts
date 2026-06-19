import { DataScopeEnum } from '../../../src/modules/system/entity/role.entity';
import { AuthInfoVo } from '../../../src/modules/security/vo/auth.vo';
import { UserVo } from '../../../src/modules/system/vo/user.vo';

describe('AuthInfoVo', () => {
  it('returns auth-safe user info without password', () => {
    const user = Object.assign(new UserVo(), {
      id: 1,
      username: 'admin',
      nick: '管理员',
      avatar: '',
      roleCodes: ['admin'],
      permissions: ['system:user:list'],
      dataScopes: [DataScopeEnum.ALL],
    });

    const vo = AuthInfoVo.fromUser(user);

    expect(vo).toEqual({
      id: 1,
      username: 'admin',
      nick: '管理员',
      avatar: '',
      roles: ['admin'],
      permissions: ['system:user:list'],
      dataScopes: [DataScopeEnum.ALL],
    });
    expect('password' in vo).toBe(false);
  });
});
