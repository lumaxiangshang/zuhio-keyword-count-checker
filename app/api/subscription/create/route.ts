import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import paypalConfig from '@/lib/paypal-config';

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
 * 创建 PayPal 订阅
 * POST /api/subscription/create
 */
export async function POST(request: NextRequest) {
  const reqId = crypto.randomUUID();
  console.log(`[${reqId}] Create Subscription - Request received`);

  try {
    const { planKey, userEmail } = await request.json();

    // 验证计划
    if (!planKey || !paypalConfig.plans[planKey as keyof typeof paypalConfig.plans]) {
      return NextResponse.json(
        { success: false, error: 'Invalid plan' },
        { status: 400 }
      );
    }

    if (!userEmail) {
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

    // 创建临时订阅记录（待激活）
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (baseUrl) {
      await prisma.subscription.create({
        data: {
          userId: 'pending', // 临时值，激活时更新
          paypalSubscriptionId: subscription.id,
          planId: plan.id,
          planName: plan.name,
          billingCycle: plan.billingCycle as 'MONTHLY' | 'YEARLY',
          amount: plan.price,
          currency: plan.currency,
          status: 'INACTIVE',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 临时值
        },
      });
    }

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
