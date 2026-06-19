import { MidwayConfig } from '@midwayjs/core';
import { createRedisStore } from '@midwayjs/cache-manager';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';

const readConfigFile = (envName: string, fallbackPath: string) =>
  readFileSync(process.env[envName] || fallbackPath, 'utf-8');

const localSecret = (envName: string, byteLength: number) =>
  process.env[envName] || randomBytes(byteLength).toString('base64');

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: process.env.COOKIE_KEYS || randomBytes(32).toString('hex'),
  koa: {
    port: 7001,
    globalPrefix: 'api',
  },
  cors: {
    origin: '*',
  },
  /** TypeORM 数据源 http://www.midwayjs.org/docs/extensions/orm */
  typeorm: {
    dataSource: {
      // 默认数据库实例
      default: {
        /** 数据库类型 */
        type: 'mysql',
        /** 数据库IP */
        host: process.env.DB_HOST || '127.0.0.1',
        /** 数据库端口 */
        port: Number(process.env.DB_PORT || 3306),
        /** 数据库帐号 */
        username: process.env.DB_USERNAME || 'root',
        /** 数据库密码 */
        password: process.env.DB_PASSWORD || '',
        /**数据库名称 */
        database: process.env.DB_DATABASE || 'simple-admin',
        /** 自动建表 注意：线上部署的时候不要使用，有可能导致数据丢失 */
        synchronize: false,
        /**输出sql日志 */
        logging: false,
        /** 数据库时区 */
        timezone: '+08:00',
        /** 数据库日期格式化成字符串 */
        dateStrings: true,
        /** 字符集 */
        charset: 'utf8mb4',
        /** 配置实体模型以扫描形式 */
        entities: ['modules/*/entity/*.entity.{j,t}s'],
      },
    },
  },
  /** Captcha 验证码 https://www.midwayjs.org/docs/extensions/captcha */
  captcha: {
    image: {
      /**干扰线条的数量 默认 1 条 */
      noise: 4,
      width: 110,
      height: 36,
      type: 'letter',
    },
    // 过期时间 毫秒，默认 2 分钟
    expirationTime: 2 * 60,
  },
  /** CacheManager 缓存 https://www.midwayjs.org/docs/extensions/caching */
  cacheManager: {
    clients: {
      captcha: {
        store: createRedisStore('captcha'),
        ttl: 2 * 60 * 1000,
      },
      default: {
        store: createRedisStore('default'),
        // options: {
        //   ttl: 10,
        // },
      },
    },
  },
  /** Redis 缓存数据 http://www.midwayjs.org/docs/extensions/redis */
  redis: {
    clients: {
      default: {
        port: Number(process.env.REDIS_PORT || 6379),
        host: process.env.REDIS_HOST || '127.0.0.1',
        password: process.env.REDIS_PASSWORD || undefined,
        db: Number(process.env.REDIS_DB || 3),
      },
      captcha: {
        port: Number(process.env.REDIS_CAPTCHA_PORT || process.env.REDIS_PORT || 6379),
        host: process.env.REDIS_CAPTCHA_HOST || process.env.REDIS_HOST || '127.0.0.1',
        password: process.env.REDIS_CAPTCHA_PASSWORD || process.env.REDIS_PASSWORD || undefined,
        db: Number(process.env.REDIS_CAPTCHA_DB || 4),
      },
    },
  },
  /** Swagger 接口文档 http://www.midwayjs.org/docs/extensions/swagger */
  swagger: {
    title: 'RESTful API Service',
    description: 'swagger-ui document',
    termsOfService: 'https://example.com/terms/',
    version: '1.0.0',
    // servers: [
    //   {
    //     url: "http://127.0.0.1:7001/",
    //     description: "Local server",
    //   },
    // ],
    contact: {
      name: 'midwayjs',
      url: 'https://www.midwayjs.org/',
      email: 'admin@midwayjs.org',
    },
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
    },
    auth: {
      name: 'BasicAuth',
      authType: 'bearer',
      description: 'Basic Auth',
    },
  },
  /** JWT  JSON Web Token  https://www.midwayjs.org/docs/extensions/jwt */
  jwt: {
    /**令牌算法 */
    algorithm: 'HS512',
    /**令牌密钥 */
    secret: localSecret('JWT_REFRESH_SECRET', 64),
    /**令牌有效期（默认120分钟） */
    expiresIn: '2h',
  },
  /** 忽略令牌鉴权正则路由白名单 */
  jwtWhiteList: [
    /^\/$/,
    /^\/api\/auth\/publicKey/,
    /^\/api\/auth\/captcha/,
    /^\/api\/auth\/login/,
    /^\/api\/auth\/logout/,
  ],
  /** 令牌刷新有效期，相差不足xx分钟，自动刷新缓存 */
  jwtRefreshIn: '20',
  // 登录相关配置
  login: {
    // 是否限制单用户登录
    singleLogin: false,
    // Redis用户登录缓存配置
    userCache: {
      // 存活时间/秒
      idleTime: 21600,
    },
  },
  // RSA密钥对
  rsaKeyPair: {
    privateKey: readConfigFile(
      'RSA_PRIVATE_KEY_PATH',
      join(__dirname, './keys/private.pem')
    ),
    publicKey: readConfigFile('RSA_PUBLIC_KEY_PATH', join(__dirname, './keys/public.pem')),
  },
  // AES密钥和向量
  aes: {
    key: localSecret('AES_KEY', 32),
    iv: localSecret('AES_IV', 16),
  },
  // 时间戳及随机字符串超时时间(毫秒)
  timestampTolerance: 5 * 60 * 1000,
  // Nonce过期时间(秒)
  nonceExpire: 10,
} as MidwayConfig;
