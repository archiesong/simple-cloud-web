import { Dept } from '../entity/dept.entity';
import { ApiProperty } from '@midwayjs/swagger';

export class DeptSmallVo {
  @ApiProperty({
    description: 'ID',
  })
  id: number;
  @ApiProperty({
    description: '部门名称',
  })
  name: string;
  static fromEntity(dept: Dept): DeptSmallVo {
    const vo = new DeptSmallVo();
    vo.id = dept.id;
    vo.name = dept.name;
    return vo;
  }
}
