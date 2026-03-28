import { NextRequest, NextResponse } from 'next/server';

// PayPal API 基础 URL
const PAYPAL_BASE_URL = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';

// 获取 PayPal Access Token
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

// 创建一次性支付订单
export async function POST(request: NextRequest) {
  try {
    const { credits, price, userId, returnUrl, cancelUrl } = await request.json();

    const accessToken = await getAccessToken();

    // 创建订单
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
            reference_id: `credits-${userId}-${Date.now()}`,
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
          return_url: returnUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
          cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancelled`,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create order: ${error}`);
    }

    const order = await response.json();

    // 获取审批 URL
    const approvalUrl = order.links?.find((link: any) => link.rel === 'approve')?.href;

    return NextResponse.json({
      success: true,
      orderId: order.id,
      approvalUrl,
      order,
    });

  } catch (error: any) {
    console.error('Create Order Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
