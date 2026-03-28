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

// 捕获订单（用户完成支付后）
export async function POST(request: NextRequest) {
  try {
    const { orderId, userId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const accessToken = await getAccessToken();

    // 捕获订单
    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to capture order: ${error}`);
    }

    const captureDetails = await response.json();

    // 检查支付状态
    const paymentStatus = captureDetails.status;
    const purchaseUnit = captureDetails.purchase_units?.[0];
    const payments = purchaseUnit?.payments?.captures?.[0];

    if (paymentStatus === 'COMPLETED') {
      // 导入数据库（生产环境替换为真实数据库）
      const { db } = await import('@/lib/database');

      // 查找支付记录
      const payment = await db.payment.findByPaypalOrderId(orderId);
      
      if (payment && payment.userId) {
        // 更新支付状态
        await db.payment.update(payment.id, {
          status: 'completed',
          paypalCaptureId: payments?.id,
        });

        // 添加积分到用户账户
        await db.user.addCredits(payment.userId, payment.credits || 0);

        console.log('✅ Payment completed and credits added:', {
          orderId,
          userId: payment.userId,
          credits: payment.credits,
          captureId: payments?.id,
        });
      }

      return NextResponse.json({
        success: true,
        status: 'COMPLETED',
        captureId: payments?.id,
        amount: payments?.amount?.value,
        currency: payments?.amount?.currency_code,
        credits: payment?.credits,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: `Payment status: ${paymentStatus}`,
      });
    }

  } catch (error: any) {
    console.error('Capture Order Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
