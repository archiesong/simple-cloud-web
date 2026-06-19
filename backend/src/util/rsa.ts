import { Provide, Singleton } from '@midwayjs/core';
import * as crypto from 'crypto';

@Singleton()
@Provide()
export class RsaUtils {
  /**
   * 构建RSA密钥对
   */
  generateKeyPair(): RsaKeyPair {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });
    return new RsaKeyPair(publicKey, privateKey);
  }
  /**
   * 使用公钥加密（前端模拟）
   * @param data 明文
   * @param publicKey 公钥
   */
  encryptByPublicKey(data: string, publicKey: string): string {
    const buffer = Buffer.from(data, 'utf8');
    const encrypted = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      buffer
    );
    return encrypted.toString('base64');
  }
  /**
   * 使用私钥解密（登录密码解密）
   * @param encrypted base64 加密字符串
   * @param privateKey 私钥
   */
  decryptByPrivateKey(encrypted: string, privateKey: string): string {
    const buffer = Buffer.from(encrypted, 'base64');
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      buffer
    );
    return decrypted.toString('utf8');
  }
  /**
   * 私钥加密
   * @param privateKey 私钥
   * @param data 待加密的信息
   */
  encryptByPrivateKey(data: string, privateKey: string) {
    const buffer = Buffer.from(data, 'utf8');

    const encrypted = crypto.privateEncrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      buffer
    );

    return encrypted.toString('base64');
  }
  /**
   * 公钥解密
   * @param publicKey 公钥
   * @param encrypted 待解密的信息
   */
  decryptByPublicKey(encrypted: string, publicKey: string) {
    const buffer = Buffer.from(encrypted, 'base64');

    const decrypted = crypto.publicDecrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      buffer
    );

    return decrypted.toString('utf8');
  }
}

/**
 * RSA密钥对对象
 */
class RsaKeyPair {
  private readonly publicKey: string;
  private readonly privateKey: string;
  constructor(publicKey: string, privateKey: string) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }
  public getPublicKey() {
    return this.publicKey;
  }
  public getPrivateKey() {
    return this.privateKey;
  }
}
