import CryptoJS from 'crypto-js'
import JSEncrypt from 'jsencrypt'

const cryptoUtils = {
  /**
   * 生成随机的AES密钥
   *
   * @param {number} length 密钥长度（默认为32字节，对应256位）
   * @returns {string} Base64编码的密钥
   */
  generateAESKey: (length = 32) =>
    CryptoJS.lib.WordArray.random(length).toString(CryptoJS.enc.Base64),
  /**
   * 生成随机的初始化向量
   *
   * @param {number} length 向量长度（必须为16字节）
   * @returns {string} Base64编码的初始化向量
   */
  generateIV: (length = 16) => CryptoJS.lib.WordArray.random(length).toString(CryptoJS.enc.Base64),

  generateKeyPair: async () => {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP', // 使用 RSA-OAEP 算法
        modulusLength: 2048, // 密钥长度
        publicExponent: new Uint8Array([1, 0, 1]), // 公钥指数，通常是 65537
        hash: 'SHA-256', // 哈希算法
      },
      true, // 密钥是否可以导出
      ['encrypt', 'decrypt'], // 公钥用于加密，私钥用于解密
    )
    // const uint8Array = new Uint8Array(await crypto.subtle.exportKey('pkcs8', keyPair.privateKey))

    return keyPair
  },
  /**
   * RSA加密
   *
   * @param {string} plaintext 待加密数据
   * @param {string} publicKey 公钥
   * @returns {string} 加密后的数据
   */
  rsaEncrypt: (plaintext: string, _publicKey: string) => {
    const encrypt = new JSEncrypt()
    encrypt.setPublicKey(_publicKey)
    const maxLength = 245
    if (plaintext.length <= maxLength) {
      return encrypt.encryptOAEP(plaintext)
    }
    const chunks = []
    for (let i = 0; i < plaintext.length; i += maxLength) {
      const chunk = plaintext.slice(i, i + maxLength)
      const encryptedChunk = encrypt.encryptOAEP(chunk)
      if (!encryptedChunk) {
        throw new Error('RSA encryption failed')
      }
      chunks.push(encryptedChunk)
    }
    return chunks.join('@~@')
  },
  /**
   * AES加密
   *
   * @param {Object|string} data 待加密数据
   * @param {string} key AES密钥
   * @param {string} iv 向量
   * @returns {string} 加密后的数据
   */
  aesEncrypt: (data: Record<string, any> | string, key: string, iv: string) => {
    const dataStr = typeof data === 'object' ? JSON.stringify(data) : String(data)

    const keyBytes = CryptoJS.enc.Base64.parse(key)
    const ivBytes = CryptoJS.enc.Base64.parse(iv)

    const encrypted = CryptoJS.AES.encrypt(dataStr, keyBytes, {
      iv: ivBytes,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })

    return encrypted.toString()
  },
  /**
   * AES解密
   *
   * @param {string} encryptedData 加密数据
   * @param {string} key AES密钥
   * @param {string} iv 向量
   * @returns {Object|string} 解密后的数据
   */
  aesDecrypt: (encryptedData: string, key: string, iv: string): Record<string, any> | string => {
    const keyParse = CryptoJS.enc.Base64.parse(key)
    const ivParse = CryptoJS.enc.Base64.parse(iv)

    const decrypted = CryptoJS.AES.decrypt(encryptedData, keyParse, {
      iv: ivParse,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })

    const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8)

    try {
      return JSON.parse(decryptedStr)
    } catch (e) {
      console.error(e)
      return decryptedStr
    }
  },
  /**
   * 生成 HMAC-SHA256 签名
   */
  sign: (data: string | CryptoJS.lib.WordArray, secret: CryptoJS.lib.WordArray | string) => {
    return CryptoJS.HmacSHA256(data, secret).toString(CryptoJS.enc.Base64)
  },
  /**
   * 构建签名字符串（标准化格式）
   */
  buildSignaturePayload: (
    encryptedData: string,
    timestamp: number,
    nonce: string,
    method: string,
    path?: string,
  ) => {
    return `${method.toUpperCase()}|${path}|${timestamp}|${nonce}|${encryptedData}`
  },
  //   // 2. 拼接参数字符串
  //   const paramStr = JSON.stringify(sortedParams)

  //   // 3. 组合签名原文
  //   const signStr = [
  //     `params=${paramStr}`,
  //     `timestamp=${timestamp}`,
  //     `nonce=${nonce}`,
  //     `aesKey=${aesKey}`,
  //     `version=1.0`
  //   ]
  //     .sort()
  //     .join('&')

  //   // 4. 多重哈希
  //   let hash = CryptoJS.SHA512(signStr).toString()
  //   hash = CryptoJS.SHA256(hash).toString()
  //   hash = CryptoJS.MD5(hash).toString()

  //   return hash
  // },

  // /**
  //  * 验证签名
  //  *
  //  * @param {Object} params 请求参数
  //  * @param {string} timestamp 时间戳
  //  * @param {string} nonce 随机字符串
  //  * @param {string} aesKey AES密钥
  //  * @param {string} signature 签名
  //  * @returns {boolean} 验证结果
  //  */
  // verifySignature: (
  //   params: Record<string, any>,
  //   timestamp: string,
  //   nonce: string,
  //   aesKey: string,
  //   signature: string
  // ): boolean => {
  //   // 1. 对参数按key进行字典排序
  //   const sortedKeys = Object.keys(params).sort()
  //   const sortedParams: Record<string, any> = {}
  //   sortedKeys.forEach((key) => {
  //     sortedParams[key] = params[key]
  //   })

  //   // 2. 拼接参数字符串
  //   const paramStr = JSON.stringify(sortedParams)

  //   // 3. 组合签名原文
  //   const signStr = [
  //     `params=${paramStr}`,
  //     `timestamp=${timestamp}`,
  //     `nonce=${nonce}`,
  //     `aesKey=${aesKey}`,
  //     `version=1.0`
  //   ]
  //     .sort()
  //     .join('&')

  //   // 4. 多重哈希
  //   let hash = CryptoJS.SHA512(signStr).toString()
  //   hash = CryptoJS.SHA256(hash).toString()
  //   hash = CryptoJS.MD5(hash).toString()

  //   return hash === signature
  // },
  /**
   * 生成随机字符串
   *
   * @param {number} length 长度
   * @returns {string} 随机字符串
   */
  generateNonce: (length: number = 32): string => {
    const array = new Uint8Array(length)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''

    for (let i = 0; i < length; i++) {
      const timestamp = Date.now()
      const random = Math.random()
      const combined = timestamp * random
      array[i] = Math.floor(combined % chars.length)
      result += chars.charAt(array[i]!)
    }

    const timePrefix = Date.now().toString(36).slice(-3)
    result = timePrefix + result.slice(0, length - 3)

    return result
  },
}

// /**
//  * AES 加密工具类
//  */
// export class AesCrypto {
//   /**
//    * 生成随机 AES Key (32字节 = 256位)
//    */
//   static generateKey() {
//     return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Base64);
//   }

//   /**
//    * 生成随机 IV (16字节)
//    */
//   static generateIV() {
//     return CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Base64);
//   }

//   /**
//    * AES CBC 加密
//    */
//   static encrypt(data: Record<string, any> | string, key: string, iv: string) {
//     const keyBytes = CryptoJS.enc.Base64.parse(key);
//     const ivBytes = CryptoJS.enc.Base64.parse(iv);
//     const encrypted = CryptoJS.AES.encrypt(
//       typeof data === 'string' ? data : JSON.stringify(data),
//       keyBytes,
//       {
//         iv: ivBytes,
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7
//       }
//     );
//     return encrypted.toString();
//   }

//   /**
//    * AES CBC 解密
//    */
//   static decrypt(encryptedData: string, key: string, iv: string) {
//     const keyBytes = CryptoJS.enc.Base64.parse(key);
//     const ivBytes = CryptoJS.enc.Base64.parse(iv);
//     const decrypted = CryptoJS.AES.decrypt(
//       encryptedData,
//       keyBytes,
//       {
//         iv: ivBytes,
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7
//       }
//     );
//     const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
//     try {
//       return JSON.parse(decryptedStr);
//     } catch {
//       return decryptedStr;
//     }
//   }

//   /**
//    * 生成 HMAC-SHA256 签名
//    */
//   static sign(data: string | CryptoJS.lib.WordArray, secret:CryptoJS.lib.WordArray | string) {
//     return CryptoJS.HmacSHA256(data, secret)
//       .toString(CryptoJS.enc.Base64);
//   }

//   /**
//    * 构建签名字符串（标准化格式）
//    */
//   static buildSignaturePayload(encryptedData: string, timestamp: string, nonce: string, method: string, path: string) {
//     return `${method.toUpperCase()}|${path}|${timestamp}|${nonce}|${encryptedData}`;
//   }

//   /**
//    * 生成随机字符串 (Nonce)
//    */
//   static generateNonce() {
//     return CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
//   }
// }

// /**
//  * RSA 加密工具类
//  */
// export class RsaCrypto {
//   /**
//    * 公钥加密
//    */
//   static encrypt(data: string | Record<string,any>, publicKey: string) {
//     const encrypt = new JSEncrypt();
//     encrypt.setPublicKey(publicKey);
//     const result = encrypt.encrypt(typeof data === 'string' ? data : JSON.stringify(data));
//     if (!result) {
//       throw new Error('RSA encryption failed');
//     }
//     return result;
//   }

//   /**
//    * 公钥验证格式
//    */
//   static isValidPublicKey(publicKey: string) {
//     return publicKey && publicKey.includes('-----BEGIN PUBLIC KEY-----');
//   }
// }

export default cryptoUtils
