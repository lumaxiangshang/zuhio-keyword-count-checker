#!/usr/bin/env ts-node
/**
 * 创建 PayPal 产品和订阅计划
 * 运行前确保 .env.local 已配置正确的 Client ID 和 Secret
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES module 兼容
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 加载环境变量
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const PAYPAL_BASE_URL = 'https://api-m.sandbox.paypal.com';
const CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
const SECRET = process.env.PAYPAL_SECRET!;

// 获取 Access Token
async function getAccessToken(): Promise<string> {
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

// 创建产品
async function createProduct(accessToken: string, name: string, description: string, type: 'SERVICE' | 'DIGITAL_GOODS' = 'SERVICE') {
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/catalogs/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({
      name,
      description,
      type,
      category: 'SOFTWARE',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create product: ${error}`);
  }

  return await response.json();
}

// 创建订阅计划
async function createPlan(
  accessToken: string,
  productId: string,
  name: string,
  description: string,
  price: number,
  interval: 'MONTH' | 'YEAR',
  intervalCount: number = 1
) {
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({
      product_id: productId,
      name,
      description,
      status: 'ACTIVE',
      billing_cycles: [
        {
          frequency: {
            interval_unit: interval,
            interval_count: intervalCount,
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0, // 无限循环
          pricing_scheme: {
            fixed_price: {
              value: price.toString(),
              currency_code: 'USD',
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: {
          value: '0',
          currency_code: 'USD',
        },
        cancel_method: 'IMMEDIATE',
        payment_failure_threshold: 3,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create plan: ${error}`);
  }

  return await response.json();
}

// 主函数
async function main() {
  console.log('🚀 开始创建 PayPal 产品和订阅计划...\n');

  try {
    // 获取 Access Token
    console.log('📝 获取 Access Token...');
    const accessToken = await getAccessToken();
    console.log('✅ Access Token 获取成功\n');

    // 创建订阅产品
    console.log('📦 创建订阅产品...');
    const proProduct = await createProduct(accessToken, 'Zuhio Pro', 'Professional subscription for Zuhio keyword checker');
    console.log(`✅ Pro Product 创建成功：${proProduct.id}`);

    const businessProduct = await createProduct(accessToken, 'Zuhio Business', 'Business subscription for Zuhio keyword checker');
    console.log(`✅ Business Product 创建成功：${businessProduct.id}\n`);

    // 创建一次性支付产品（积分包）
    console.log('💰 创建一次性支付产品（积分包）...');
    const creditsProduct = await createProduct(accessToken, 'Zuhio Credits', 'One-time credit package for Zuhio', 'SERVICE');
    console.log(`✅ Credits Product 创建成功：${creditsProduct.id}\n`);

    // 创建订阅计划
    console.log('📋 创建订阅计划...');

    // Pro Monthly
    const proMonthlyPlan = await createPlan(accessToken, proProduct.id, 'Pro Monthly', 'Monthly subscription for Zuhio Pro', 9.99, 'MONTH');
    console.log(`✅ Pro Monthly Plan 创建成功：${proMonthlyPlan.id}`);

    // Pro Yearly
    const proYearlyPlan = await createPlan(accessToken, proProduct.id, 'Pro Yearly', 'Yearly subscription for Zuhio Pro', 99, 'YEAR');
    console.log(`✅ Pro Yearly Plan 创建成功：${proYearlyPlan.id}`);

    // Business Monthly
    const businessMonthlyPlan = await createPlan(accessToken, businessProduct.id, 'Business Monthly', 'Monthly subscription for Zuhio Business', 29.99, 'MONTH');
    console.log(`✅ Business Monthly Plan 创建成功：${businessMonthlyPlan.id}`);

    // Business Yearly
    const businessYearlyPlan = await createPlan(accessToken, businessProduct.id, 'Business Yearly', 'Yearly subscription for Zuhio Business', 299, 'YEAR');
    console.log(`✅ Business Yearly Plan 创建成功：${businessYearlyPlan.id}\n`);

    // 输出结果
    console.log('🎉 所有产品和计划创建成功！\n');
    console.log('📋 请将以下内容添加到 .env.local 文件中：\n');
    console.log('='.repeat(60));
    console.log('# PayPal Product IDs');
    console.log(`PAYPAL_PRODUCT_PRO=${proProduct.id}`);
    console.log(`PAYPAL_PRODUCT_BUSINESS=${businessProduct.id}`);
    console.log(`PAYPAL_PRODUCT_CREDITS=${creditsProduct.id}`);
    console.log('');
    console.log('# PayPal Plan IDs');
    console.log(`PAYPAL_PLAN_PRO_MONTHLY=${proMonthlyPlan.id}`);
    console.log(`PAYPAL_PLAN_PRO_YEARLY=${proYearlyPlan.id}`);
    console.log(`PAYPAL_PLAN_BUSINESS_MONTHLY=${businessMonthlyPlan.id}`);
    console.log(`PAYPAL_PLAN_BUSINESS_YEARLY=${businessYearlyPlan.id}`);
    console.log('='.repeat(60));
    console.log('\n💡 提示：创建完成后，运行 npm run dev 重启开发服务器以加载新配置\n');

  } catch (error: any) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

main();
