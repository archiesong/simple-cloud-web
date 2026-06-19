import { MidwayConfig } from '@midwayjs/core';
import { randomBytes } from 'node:crypto';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: process.env.COOKIE_KEYS || randomBytes(32).toString('hex'),
  koa: {
    port: 7001,
  },
} as MidwayConfig;
