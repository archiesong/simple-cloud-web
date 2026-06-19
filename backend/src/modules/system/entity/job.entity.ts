import { Column, Entity, Index, ManyToMany } from "typeorm";
import { BaseEntity } from '../../../common/entity/base.entity';
import { User } from './user.entity';

@Entity('sys_job', { comment: '岗位表' })
export class Job extends BaseEntity {
  @Column({
    length: 180,
    unique: true,
    comment: '名称',
  })
  name: string;
  @Column({
    nullable: true,
    comment: '排序',
  })
  sort: number;
  @Column({
    comment: '是否启用',
  })
  @Index()
  enabled: boolean;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToMany(type => User, user => user.jobs)
  users: User[];
}
