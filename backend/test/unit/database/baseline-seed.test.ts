import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('baseline seed menu structure', () => {
  const sql = readFileSync(
    join(__dirname, '../../../database/simple-cloud-baseline.sql'),
    'utf8'
  );

  it('stores role permission configuration as a role action button, not a dynamic menu route', () => {
    expect(sql).toContain(
      "(5, 'system', 'system', '角色权限配置', NULL, 204, NULL, NULL, NULL, 2, 'system:role:assign', NULL, 0, 1, 3, 1, 1, 0, 0)"
    );
    expect(sql).not.toContain(
      "(5, 'system', 'system', '角色权限配置', 'RoleAssign', 50, 'RoleAssign', 'role/:id/assign'"
    );
  });

  it('uses PageView for system management so child menus render with breadcrumbs', () => {
    expect(sql).toContain(
      "(1, 'system', 'system', '系统管理', 'System', 10, 'PageView', '/system', '/system/user', 0, 'system', 'ri:settings-3-line', 1, 0, 0, 1, 1, 0, 0)"
    );
    expect(sql).not.toContain(
      "(1, 'system', 'system', '系统管理', 'System', 10, 'RouteView', '/system'"
    );
  });

  it('redirects system management to its first visible child route', () => {
    expect(sql).toContain(
      "(1, 'system', 'system', '系统管理', 'System', 10, 'PageView', '/system', '/system/user'"
    );
  });

  it('stores dashboard as a database menu instead of relying on the frontend fallback route', () => {
    expect(sql).toContain(
      "(10, 'system', 'system', '仪表盘', 'Dashboard', 0, 'Dashboard', 'dashboard', NULL, 1, 'dashboard', 'ri:dashboard-line', 1, 0, 0, 1, 1, 0, 1)"
    );
  });
});
