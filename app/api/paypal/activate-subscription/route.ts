import { NextRequest, NextResponse } from 'next/server';

// PayPal API 基础 URL
const PAYPAL_BASE_URL = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';

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

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

// 获取订阅详情
async function getSubscriptionDetails(accessToken: string, subscriptionId: string) {
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get subscription details: ${error}`);
  }

  return await response.json();
}

// 激活订阅
export async function POST(request: NextRequest) {
  try {
    const { subscriptionID, planId } = await request.json();

    if (!subscriptionID) {
      return NextResponse.json(
        { success: false, error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    const accessToken = await getAccessToken();

    // 获取订阅详情
    const subscriptionDetails = await getSubscriptionDetails(accessToken, subscriptionID);

    // 验证订阅状态
    const status = subscriptionDetails.status;
    
    if (status === 'APPROVED' || status === 'ACTIVE') {
      // 提取订阅信息
      const plan = subscriptionDetails.plan;
      const billingCycle = plan?.billing_cycles?.[0];
      const interval = billingCycle?.frequency?.interval_unit;
      const price = billingCycle?.pricing_scheme?.fixed_price?.value;

      // 确定套餐类型
      let planType = 'pro';
      if (planId?.includes('BUSINESS')) {
        planType = 'business';
      }

      // TODO: 在这里更新数据库，激活用户订阅
      // await db.user.update({
      //   where: { id: userId },
      //   data: {
      //     subscriptionStatus: 'active',
      //     subscriptionPlan: planType,
      //     subscriptionCycle: interval === 'YEAR' ? 'yearly' : 'monthly',
      //     paypalSubscriptionId: subscriptionID,
      //     subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 天后
      //   },
      // });

      console.log('✅ Subscription activated:', {
        subscriptionId: subscriptionID,
        planId,
        planType,
        status,
        price,
        interval,
      });

      return NextResponse.json({
        success: true,
        message: 'Subscription activated successfully',
        subscriptionId: subscriptionID,
        plan: planType,
        billingCycle: interval === 'YEAR' ? 'yearly' : 'monthly',
        status,
      });
    } else {
      return NextResponse.json(
        { success: false, error: `Subscription status: ${status}` },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('Subscription Activation Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
