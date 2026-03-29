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
 * 创建 PayPal 订单（完整版 - 保存数据库）
 */
export async function POST(request: NextRequest) {
  const reqId = crypto.randomUUID();
  console.log(`[${reqId}] Create Order - Request received`);

  try {
    const { credits, price, userId, userEmail } = await request.json();

    if (!credits || !price) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: credits, price' },
        { status: 400 }
      );
    }

    // 如果没有 userId，尝试通过 email 查找用户
    let finalUserId = userId;
    if (!finalUserId && userEmail) {
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        select: { id: true },
      });
      finalUserId = user?.id;
    }

    console.log(`[${reqId}] Creating order: ${credits} credits for $${price}, userId: ${finalUserId}`);

    const accessToken = await getAccessToken();
    console.log(`[${reqId}] Access token obtained`);

    // 创建 PayPal 订单
    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: `credits-${Date.now()}`,
            custom_id: finalUserId || 'guest',
            amount: {
              currency_code: 'USD',
              value: price.toString(),
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: price.toString(),
                },
              },
            },
            items: [
              {
                name: 'Zuhio Credits Package',
                unit_amount: {
                  currency_code: 'USD',
                  value: price.toString(),
                },
                quantity: '1',
                description: `${credits} credits for Zuhio keyword checker`,
                category: 'DIGITAL_GOODS',
              },
            ],
          },
        ],
        application_context: {
          brand_name: 'Zuhio',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancelled`,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`[${reqId}] PayPal API error:`, error);
      throw new Error(`Failed to create order: ${error}`);
    }

    const order = await response.json();
    console.log(`[${reqId}] PayPal order created:`, order.id);

    // 在数据库中创建支付记录
    const payment = await prisma.payment.create({
      data: {
        userId: finalUserId || 'anonymous',
        amount: parseFloat(price),
        currency: 'USD',
        paypalOrderId: order.id,
        paymentType: 'ONE_TIME',
        status: 'PENDING',
        credits,
        metadata: {
          order,
          createdAt: new Date().toISOString(),
        },
      },
    });

    console.log(`[${reqId}] Payment record created: ${payment.id}`);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      approvalUrl: order.links?.find((link: any) => link.rel === 'approve')?.href,
      paymentId: payment.id,
    });

  } catch (error: any) {
    console.error(`[${reqId}] Create Order Error:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
