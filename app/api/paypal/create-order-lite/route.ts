import { NextRequest, NextResponse } from 'next/server';

/**
 * PayPal 订单创建 API（简化版 - 不依赖数据库）
 * 用于快速测试和临时使用
 */
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
  console.log(`[${reqId}] Create Order (Lite) - Request received`);

  try {
    const { credits, price, userId } = await request.json();

    if (!credits || !price) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: credits, price' },
        { status: 400 }
      );
    }

    console.log(`[${reqId}] Creating order: ${credits} credits for $${price}`);

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

    // 不保存数据库，直接返回
    return NextResponse.json({
      success: true,
      orderId: order.id,
      approvalUrl: order.links?.find((link: any) => link.rel === 'approve')?.href,
      message: 'Order created (lite mode - no database)',
    });

  } catch (error: any) {
    console.error(`[${reqId}] Create Order Error:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
