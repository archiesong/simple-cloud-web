import * as crypto from 'crypto';
import { Provide, Singleton } from '@midwayjs/core';
@Provide()
@Singleton()
export class AesUtils {
  /**
   * AES密钥长度(32字节对应256位)
   */
  private static AES_KEY_SIZE = 32;
  /**
   * 随机向量长度(固定为16字节)
   */
  private static IV_SIZE = 16;
  /**
   * 生成 AES 密钥（Base64 编码）
   */
  private static generateAESKey(length: number) {
    return crypto.randomBytes(length).toString('base64');
  }
  /**
   * 生成 IV（Base64 编码）
   */
  private static generateIV(length: number) {
    return crypto.randomBytes(length).toString('base64');
  }
  /**
   * 生成 AESKey 实例，包含 Base64 编码的密钥和 IV
   */
  generateAESKeyPair() {
    const key = AesUtils.generateAESKey(AesUtils.AES_KEY_SIZE);
    const iv = AesUtils.generateIV(AesUtils.IV_SIZE);
    return new AESKey(key, iv);
  }
  /**
   * AES CBC 加密（兼容 AES/CBC/PKCS5Padding）
   * @param data 明文
   * @param key  密钥（16/24/32 字节 => AES-128/192/256）
   * @param iv   向量（16 字节）
   */
  encrypt(data: string, key: string | Buffer, iv: string | Buffer): string {
    const keyBuf = typeof key === 'string' ? Buffer.from(key, 'base64') : key;
    const ivBuf = typeof iv === 'string' ? Buffer.from(iv, 'base64') : iv;
    const algo = `aes-${keyBuf.length * 8}-cbc`; // 根据 key 长度自动选 128/192/256
    const cipher = crypto.createCipheriv(algo, keyBuf, ivBuf);
    cipher.setAutoPadding(true); // PKCS5/PKCS7

    const encrypted = Buffer.concat([
      cipher.update(data, 'utf8'),
      cipher.final(),
    ]);

    // 返回 Base64 字符串
    return encrypted.toString('base64');
  }
  /**
   * AES CBC 解密
   * @param cipherBase64 密文（Base64）
   * @param key  密钥（16/24/32 字节 => AES-128/192/256）
   * @param iv   向量（16 字节）
   */
  decrypt(
    cipherBase64: string,
    key: string | Buffer,
    iv: string | Buffer
  ): string {
    const keyBuf = typeof key === 'string' ? Buffer.from(key, 'base64') : key;
    const ivBuf = typeof iv === 'string' ? Buffer.from(iv, 'base64') : iv;
    const algo = `aes-${keyBuf.length * 8}-cbc`;
    const decipher = crypto.createDecipheriv(algo, keyBuf, ivBuf);
    decipher.setAutoPadding(true);
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(cipherBase64, 'base64')),
      decipher.final(),
    ]);
    return decrypted.toString('utf8');
  }

  /**
   * 生成 HMAC-SHA256 签名
   * @param data 待签名数据
   * @param secret 签名密钥
   */
  sign(data: string, secret: string): string {
    return crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest('base64');
  }

  /**
   * 验证 HMAC-SHA256 签名
   * @param data 原始数据
   * @param signature 待验证签名
   * @param secret 签名密钥
   */
  verify(data: string, signature: string, secret: string): boolean {
    try {
      const expectedSignature = this.sign(data, secret);
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch {
      return false;
    }
  }

  /**
   * 构建签名字符串（标准化格式）
   */
  buildSignaturePayload(
    encryptedData: string,
    timestamp: string,
    nonce: string,
    method: string,
    path: string
  ): string {
    return `${method.toUpperCase()}|${path}|${timestamp}|${nonce}|${encryptedData}`;
  }
}
/**
 * AES密钥
 */
class AESKey {
  private readonly key: string;
  private readonly iv: string;
  constructor(key: string, iv: string) {
    this.key = key;
    this.iv = iv;
  }
  public getKey() {
    return this.key;
  }
  public getIv() {
    return this.iv;
  }
}
