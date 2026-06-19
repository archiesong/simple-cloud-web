#!/usr/bin/env node

/**
 * 简单版 HMAC 密钥生成工具（无外部依赖）
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🔐 正在生成 HMAC 密钥...\n');

// 生成 64 字节（512位）的安全随机密钥
const secret = crypto.randomBytes(64).toString('base64');

console.log('=' .repeat(80));
console.log('HMAC_SECRET=' + secret);
console.log('=' .repeat(80));
console.log('\n✅ 密钥生成成功！');
console.log('\n📝 下一步：');
console.log('1. 将上面的配置行复制到 .env 文件');
console.log('2. 确保 .env 已添加到 .gitignore');
console.log('3. 不要将密钥提交到代码仓库\n');

// 尝试自动添加到 .env
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  if (!envContent.includes('HMAC_SECRET=')) {
    try {
      fs.appendFileSync(envPath, '\n# HMAC 签名密钥\nHMAC_SECRET=' + secret + '\n');
      console.log('✨ 已自动添加到 .env 文件！\n');
    } catch (e) {
      console.log('⚠️ 无法自动写入 .env，请手动添加\n');
    }
  } else {
    console.log('ℹ️ .env 文件中已存在 HMAC_SECRET，请手动替换\n');
  }
}
