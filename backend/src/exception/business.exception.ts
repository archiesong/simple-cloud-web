import { HttpStatus, MidwayHttpError } from '@midwayjs/core';

export class BusinessException extends MidwayHttpError {
  constructor(message: string, code: number = HttpStatus.BAD_REQUEST) {
    super(message, code);
  }
}
