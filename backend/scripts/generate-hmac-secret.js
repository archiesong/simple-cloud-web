#!/usr/bin/env node

/**
 * HMAC 密钥生成工具
 * 用于生成安全的 HMAC-SHA256 签名密钥
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function generateHmacSecret() {
  console.log('🔐 生成 HMAC 密钥...\n');
  
  // 生成 64 字节（512位）的安全随机密钥
  const secret = crypto.randomBytes(64).toString('base64');
  
  console.log('✅ 密钥生成成功！\n');
  console.log('HMAC_SECRET=' + secret);
  console.log('\n📋 使用说明：');
  console.log('1. 将上面这行复制到你的 .env 文件中');
  console.log('2. 确保 .env 文件已添加到 .gitignore');
  console.log('3. 不同环境（开发/测试/生产）使用不同的密钥\n');
  
  // 尝试自动更新 .env 文件
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    try {
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      if (envContent.includes('HMAC_SECRET=')) {
        const confirm = require('readline-sync').keyInYN('检测到 .env 文件中已有 HMAC_SECRET，是否更新？');
        if (confirm) {
          envContent = envContent.replace(/HMAC_SECRET=.*/g, 'HMAC_SECRET=' + secret);
          fs.writeFileSync(envPath, envContent);
          console.log('✅ .env 文件已更新！');
        } else {
          console.log('已取消更新');
        }
      } else {
        const confirm = require('readline-sync').keyInYN('是否自动添加到 .env 文件？');
        if (confirm) {
          fs.appendFileSync(envPath, '\n# HMAC 签名密钥\nHMAC_SECRET=' + secret + '\n');
          console.log('✅ 已添加到 .env 文件！');
        }
      }
    } catch (error) {
      console.log('⚠️ 自动更新 .env 文件失败，请手动添加');
    }
  }
  
  return secret;
}

generateHmacSecret();
