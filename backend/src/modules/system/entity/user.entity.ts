import {
  Entity,
  Column,
  JoinTable,
  ManyToMany,
  JoinColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';
import { Role } from './role.entity';
import { Dept } from './dept.entity';
import { Job } from './job.entity';

/**
 * 性别枚举
 * */
export enum GenderEnum {
  FEMALE, // 女
  MALE, // 男
  UNKNOWN, // 未知
}

@Entity('sys_user', { comment: '用户表' })
export class User extends BaseEntity {
  @Column({
    unique: true,
    length: 180,
    comment: '用户名',
  })
  @Index()
  username: string;
  @Column({
    comment: '密码',
  })
  password: string;
  @Column({
    comment: '昵称',
    nullable: true,
  })
  @Index()
  nick: string;
  @Column({
    comment: '邮箱',
    length: 180,
    unique: true,
  })
  @Index()
  email: string;
  @Column({
    comment: '手机号',
    nullable: true,
  })
  @Index()
  phone: string;
  @Column({
    comment: '性别',
    type: 'enum',
    enum: GenderEnum,
    default: GenderEnum.MALE,
  })
  gender: GenderEnum;
  @Column({
    comment: '头像',
    nullable: true,
  })
  avatar: string;
  @Column({
    comment: '部门ID',
    nullable: true,
  })
  @Index()
  dept_id: number;
  @Column({
    comment: '账号是否启用',
    default: true,
  })
  @Index()
  enabled: boolean;
  @Column({
    comment: '账号是否删除',
    default: false,
    nullable: true,
  })
  is_delete: boolean;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToMany(() => Role, role => role.users, {
    createForeignKeyConstraints: false,
  })
  @JoinTable({
    name: 'sys_users_roles',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'role_id',
    },
  })
  roles: Role[];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToMany(() => Job, job => job.users, {
    createForeignKeyConstraints: false,
  })
  @JoinTable({
    name: 'sys_users_jobs',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'job_id',
    },
  })
  jobs: Job[];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne(() => Dept, dept => dept.users, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({
    name: 'dept_id',
  })
  dept: Dept;
}
