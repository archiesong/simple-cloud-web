import { Inject, InjectClient, Provide, Singleton } from '@midwayjs/core';
import { CachingFactory, MidwayCache } from '@midwayjs/cache-manager';
import { JwtService } from '@midwayjs/jwt';
import { ONLINE_TOKEN_KEY } from '../constant/cache.key';
import { TokenPayload } from '../../interface';
import { randomBytes } from 'node:crypto';
@Provide()
@Singleton()
export class TokenService {
  @Inject()
  jwtService: JwtService;
  @InjectClient(CachingFactory, 'default')
  cache: MidwayCache;
  async createToken(payload: TokenPayload) {
    return await this.jwtService.sign(
      { ...payload, uid: randomBytes(8).toString('hex').slice(0, 12) },
      {
        subject: payload.userId.toString(),
      }
    );
  }
  async loginKey(token: string) {
    const payload = (await this.jwtService.verify(
      token
    )) as unknown as TokenPayload;
    const uid = await this.getId(token);
    return `${ONLINE_TOKEN_KEY}${payload.username}:${uid}`;
  }
  async getId(token: string) {
    const payload = (await this.jwtService.verify(
      token
    )) as unknown as TokenPayload;
    return payload.uid.toString();
  }
}
