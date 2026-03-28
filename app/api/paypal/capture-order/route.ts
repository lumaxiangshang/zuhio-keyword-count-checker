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

export async function POST(request: NextRequest) {
  const reqId = crypto.randomUUID();
  console.log(`[${reqId}] Capture Order - Request received`);

  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    console.log(`[${reqId}] Capturing order:`, orderId);

    // 查找数据库中的支付记录
    const payment = await prisma.payment.findUnique({
      where: { paypalOrderId: orderId },
      include: { user: true },
    });

    if (!payment) {
      console.error(`[${reqId}] Payment record not found for order:`, orderId);
      return NextResponse.json(
        { success: false, error: 'Payment record not found' },
        { status: 404 }
      );
    }

    if (payment.status === 'COMPLETED') {
      console.log(`[${reqId}] Payment already completed`);
      return NextResponse.json({
        success: true,
        status: 'ALREADY_COMPLETED',
        credits: payment.credits,
      });
    }

    const accessToken = await getAccessToken();

    // 捕获 PayPal 订单
    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`[${reqId}] PayPal capture error:`, error);
      throw new Error(`Failed to capture order: ${error}`);
    }

    const captureDetails = await response.json();
    const paymentStatus = captureDetails.status;
    const purchaseUnit = captureDetails.purchase_units?.[0];
    const payments = purchaseUnit?.payments?.captures?.[0];

    console.log(`[${reqId}] PayPal capture response:`, {
      status: paymentStatus,
      captureId: payments?.id,
      amount: payments?.amount?.value,
    });

    if (paymentStatus === 'COMPLETED') {
      // 使用事务更新数据库
      const [updatedPayment, updatedUser] = await prisma.$transaction([
        // 更新支付记录
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'COMPLETED',
            paypalCaptureId: payments?.id,
            metadata: {
              ...payment.metadata,
              captureDetails,
            },
          },
        }),
        // 添加积分到用户账户
        prisma.user.update({
          where: { id: payment.userId },
          data: {
            credits: { increment: payment.credits || 0 },
          },
        }),
      ]);

      console.log(`[${reqId}] Payment completed and credits added:`, {
        userId: payment.userId,
        creditsAdded: payment.credits,
        newCreditBalance: updatedUser.credits,
      });

      return NextResponse.json({
        success: true,
        status: 'COMPLETED',
        captureId: payments?.id,
        amount: payments?.amount?.value,
        currency: payments?.amount?.currency_code,
        credits: payment.credits,
        userCredits: updatedUser.credits,
      });
    } else {
      // 支付未完成，更新状态
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      });

      return NextResponse.json({
        success: false,
        error: `Payment status: ${paymentStatus}`,
      });
    }

  } catch (error: any) {
    console.error(`[${reqId}] Capture Order Error:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
