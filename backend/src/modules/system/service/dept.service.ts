import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Dept } from '../entity/dept.entity';

@Provide()
export class DeptService {
  @InjectEntityModel(Dept)
  deptModel: Repository<Dept>;
}
