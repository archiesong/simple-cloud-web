import { IBrowser, IDevice, IEngine, IOS } from 'ua-parser-js';
import { IP2RegionResult } from 'ip2region';
import '@midwayjs/redis';
/**
 * @description User-Service parameters
 */
export interface IUserOptions {
  uid: number;
}

export interface TokenPayload {
  userId: number | string;
  username: string;
  uid?: string;
  [key: string]: any;
}
export type LocalIP = {
  ip: string;
  isLocal: boolean;
};

export type RegionIP = IP2RegionResult & {
  ip: string;
};




export type IP = RegionIP | LocalIP;
declare module '@midwayjs/koa' {
  interface State {
    user: TokenPayload;
  }
  interface Context {
    browserInfo?: {
      userAgent: string;
      ip: IP;
      browser: IBrowser;
      os: IOS;
      device: IDevice;
      engine: IEngine;
    };
  }
}


/**扩展 midwayjs/redis 声明自定义脚本命令  */
declare module '@midwayjs/redis' {
  interface RedisService {
    /**
     * 限流Lua命令
     * @param key 限流缓存key
     * @param time 限流时间,单位秒
     * @param count 限流次数
     */
    rateLimitCommand(key: string, time: number, count: number): Promise<number>;
  }
}
