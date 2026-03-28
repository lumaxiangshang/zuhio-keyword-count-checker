import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const PAYPAL_BASE_URL = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';

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

export async function POST(request: NextRequest) {
  const reqId = crypto.randomUUID();
  console.log(`[${reqId}] Activate Subscription - Request received`);

  try {
    const { subscriptionID, planId } = await request.json();

    if (!subscriptionID) {
      return NextResponse.json(
        { success: false, error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    console.log(`[${reqId}] Activating subscription:`, subscriptionID);

    const accessToken = await getAccessToken();
    const subscriptionDetails = await getSubscriptionDetails(accessToken, subscriptionID);

    const status = subscriptionDetails.status;
    console.log(`[${reqId}] Subscription status:`, status);

    if (status === 'APPROVED' || status === 'ACTIVE') {
      // 提取订阅信息
      const plan = subscriptionDetails.plan;
      const billingCycle = plan?.billing_cycles?.[0];
      const interval = billingCycle?.frequency?.interval_unit;
      const price = billingCycle?.pricing_scheme?.fixed_price?.value;

      // 确定套餐类型
      let planType = 'PRO';
      let planName = 'Pro';
      if (planId?.includes('BUSINESS')) {
        planType = 'BUSINESS';
        planName = 'Business';
      }

      const billingCycleType = interval === 'YEAR' ? 'YEARLY' : 'MONTHLY';

      // 计算订阅周期结束时间
      const now = new Date();
      const currentPeriodEnd = new Date(now);
      if (interval === 'YEAR') {
        currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
      } else {
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
      }

      // 使用事务创建订阅和更新用户
      const [subscription, updatedUser] = await prisma.$transaction([
        // 创建订阅记录
        prisma.subscription.create({
          data: {
            userId: subscriptionDetails.subscriber?.email_address || 'unknown',
            paypalSubscriptionId: subscriptionID,
            planId,
            planName,
            billingCycle: billingCycleType,
            amount: parseFloat(price || '0'),
            currency: 'USD',
            status: 'ACTIVE',
            currentPeriodStart: now,
            currentPeriodEnd,
          },
        }),
        // 更新用户订阅状态
        prisma.user.update({
          where: { email: subscriptionDetails.subscriber?.email_address || 'unknown' },
          data: {
            subscriptionPlan: planType as any,
            subscriptionStatus: 'ACTIVE',
            subscriptionEndDate: currentPeriodEnd,
            paypalSubscriptionId: subscriptionID,
          },
        }),
      ]);

      console.log(`[${reqId}] Subscription activated:`, {
        subscriptionId: subscription.id,
        userId: updatedUser.id,
        plan: planName,
        billingCycle: billingCycleType,
      });

      return NextResponse.json({
        success: true,
        subscriptionId: subscription.id,
        plan: planType.toLowerCase(),
        billingCycle: billingCycleType.toLowerCase(),
        status: 'ACTIVE',
        currentPeriodEnd: currentPeriodEnd.toISOString(),
      });
    } else {
      return NextResponse.json(
        { success: false, error: `Subscription status: ${status}` },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error(`[${reqId}] Activate Subscription Error:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
