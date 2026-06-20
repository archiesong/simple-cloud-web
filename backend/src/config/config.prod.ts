import { MidwayConfig } from '@midwayjs/core';
import { createRedisStore } from '@midwayjs/cache-manager';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';

const readConfigFile = (envName: string, fallbackPath: string) =>
  readFileSync(process.env[envName] || fallbackPath, 'utf-8');

const secret = (envName: string, byteLength: number) =>
  process.env[envName] || randomBytes(byteLength).toString('base64');

export default {
  keys: process.env.COOKIE_KEYS || randomBytes(32).toString('hex'),
  koa: {
    port: Number(process.env.PORT || 8080),
    globalPrefix: 'api',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: process.env.DB_HOST || 'mysql',
        port: Number(process.env.DB_PORT || 3306),
        username: process.env.DB_USERNAME || 'simple_cloud',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'simple-admin',
        synchronize: false,
        logging: process.env.DB_LOGGING === 'true',
        timezone: '+08:00',
        dateStrings: true,
        charset: 'utf8mb4',
        entities: ['modules/*/entity/*.entity.{j,t}s'],
      },
    },
  },
  captcha: {
    image: {
      noise: 4,
      width: 110,
      height: 36,
      type: 'letter',
    },
    expirationTime: 2 * 60,
  },
  cacheManager: {
    clients: {
      captcha: {
        store: createRedisStore('captcha'),
        ttl: 2 * 60 * 1000,
      },
      default: {
        store: createRedisStore('default'),
      },
    },
  },
  redis: {
    clients: {
      default: {
        host: process.env.REDIS_HOST || 'redis',
        port: Number(process.env.REDIS_PORT || 6379),
        password: process.env.REDIS_PASSWORD || undefined,
        db: Number(process.env.REDIS_DB || 3),
      },
      captcha: {
        host: process.env.REDIS_CAPTCHA_HOST || process.env.REDIS_HOST || 'redis',
        port: Number(process.env.REDIS_CAPTCHA_PORT || process.env.REDIS_PORT || 6379),
        password: process.env.REDIS_CAPTCHA_PASSWORD || process.env.REDIS_PASSWORD || undefined,
        db: Number(process.env.REDIS_CAPTCHA_DB || 4),
      },
    },
  },
  swagger: {
    title: 'RESTful API Service',
    description: 'swagger-ui document',
    termsOfService: 'https://example.com/terms/',
    version: '1.0.0',
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
  jwt: {
    algorithm: 'HS512',
    secret: secret('JWT_REFRESH_SECRET', 64),
    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
  },
  jwtWhiteList: [
    /^\/$/,
    /^\/api\/auth\/publicKey/,
    /^\/api\/auth\/captcha/,
    /^\/api\/auth\/login/,
    /^\/api\/auth\/logout/,
  ],
  jwtRefreshIn: process.env.JWT_REFRESH_IN || '20',
  login: {
    singleLogin: process.env.SINGLE_LOGIN === 'true',
    userCache: {
      idleTime: Number(process.env.LOGIN_USER_CACHE_IDLE_TIME || 21600),
    },
  },
  rsaKeyPair: {
    privateKey: readConfigFile(
      'RSA_PRIVATE_KEY_PATH',
      join(__dirname, './keys/private.pem')
    ),
    publicKey: readConfigFile('RSA_PUBLIC_KEY_PATH', join(__dirname, './keys/public.pem')),
  },
  aes: {
    key: secret('AES_KEY', 32),
    iv: secret('AES_IV', 16),
  },
  timestampTolerance: Number(process.env.TIMESTAMP_TOLERANCE || 5 * 60 * 1000),
  nonceExpire: Number(process.env.NONCE_EXPIRE || 10),
} as MidwayConfig;
