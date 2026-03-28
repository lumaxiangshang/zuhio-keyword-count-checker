import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// PayPal Webhook 处理
// 用于接收 PayPal 的异步通知（支付完成、退款等）

const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID || '';

// 验证 Webhook 签名
async function verifyWebhookSignature(
  transmissionId: string,
  transmissionTime: string,
  webhookId: string,
  webhookEvent: Record<string, any>
): Promise<boolean> {
  // TODO: 实现 Webhook 签名验证
  // 参考：https://developer.paypal.com/docs/api/webhooks/v1/#verify-webhook-signature-post
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const headers = request.headers;

    // 获取 Webhook 验证头
    const transmissionId = headers.get('paypal-transmission-id') || '';
    const transmissionTime = headers.get('paypal-transmission-time') || '';
    const certUrl = headers.get('paypal-cert-url') || '';
    const actualSignature = headers.get('paypal-transmission-sig') || '';

    // 验证 Webhook 签名
    const isValid = await verifyWebhookSignature(
      transmissionId,
      transmissionTime,
      PAYPAL_WEBHOOK_ID,
      body
    );

    if (!isValid) {
      console.error('❌ Webhook signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const eventType = body.event_type;
    console.log('📬 Webhook received:', eventType);

    // 处理不同类型的 Webhook 事件
    switch (eventType) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        // 支付完成
        const captureData = body.resource;
        console.log('✅ Payment completed:', {
          captureId: captureData.id,
          amount: captureData.amount?.value,
          currency: captureData.amount?.currency_code,
          customId: captureData.custom_id,
        });
        
        // TODO: 更新数据库，添加用户积分
        // await db.user.update({
        //   where: { id: customId },
        //   data: { credits: { increment: calculatedCredits } }
        // });
        break;

      case 'PAYMENT.CAPTURE.REFUNDED':
        // 退款
        const refundData = body.resource;
        console.log('💰 Payment refunded:', {
          refundId: refundData.id,
          amount: refundData.amount?.value,
        });
        
        // TODO: 更新数据库，扣除用户积分
        break;

      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        // 订阅激活
        const subscriptionData = body.resource;
        console.log('🎯 Subscription activated:', {
          subscriptionId: subscriptionData.id,
          planId: subscriptionData.plan_id,
        });
        
        // TODO: 更新用户订阅状态
        break;

      case 'BILLING.SUBSCRIPTION.CANCELLED':
        // 订阅取消
        console.log('❌ Subscription cancelled:', body.resource.id);
        
        // TODO: 更新用户订阅状态为取消
        break;

      default:
        console.log('ℹ️ Unhandled event type:', eventType);
    }

    // 返回成功响应
    return NextResponse.json({ status: 'success' });

  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
