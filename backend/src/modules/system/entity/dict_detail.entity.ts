import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';
import { Dict } from './dict.entity';
@Entity('sys_dict_detail', { comment: '数据字典详情表' })
export class DictDetail extends BaseEntity {
  @Column({
    comment: '字典标签',
  })
  label: string;
  @Column({
    comment: '字典值',
  })
  value: string;
  @Column({
    comment: '排序',
    nullable: true,
  })
  sort: number;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne(type => Dict, dict => dict.dictDetails, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({
    name: 'dict_id',
  })
  dict: Dict;
}
