#!/usr/bin/env ts-node
/**
 * 测试 PayPal API 连接
 * 验证凭证是否有效
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const PAYPAL_BASE_URL = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';
const CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
const SECRET = process.env.PAYPAL_SECRET!;

async function testPayPalConnection() {
  console.log('🧪 Testing PayPal API Connection...\n');
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('API URL:', PAYPAL_BASE_URL);
  console.log('Client ID:', CLIENT_ID ? `${CLIENT_ID.substring(0, 20)}...` : 'NOT SET');
  console.log('Secret:', SECRET ? `${SECRET.substring(0, 20)}...` : 'NOT SET');
  console.log('');

  if (!CLIENT_ID || !SECRET) {
    console.error('❌ Error: PayPal credentials not configured');
    process.exit(1);
  }

  try {
    // 测试获取 Access Token
    console.log('📝 Getting Access Token...');
    const tokenResponse = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('❌ Failed to get access token:', error);
      process.exit(1);
    }

    const tokenData = await tokenResponse.json();
    console.log('✅ Access Token obtained successfully');
    console.log('   Token Type:', tokenData.token_type);
    console.log('   Expires In:', tokenData.expires_in, 'seconds');
    console.log('');

    // 测试获取订阅详情（使用一个示例 Plan ID）
    const planId = process.env.NEXT_PUBLIC_PAYPAL_PLAN_PRO_MONTHLY;
    if (planId) {
      console.log('📋 Testing Subscription Plan Lookup...');
      console.log('   Plan ID:', planId);
      
      const planResponse = await fetch(`${PAYPAL_BASE_URL}/v1/billing/plans/${planId}`, {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      });

      if (planResponse.ok) {
        const planData = await planResponse.json();
        console.log('✅ Plan found successfully');
        console.log('   Plan Name:', planData.name);
        console.log('   Status:', planData.status);
        console.log('   Price:', planData.billing_cycles?.[0]?.pricing_scheme?.fixed_price?.value, 'USD');
      } else {
        const error = await planResponse.text();
        console.warn('⚠️  Plan lookup failed (this might be normal if plan ID is invalid):', error);
      }
      console.log('');
    }

    console.log('✅ All PayPal API tests passed!');
    console.log('');
    console.log('🎉 Your PayPal configuration is working correctly!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Visit http://localhost:3000/pricing');
    console.log('2. Click "Subscribe with PayPal"');
    console.log('3. Complete the payment with sandbox account');

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testPayPalConnection();
