import { RoleAssignMenusDto, RoleQueryDto } from "../dto/role.dto";
import { RoleListVo, RoleDetailVo } from "../vo/role.vo";


// 定义常量
export const ROLE_SERVICE_IDENTIFIER = 'RoleService';

export interface RoleService {
    /**
     * 查询角色列表
     * @param query
     * @returns
     */
    query(query: RoleQueryDto): Promise<RoleListVo>;

    /**
     * 根据ID查询角色详情
     * @param id
     * @returns
     */
    findById(id: string): Promise<RoleDetailVo>;

    /**
     * 分配角色菜单权限
     * @param dto
     */
    assignMenus(dto: RoleAssignMenusDto): Promise<void>;
}
