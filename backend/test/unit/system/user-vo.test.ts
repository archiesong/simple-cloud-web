import { MenuTypeEnum } from '../../../src/modules/system/entity/menu.entity';
import { DataScopeEnum } from '../../../src/modules/system/entity/role.entity';
import { UserVo } from '../../../src/modules/system/vo/user.vo';

describe('UserVo', () => {
  it('exposes role codes, permissions, and data scopes for the auth info contract', () => {
    const user = {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      avatar: '',
      gender: 1,
      phone: '',
      password: 'secret',
      create_by: 'system',
      create_time: new Date('2026-01-01T00:00:00.000Z'),
      update_by: 'system',
      update_time: new Date('2026-01-01T00:00:00.000Z'),
      is_delete: false,
      enabled: true,
      nick: '管理员',
      dept_id: 1,
      dept: { id: 1, name: '总部' },
      jobs: [],
      roles: [
        {
          id: 1,
          name: '管理员',
          code: 'admin',
          level: 1,
          dataScope: DataScopeEnum.ALL,
          menus: [
            {
              id: 10,
              type: MenuTypeEnum.MENU,
              permission: 'system:user:list',
            },
            {
              id: 11,
              type: MenuTypeEnum.BUTTON,
              permission: 'system:user:create',
            },
            {
              id: 12,
              type: MenuTypeEnum.BUTTON,
              permission: '',
            },
          ],
        },
      ],
    };

    const vo = UserVo.fromEntity(user as any);

    expect(vo.roleCodes).toEqual(['admin']);
    expect(vo.permissions).toEqual(['system:user:list', 'system:user:create']);
    expect(vo.dataScopes).toEqual([DataScopeEnum.ALL]);
  });
});
