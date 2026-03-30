import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import paypalConfig, { type PlanKey } from '@/lib/paypal-config';

const prisma = new PrismaClient();
const PAYPAL_BASE_URL = paypalConfig.apiUrl;

/**
 * 获取 PayPal Access Token
 */
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

/**
 * 获取订阅详情
 */
async function getSubscriptionDetails(subscriptionId: string, accessToken: string) {
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get subscription details: ${error}`);
  }

  return response.json();
}

/**
 * 激活订阅（用户从 PayPal 批准后回调）
 * POST /api/subscription/activate
 */
export async function POST(request: NextRequest) {
  const reqId = crypto.randomUUID();
  console.log(`[${reqId}] Activate Subscription - Request received`);

  try {
    const { subscriptionId, baToken, token } = await request.json();

    if (!subscriptionId) {
      return NextResponse.json(
        { success: false, error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    console.log(`[${reqId}] Activating subscription: ${subscriptionId}`);

    // 获取 PayPal Access Token
    const accessToken = await getAccessToken();

    // 获取订阅详情
    const paypalSubscription = await getSubscriptionDetails(subscriptionId, accessToken);
    const userEmail = paypalSubscription.subscriber?.email_address;
    
    if (!userEmail) {
      throw new Error('No email found in PayPal subscription');
    }

    if (!userEmail) {
      throw new Error('No email found in PayPal subscription');
    }

    console.log(`[${reqId}] Subscriber email: ${userEmail}`);

    // 查找或创建用户
    let user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      console.log(`[${reqId}] Creating new user: ${userEmail}`);
      user = await prisma.user.create({
        data: {
          email: userEmail,
          subscriptionPlan: 'FREE',
          subscriptionStatus: 'INACTIVE',
        },
      });
    }

    // 获取计划信息
    const plan = planKey ? paypalConfig.plans[planKey as PlanKey] : null;
    const planName = plan?.name || 'PRO';
    const billingCycle = plan?.billingCycle || 'MONTHLY';
    const amount = plan?.price || 9.99;

    // 计算订阅周期
    const billingCycleMonths = billingCycle === 'YEARLY' ? 12 : 1;
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + billingCycleMonths);

    // 更新或创建订阅记录
    const existingSubscription = await prisma.subscription.findUnique({
      where: { paypalSubscriptionId: subscriptionId },
    });

    if (existingSubscription) {
      // 更新现有订阅
      await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          userId: user.id,
          status: 'ACTIVE',
          planName,
          billingCycle: billingCycle as 'MONTHLY' | 'YEARLY',
          amount,
          currentPeriodStart: new Date(),
          currentPeriodEnd: periodEnd,
        },
      });
    } else {
      // 创建新订阅
      await prisma.subscription.create({
        data: {
          userId: user.id,
          paypalSubscriptionId: subscriptionId,
          planId: plan?.id || '',
          planName,
          billingCycle: billingCycle as 'MONTHLY' | 'YEARLY',
          amount,
          currency: 'USD',
          status: 'ACTIVE',
          currentPeriodStart: new Date(),
          currentPeriodEnd: periodEnd,
        },
      });
    }

    // 更新用户订阅状态
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionPlan: planName as 'PRO' | 'BUSINESS',
        subscriptionStatus: 'ACTIVE',
      },
    });

    // 记录订阅事件
    await prisma.subscriptionEvent.create({
      data: {
        userId: user.id,
        eventType: 'SUBSCRIPTION_ACTIVATED',
        newPlan: planName as 'PRO' | 'BUSINESS',
        newStatus: 'ACTIVE',
        amount,
        paypalSubscriptionId: subscriptionId,
      },
    });

    console.log(`[${reqId}] Subscription activated for user: ${user.id}`);

    return NextResponse.json({
      success: true,
      userId: user.id,
      subscriptionId,
      plan: planName,
      message: 'Subscription activated successfully',
    });

  } catch (error: any) {
    console.error(`[${reqId}] Activate Subscription Error:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
