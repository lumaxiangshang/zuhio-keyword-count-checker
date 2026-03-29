import { NextRequest, NextResponse } from 'next/server';

/**
 * PayPal 订单创建测试 API（不依赖数据库）
 * 访问：https://zuhiokeywordcountchecker.shop/api/paypal/test-create-order
 * 测试方法：POST with JSON body
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
  console.log(`[${reqId}] Test Create Order - Request received`);

  try {
    const { credits = 100, price = 9.99 } = await request.json();

    console.log(`[${reqId}] Testing PayPal order creation: ${credits} credits for $${price}`);

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
            reference_id: `test-${Date.now()}`,
            amount: {
              currency_code: 'USD',
              value: price.toString(),
            },
            items: [
              {
                name: 'Test Credits Package',
                unit_amount: {
                  currency_code: 'USD',
                  value: price.toString(),
                },
                quantity: '1',
                description: `${credits} test credits`,
                category: 'DIGITAL_GOODS',
              },
            ],
          },
        ],
        application_context: {
          brand_name: 'Zuhio Test',
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
      throw new Error(`PayPal API error: ${error}`);
    }

    const order = await response.json();
    console.log(`[${reqId}] PayPal order created:`, order.id);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      status: order.status,
      approvalUrl: order.links?.find((link: any) => link.rel === 'approve')?.href,
      message: 'PayPal order created successfully (test mode, no database)',
    });

  } catch (error: any) {
    console.error(`[${reqId}] Test Create Order Error:`, error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}

// 也支持 GET 用于快速测试
export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to test PayPal order creation',
    example: {
      method: 'POST',
      body: { credits: 100, price: 9.99 },
    },
  });
}
