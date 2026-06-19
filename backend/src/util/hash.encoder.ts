import { Provide, Singleton } from '@midwayjs/core';
import * as argon2 from 'argon2';
@Provide()
@Singleton()
export class HashEncoder {
  /**
   * hash 加密
   * @param plain
   */
  async encode(plain: string): Promise<string> {
    return argon2.hash(plain, {
      type: argon2.argon2id, // 推荐使用 argon2id
      timeCost: 3, // 算 3 轮
      memoryCost: 1 << 12, // 4096 KB = 4MB
      parallelism: 1,
    });
  }

  /**
   * 校验
   * @param plain 文本
   * @param hash
   */
  async matches(plain: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, plain);
  }
}
