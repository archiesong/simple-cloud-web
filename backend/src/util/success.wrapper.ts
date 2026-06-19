import { Type, ApiProperty } from '@midwayjs/swagger';


type Result<T> = {
  code: number;
  message: string;
  data: T;
};

export function SuccessWrapper<T>(ResourceCls: Type<T>): Type<Result<T>> {
  class Successed {
    @ApiProperty({ description: '状态码', default: 200 })
    code: number;

    @ApiProperty({ description: '消息', default: 'success' })
    message: string;

    @ApiProperty({
      type: ResourceCls,
      nullable: true,
    })
    data: T;
  }

  return Successed;
}
