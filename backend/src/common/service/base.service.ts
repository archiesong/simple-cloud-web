import { Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { BaseEntity } from '../entity/base.entity';
import { ObjectLiteral, Repository } from 'typeorm';
import {
  JoinManyRelation,
  LambdaQueryWrapper,
} from '../database/LambdaQueryWrapper';
import { PageDto } from '../dto/page.dto';

@Provide()
@Scope(ScopeEnum.Request, { allowDowngrade: true })
export abstract class BaseService<T extends BaseEntity> {
  protected abstract model: Repository<T>;
  //  protected async page<
  //   T extends ObjectLiteral,
  //   Q extends {
  //     current?: number;
  //     pageSize?: number;
  //   },
  // >(
  //   repository: Repository<T>,
  //   query: Q,
  //   build?: (
  //     qb: SelectQueryBuilder<T>
  //   ) => void | Promise<void>
  // ) {
  //  const current = query.current ?? 1;
  //   const pageSize = query.pageSize ?? 10;

  //   const alias = repository.metadata.tableName;

  //   const qb = repository.createQueryBuilder(alias);

  //   await build?.(qb);

  //   qb.skip((current - 1) * pageSize);
  //   qb.take(pageSize);

  //   const [list, total] = await qb.getManyAndCount();

  //   return {
  //     list,
  //     total,
  //     current,
  //     pageSize,
  //   };
  // }
  protected async lambdaPage<T extends ObjectLiteral>(
    repository: Repository<T>,
    page: PageDto,
    consumer: (wrapper: LambdaQueryWrapper<T>) => void
  ) {
    const alias = repository.metadata.tableName;
    const qb = repository.createQueryBuilder(alias);

    const wrapper = new LambdaQueryWrapper(qb);

    consumer(wrapper);

    qb.skip((page.current - 1) * page.pageSize);

    qb.take(page.pageSize);
    const [data, total] = await qb.getManyAndCount();
    await this.loadJoinMany(repository, data, wrapper.getJoinManyRelations());
    return {
      data,
      total,
      current: page.current,
      pageSize: page.pageSize,
    };
  }
  protected async loadJoinMany<T>(
    repository: Repository<T>,
    entities: T[],
    relations: JoinManyRelation[]
  ) {
    if (!entities.length) {
      return;
    }
    for (const relation of relations) {
      await Promise.all(
        entities.map(async entity => {
          entity[relation.alias] = await repository.manager
            .createQueryBuilder()
            .relation(repository.target, relation.alias)
            .of(entity)
            .loadMany();
        })
      );
    }
  }
  async findByFields(fields: any): Promise<T> {
    return await this.model.findOneBy(fields);
  }
}
