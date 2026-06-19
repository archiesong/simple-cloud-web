import {
  Config,
  HttpStatus,
  IMiddleware,
  Inject,
  Middleware,
} from '@midwayjs/core';
import * as crypto from 'crypto';
import { Context, NextFunction } from '@midwayjs/koa';
import {
  ENCRYPT,
  ENCRYPTED_KEY,
  SIGNATURE,
  TIMESTAMP,
  NONCE,
  REQUEST_ID,
} from '../common/constant/encrypt.key';
import { RsaUtils } from '../util/rsa';
import { AesUtils } from '../util/aes';
import { BusinessException } from '../exception/business.exception';
import { RedisService } from '@midwayjs/redis';

@Middleware()
export class CryptoMiddleware implements IMiddleware<Context, NextFunction> {
  @Config('rsaKeyPair')
  rsaKeyPair: {
    privateKey: string;
    publicKey: string;
  };
  @Inject()
  aesUtils: AesUtils;
  @Config('timestampTolerance')
  timestampTolerance: number;
  @Inject()
  redisService: RedisService;
  @Config('nonceExpire')
  nonceExpire: number;
  @Inject()
  rsaUtils: RsaUtils;
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const startTime = Date.now();
      const requestId = ctx.get(REQUEST_ID) || ctx.reqId || crypto.randomUUID();
      // 1. 判断当前请求是否需要加解密
      const needCrypto = ctx.get(ENCRYPT) === '1';
      let aesKeyInfo: { key: string; iv: string } | null = null;

      if (needCrypto) {
        ctx.logger.info(
          `[CryptoMiddleware] 开始处理加密请求, requestId: ${requestId}`
        );
        try {
          // ========== 请求解密阶段 ==========
          const encryptedKey = ctx.get(ENCRYPTED_KEY);
          const signature = ctx.get(SIGNATURE);
          const timestamp = ctx.get(TIMESTAMP);
          const nonce = ctx.get(NONCE);
          if (!encryptedKey || !signature || !nonce || !timestamp) {
            throw new BusinessException(
              '请求头参数缺失!',
              HttpStatus.BAD_REQUEST
            );
          }

          // ========== 时间戳验证 ==========
          const ts = Number(timestamp);
          if (isNaN(ts)) {
            ctx.logger.warn(
              `[CryptoMiddleware] 时间戳格式错误, requestId: ${requestId}`
            );
            throw new BusinessException(
              '时间戳格式错误',
              HttpStatus.BAD_REQUEST
            );
          }
          const timeDiff = Math.abs(Date.now() - ts);
          if (timeDiff > this.timestampTolerance) {
            ctx.logger.warn(
              `[CryptoMiddleware] 请求已过期, 时间差: ${timeDiff}ms, requestId: ${requestId}`
            );
            throw new BusinessException('请求已过期', HttpStatus.BAD_REQUEST);
          }
          // ========== Nonce 防重放验证 ==========
          const nonceKey = `crypto:nonce:${nonce}`;
          const nonceSetResult = await this.redisService.set(
            nonceKey,
            requestId,
            'EX',
            this.nonceExpire,
            'NX'
          );
          if (nonceSetResult !== 'OK') {
            ctx.logger.warn(
              `[CryptoMiddleware] 检测到重复请求, nonce: ${nonce}, requestId: ${requestId}`
            );
            throw new BusinessException('重复请求', HttpStatus.BAD_REQUEST);
          }

          // ========== RSA 解密 AES Key ==========
          let aesKeyJson: string;
          try {
            aesKeyJson = this.rsaUtils.decryptByPrivateKey(
              encryptedKey,
              this.rsaKeyPair.privateKey
            );
          } catch (e) {
            ctx.logger.error(
              `[CryptoMiddleware] RSA解密失败, requestId: ${requestId}`,
              e
            );
            throw new BusinessException('密钥解密失败', HttpStatus.BAD_REQUEST);
          }
          try {
            aesKeyInfo = JSON.parse(aesKeyJson) as { key: string; iv: string };
            if (!aesKeyInfo.key || !aesKeyInfo.iv) {
              throw new Error('Invalid AES key format');
            }
          } catch (e) {
            ctx.logger.error(
              `[CryptoMiddleware] AES密钥格式错误, requestId: ${requestId}`,
              e
            );
            throw new BusinessException('密钥格式错误', HttpStatus.BAD_REQUEST);
          }
          // ========== 获取加密数据 ==========

          const encryptedBody =
            ctx.method.toUpperCase() === 'GET'
              ? (ctx.request.query as { data?: string })
              : (ctx.request.body as { data?: string });
          if (!encryptedBody || !encryptedBody.data) {
            ctx.logger.warn(
              `[CryptoMiddleware] 请求体数据缺失, requestId: ${requestId}`
            );
            throw new BusinessException('请求数据缺失', HttpStatus.BAD_REQUEST);
          }
          const encryptedData = encryptedBody.data;
          // ========== HMAC 签名验证 ==========
          const signaturePayload = this.aesUtils.buildSignaturePayload(
            encryptedData,
            timestamp,
            nonce,
            ctx.method,
            ctx.path
          );
          const isValidSignature = this.aesUtils.verify(
            signaturePayload,
            signature,
            aesKeyInfo.key
          );

          if (!isValidSignature) {
            ctx.logger.warn(
              `[CryptoMiddleware] 签名验证失败, requestId: ${requestId}`
            );
            throw new BusinessException('签名验证失败', HttpStatus.BAD_REQUEST);
          }

          // ========== AES 解密请求体 ==========
          let decryptedData: string;
          try {
            decryptedData = this.aesUtils.decrypt(
              encryptedData,
              aesKeyInfo.key,
              aesKeyInfo.iv
            );
          } catch (e) {
            ctx.logger.error(
              `[CryptoMiddleware] AES解密失败, requestId: ${requestId}`,
              e
            );
            throw new BusinessException('数据解密失败', HttpStatus.BAD_REQUEST);
          }
          // ========== 解析 JSON ==========
          try {
            if( ctx.method.toUpperCase() === 'GET') {
             ctx.request.query =  JSON.parse(decryptedData);
            } else {
            ctx.request.body = JSON.parse(decryptedData);
            }
         
          } catch (e) {
            ctx.logger.error(
              `[CryptoMiddleware] JSON解析失败, requestId: ${requestId}`,
              e
            );
            throw new BusinessException('数据格式错误', HttpStatus.BAD_REQUEST);
          }

          ctx.logger.info(
            `[CryptoMiddleware] 请求解密完成, method: ${ctx.method}, path: ${ctx.path}, requestId: ${requestId}`
          );
        } catch (error) {
          // 错误已经抛出，这里只记录日志
          if (!(error instanceof BusinessException)) {
            ctx.logger.error(
              `[CryptoMiddleware] 未知错误, requestId: ${requestId}`,
              error
            );
          }
          throw error;
        }
      }
      await next();

      // ========== 响应加密阶段 ==========
      if (needCrypto && aesKeyInfo && ctx.body) {
        try {
          ctx.logger.info(
            `[CryptoMiddleware] 开始加密响应, requestId: ${requestId}`
          );
          const responseData = JSON.stringify(ctx.body);
          const encryptedResponse = this.aesUtils.encrypt(
            responseData,
            aesKeyInfo.key,
            aesKeyInfo.iv
          );
          ctx.body = { data: encryptedResponse };
          // 添加安全响应头
          ctx.set('X-Encrypted', '1');
          ctx.set('X-Response-Id', requestId);
          const duration = Date.now() - startTime;
          ctx.logger.info(
            `[CryptoMiddleware] 响应加密完成, 耗时: ${duration}ms, requestId: ${requestId}`
          );
        } catch (e) {
          ctx.logger.error(
            `[CryptoMiddleware] 响应加密失败, requestId: ${requestId}`,
            e
          );
          // 加密失败不阻断响应，返回原始数据（降级处理）
          ctx.set('X-Encrypted', '0');
          ctx.set('X-Encryption-Error', 'true');
        }
      }
    };
  }
  static getName(): string {
    return 'crypto';
  }
}
