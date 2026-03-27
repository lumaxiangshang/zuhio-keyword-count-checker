import { NextRequest, NextResponse } from 'next/server';

// PayPal API 基础 URL
const PAYPAL_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

// 获取 PayPal Access Token
async function getAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;

  if (!clientId || !secret) {
    throw new Error('PayPal credentials not configured');
  }

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${clientId}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

// 创建订阅计划
export async function POST(request: NextRequest) {
  try {
    const { planId, userId } = await request.json();

    // 这里应该从数据库获取用户的订阅信息
    // 简化处理，直接返回成功

    // 实际项目中需要：
    // 1. 验证订阅 ID
    // 2. 激活用户订阅
    // 3. 更新数据库中的用户计划

    console.log('Activating subscription:', { planId, userId });

    // 模拟成功响应
    return NextResponse.json({
      success: true,
      message: 'Subscription activated successfully',
      plan: 'pro',
      billingCycle: planId.includes('YEARLY') ? 'yearly' : 'monthly',
    });

  } catch (error: any) {
    console.error('Subscription Activation Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
