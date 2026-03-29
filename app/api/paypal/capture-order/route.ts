import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
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

/**
 * 捕获 PayPal 订单并添加积分
 */
export async function POST(request: NextRequest) {
  const reqId = crypto.randomUUID();
  console.log(`[${reqId}] Capture Order - Request received`);

  try {
    const { orderId, paymentId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    console.log(`[${reqId}] Capturing order: ${orderId}`);

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

    const captureData = await response.json();
    console.log(`[${reqId}] Order captured:`, captureData.id);

    // 更新支付记录
    const payment = await prisma.payment.update({
      where: { paypalOrderId: orderId },
      data: {
        status: 'COMPLETED',
        paypalCaptureId: captureData.id,
        updatedAt: new Date(),
      },
    });

    console.log(`[${reqId}] Payment updated: ${payment.id}`);

    // 给用户添加积分
    if (payment.userId && payment.credits) {
      const user = await prisma.user.update({
        where: { id: payment.userId },
        data: {
          credits: {
            increment: payment.credits,
          },
        },
      });

      console.log(`[${reqId}] User ${user.id} received ${payment.credits} credits. New balance: ${user.credits}`);

      return NextResponse.json({
        success: true,
        message: 'Payment successful',
        credits: payment.credits,
        newBalance: user.credits,
        captureData,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment successful (no user associated)',
      captureData,
    });

  } catch (error: any) {
    console.error(`[${reqId}] Capture Order Error:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
