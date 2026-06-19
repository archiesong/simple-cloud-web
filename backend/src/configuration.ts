import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'node:path';
import * as dotenv from 'dotenv';
import * as swagger from '@midwayjs/swagger';
import * as jwt from '@midwayjs/jwt';
import * as cron from '@midwayjs/cron';
import * as staticFile from '@midwayjs/static-file';
import * as redis from '@midwayjs/redis';
import * as orm from '@midwayjs/typeorm';
import * as captcha from '@midwayjs/captcha';
import * as cacheManager from '@midwayjs/cache-manager';
import { DefaultErrorFilter } from './filter/default.filter';
import { NotFoundFilter } from './filter/notfound.filter';
import { ReportMiddleware } from './middleware/report.middleware';
import { JwtMiddleware } from './middleware/jwt.middleware';
import { BrowserMiddleware } from './middleware/browser.middleware';
import { CryptoMiddleware } from './middleware/crypto.middleware';
dotenv.config();

@Configuration({
  imports: [
    // 导入 koa 组件
    koa,
    // 导入参数验证组件
    validate,
    // 导入数据库 ORM 组件
    orm,
    // 导入redis 组件
    redis,
    // 导入缓存管理组件
    cacheManager,
    // 导入本地任务组件
    cron,
    // 导入 验证码 组件
    captcha,
    // 导入 Json Web Token 组件
    jwt,
    // 导入 swagger 组件
    swagger,
    // 导入静态文件映射 staticFile 组件
    staticFile,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;
  async onReady() {
    // add middleware
    this.app.useMiddleware([
      ReportMiddleware,
      BrowserMiddleware,
      CryptoMiddleware, // 加密解密中间件
      JwtMiddleware,
    ]);
    // add filter
    this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
