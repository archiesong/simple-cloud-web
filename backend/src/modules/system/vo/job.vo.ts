import { Job } from '../entity/job.entity';
import { ApiProperty } from '@midwayjs/swagger';

export class JobSmallVo {
  @ApiProperty({
    description: 'ID',
  })
  id: number;
  @ApiProperty({
    description: '岗位名称',
  })
  name: string;
  static fromEntity(job: Job): JobSmallVo {
    const vo = new JobSmallVo();
    vo.id = job.id;
    vo.name = job.name;
    return vo;
  }
}
