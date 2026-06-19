import { Context, Controller, Inject } from '@midwayjs/core';
import { RoleService } from '../service/role.service';

@Controller('/dept', {
  description: 'Dept Controller',
  tagName: '系统：部门管理',
})
export class DeptController {
  @Inject()
  ctx: Context;

  @Inject()
  roleService: RoleService;
}
