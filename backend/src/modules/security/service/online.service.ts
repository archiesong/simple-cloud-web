import { Config, Inject, InjectClient, Provide } from '@midwayjs/core';
import { UserVo } from '../../system/vo/user.vo';
import { OnlineUserVo } from '../vo/online.vo';
import { TokenService } from '../../../common/service/token.service';
import { Context } from '@midwayjs/koa';
import { CachingFactory, MidwayCache } from '@midwayjs/cache-manager';
import { AesUtils } from '../../../util/aes';
import { LocalIP, RegionIP } from '../../../interface';

@Provide()
export class OnlineService {
  @Inject()
  ctx: Context;
  @Inject()
  tokenService: TokenService;
  @InjectClient(CachingFactory, 'default')
  cache: MidwayCache;
  @Inject()
  aesUtils: AesUtils;
  @Config('aes')
  aesConfig: { key: string; iv: string };
  /**
   * 根据用户名强退用户
   * @param username 用户名
   */
  async kickOutForUsername(username: string) {
    this.ctx.logger.info(username, 'kickOutForUsername');
    // String loginKey = properties.getOnlineKey() + username + "*";
    // redisUtils.scanDel(loginKey);
  }

  /**
   * 保存在线用户信息
   * @param jwtUser
   * @param token
   */
  async save(jwtUser: UserVo, token: string) {
    const id = await this.tokenService.getId(token);
    const { browser, os, ip } = this.ctx.browserInfo;
    const encryptToken = this.aesUtils.encrypt(
      token,
      this.aesConfig.key,
      this.aesConfig.iv
    );
    const onlineUserVo = new OnlineUserVo(
      id,
      jwtUser.username,
      jwtUser.nick,
      jwtUser.dept.name,
      `${browser.name} ${browser.version}`,
      `${os.name}${os.version}`,
      ip.ip,
      `${
        (ip as LocalIP).isLocal
          ? '未知'
          : `${(ip as RegionIP).country}
              ${(ip as RegionIP).province}
              ${(ip as RegionIP).city}
              ${(ip as RegionIP).isp}
              `
      }`,
      encryptToken,
      new Date()
    );
    const loginKey = await this.tokenService.loginKey(token);
    // 设置在线用户信息缓存
    await this.cache.set(loginKey, onlineUserVo, 14400000);
  }

  /**
   * 踢出在线用户
   */
  async delete(keys: string[]) {
    for (let i = 0; i < keys.length; i++) {
      const encryptToken = keys[i];
      const token = this.aesUtils.decrypt(
        encryptToken,
        this.aesConfig.key,
        this.aesConfig.iv
      );
      const loginKey = await this.tokenService.loginKey(token);
      await this.cache.del(loginKey);
    }
  }
}
