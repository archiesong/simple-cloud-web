import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';
import { DictDetail } from './dict_detail.entity';

@Entity('sys_dict', { comment: '数据字典表' })
export class Dict extends BaseEntity {
  @Column({
    comment: '名称',
  })
  name: string;
  @Column({
    comment: '描述',
  })
  description: string;
  @OneToMany(() => DictDetail, dictDetail => dictDetail.dict, {
    cascade: ['insert', 'remove'],
  })
  dictDetails: DictDetail[];
}
