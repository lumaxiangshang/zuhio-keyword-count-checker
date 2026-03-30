import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import paypalConfig from '@/lib/paypal-config';

const prisma = new PrismaClient();
const PAYPAL_BASE_URL = process.env.PAYPAL_API_URL || paypalConfig.apiUrl;

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
 * 创建 PayPal 订阅
 * POST /api/subscription/create
 */
export async function POST(request: NextRequest) {
  const reqId = crypto.randomUUID();
  console.log(`[${reqId}] Create Subscription - Request received`);

  try {
    // 检查环境变量
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_SECRET;
    
    if (!clientId || !secret) {
      console.error(`[${reqId}] Missing PayPal credentials`);
      return NextResponse.json(
        { success: false, error: 'PayPal configuration missing. Please contact support.' },
        { status: 500 }
      );
    }

    const { planKey, userEmail } = await request.json();

    // 验证计划
    if (!planKey || !paypalConfig.plans[planKey as keyof typeof paypalConfig.plans]) {
      console.error(`[${reqId}] Invalid plan:`, planKey);
      return NextResponse.json(
        { success: false, error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    if (!userEmail) {
      console.error(`[${reqId}] Missing email`);
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const plan = paypalConfig.plans[planKey as keyof typeof paypalConfig.plans];
    console.log(`[${reqId}] Creating subscription: ${plan.name} ${plan.billingCycle} for ${userEmail}`);

    const accessToken = await getAccessToken();

    // 创建 PayPal 订阅
    const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        plan_id: plan.id,
        subscriber: {
          email_address: userEmail,
        },
        application_context: {
          brand_name: 'Zuhio',
          locale: 'en-US',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'SUBSCRIBE_NOW',
          payment_method: {
            payer_selected: 'PAYPAL',
            payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
          },
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?cancelled=true`,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`[${reqId}] PayPal API error:`, error);
      throw new Error(`Failed to create subscription: ${error}`);
    }

    const subscription = await response.json();
    console.log(`[${reqId}] PayPal subscription created:`, subscription.id);

    // 先查找或创建用户（确保外键约束满足）
    let user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userEmail,
          name: userEmail.split('@')[0],
          subscriptionPlan: 'FREE',
          subscriptionStatus: 'INACTIVE',
        },
      });
      console.log(`[${reqId}] Created new user:`, user.id);
    }

    // 创建订阅记录（使用真实的 userId）
    await prisma.subscription.create({
      data: {
        userId: user.id,
        paypalSubscriptionId: subscription.id,
        planId: plan.id,
        planName: plan.name,
        billingCycle: plan.billingCycle as 'MONTHLY' | 'YEARLY',
        amount: plan.price,
        currency: plan.currency,
        status: 'INACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
    console.log(`[${reqId}] Subscription record created for user:`, user.id);

    const approvalUrl = subscription.links?.find((link: any) => link.rel === 'approve')?.href;

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      approvalUrl,
      message: 'Subscription created. Redirect to approval URL.',
    });

  } catch (error: any) {
    console.error(`[${reqId}] Create Subscription Error:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
