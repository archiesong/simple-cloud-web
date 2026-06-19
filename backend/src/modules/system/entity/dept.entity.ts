import { Column, Entity, Index, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';
import { Role } from './role.entity';
import { User } from './user.entity';

@Entity('sys_dept', { comment: '部门表' })
export class Dept extends BaseEntity {
  @Column({
    comment: '部门名称',
  })
  name: string;
  @Column({
    comment: '是否启用',
    default: true,
  })
  @Index()
  enabled: boolean;
  @Column({
    type: 'bigint',
    comment: '上级部门',
    nullable: true,
  })
  @Index()
  pid: number;
  @Column({
    comment: '排序',
    nullable: true,
  })
  sort: number;
  @ManyToMany(() => Role, role => role.depts)
  roles: Role[];
  @OneToMany(() => User, user => user.dept)
  users: User[];
}
