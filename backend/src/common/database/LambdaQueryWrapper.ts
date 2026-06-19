import { Brackets, ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export interface JoinManyRelation {
  property: string;
  alias: string;
}

export class LambdaQueryWrapper<T> {
  constructor(private qb: SelectQueryBuilder<T>) {}
  private readonly joinManyRelations: JoinManyRelation[] = [];
  like(column: string, value?: string) {
    if (value) {
      this.qb.andWhere(`${column} like :${column}`, {
        [column]: `%${value}%`,
      });
    }

    return this;
  }
  eq(column: string, value: any) {
    if (value !== undefined) {
      this.qb.andWhere(`${column} = :${column}`, {
        [column]: value,
      });
    }

    return this;
  }
  orderByDesc(column: string) {
    this.qb.addOrderBy(column, 'DESC');
    return this;
  }
  orderByAsc(column: string) {
    this.qb.addOrderBy(column, 'ASC');
    return this;
  }
  between(column: string, start: any, end: any) {
    if (start != null && end != null) {
      const key1 = `${column}_start`.replace('.', '_');

      const key2 = `${column}_end`.replace('.', '_');

      this.qb.andWhere(`${column} BETWEEN :${key1} AND :${key2}`, {
        [key1]: start,
        [key2]: end,
      });
    }

    return this;
  }
  in(column: string, values: any[]) {
    if (values?.length) {
      const key = column.replace('.', '_');

      this.qb.andWhere(`${column} IN (:...${key})`, {
        [key]: values,
      });
    }

    return this;
  }
  isNull(column: string) {
    this.qb.andWhere(`${column} IS NULL`);

    return this;
  }
  groupBy(...columns: string[]) {
    columns.forEach((column, index) => {
      if (index === 0) {
        this.qb.groupBy(column);
      } else {
        this.qb.addGroupBy(column);
      }
    });

    return this;
  }
  having(condition: string, parameters?: ObjectLiteral) {
    this.qb.having(condition, parameters);

    return this;
  }
  exists(
    builder: (subQuery: SelectQueryBuilder<any>) => SelectQueryBuilder<any>
  ) {
    const subQuery = builder(this.qb.subQuery()).getQuery();

    this.qb.andWhere(`EXISTS ${subQuery}`);

    return this;
  }
  notExists(
    builder: (subQuery: SelectQueryBuilder<any>) => SelectQueryBuilder<any>
  ) {
    const subQuery = builder(this.qb.subQuery()).getQuery();

    this.qb.andWhere(`NOT EXISTS ${subQuery}`);

    return this;
  }
  leftJoinAndSelect(relation: string, alias: string) {
    this.qb.leftJoinAndSelect(relation, alias);
    return this;
  }
  /**
   * 不 join，只记录
   */
  leftJoinMany(property: string, alias: string) {
    this.joinManyRelations.push({
      property,
      alias,
    });
    return this;
  }
  getJoinManyRelations() {
    return this.joinManyRelations;
  }
  and(callback: (wrapper: LambdaQueryWrapper<T>) => void) {
    this.qb.andWhere(
      new Brackets(qb => {
        const wrapper = new LambdaQueryWrapper<T>(qb as any);
        callback(wrapper);
      })
    );
    return this;
  }
  orLike(column: string, value?: string) {
    if (!value) {
      return this;
    }

    const key = `${column}_${Date.now()}`.replace(/\./g, '_');

    this.qb.orWhere(`${column} LIKE :${key}`, {
      [key]: `%${value}%`,
    });

    return this;
  }
  keyword(value?: string, columns: string[] = []) {
    if (!value || columns.length === 0) {
      return this;
    }

    this.qb.andWhere(
      new Brackets(qb => {
        columns.forEach((column, index) => {
          const key = `${column}_${index}`.replace(/\./g, '_');

          if (index === 0) {
            qb.where(`${column} LIKE :${key}`, {
              [key]: `%${value}%`,
            });
          } else {
            qb.orWhere(`${column} LIKE :${key}`, {
              [key]: `%${value}%`,
            });
          }
        });
      })
    );

    return this;
  }
  getQueryBuilder() {
    return this.qb;
  }
}
