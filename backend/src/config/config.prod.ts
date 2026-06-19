import { MidwayConfig } from '@midwayjs/core';
import { randomBytes } from 'node:crypto';

export default {
  keys: process.env.COOKIE_KEYS || randomBytes(32).toString('hex'),
  koa: {
    port: 8080,
  },
} as MidwayConfig;
