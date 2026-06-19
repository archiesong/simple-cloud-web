import { Rule, RuleType } from '@midwayjs/validate';
import { ApiProperty } from '@midwayjs/swagger';
export class PageDto {
  @ApiProperty({
    description: '当前页码',
  })
  @Rule(RuleType.number().default(1).min(1))
  current = 1;
  @ApiProperty({
    description: '每页数量',
  })
  @Rule(RuleType.number().default(10).min(1).max(100))
  pageSize = 10;
}