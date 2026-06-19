import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseModel } from './typeorm.entity';
export class BaseEntity extends BaseModel {
  @PrimaryGeneratedColumn('increment', {
    comment: 'ID',
    type: 'bigint',
  })
  id: number;
  @Column({
    comment: '创建人',
    nullable: true,
  })
  create_by: string;

  @Column({
    comment: '更新人',
    nullable: true,
  })
  update_by: string;

  @CreateDateColumn({
    comment: '创建时间 yyyy-MM-dd HH:mm:ss',
    nullable: true,
  })
  create_time: Date;

  @UpdateDateColumn({
    comment: '更新时间 yyyy-MM-dd HH:mm:ss',
    nullable: true,
  })
  update_time: Date;
}
