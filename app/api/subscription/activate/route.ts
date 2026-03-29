import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 激活订阅（用户从 PayPal 批准后回调）
 */
export async function GET(request: NextRequest) {
  const reqId = crypto.randomUUID();
  console.log(`[${reqId}] Activate Subscription - Request received`);

  try {
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('subscription_id');
    const email = searchParams.get('email');

    if (!subscriptionId || !email) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/pricing?error=missing_params`);
    }

    console.log(`[${reqId}] Activating subscription: ${subscriptionId} for ${email}`);

    // 查找或创建用户
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          subscriptionPlan: 'PRO',
          subscriptionStatus: 'ACTIVE',
          subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 天后
        },
      });
    } else {
      user = await prisma.user.update({
        where: { email },
        data: {
          subscriptionPlan: 'PRO',
          subscriptionStatus: 'ACTIVE',
          subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    }

    // 创建订阅记录
    await prisma.subscription.create({
      data: {
        userId: user.id,
        paypalSubscriptionId: subscriptionId,
        planId: 'pro_monthly', // TODO: 从参数获取
        planName: 'Pro Monthly',
        billingCycle: 'MONTHLY',
        amount: 9.99,
        currency: 'USD',
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    console.log(`[${reqId}] Subscription activated for user: ${user.id}`);

    // 重定向到成功页面
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/subscription/success?activated=true`);

  } catch (error: any) {
    console.error(`[${reqId}] Activate Subscription Error:`, error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/pricing?error=${encodeURIComponent(error.message)}`);
  } finally {
    await prisma.$disconnect();
  }
}
