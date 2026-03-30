import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID || '';

/**
 * 验证 Webhook 签名
 * 参考：https://developer.paypal.com/docs/api/webhooks/v1/#verify-webhook-signature-post
 */
async function verifyWebhookSignature(
  transmissionId: string,
  transmissionTime: string,
  webhookId: string,
  webhookEvent: Record<string, any>
): Promise<boolean> {
  // TODO: 实现完整的签名验证
  // 目前先返回 true，生产环境必须实现
  console.log('⚠️ Webhook signature verification skipped (implement in production)');
  return true;
}

/**
 * PayPal Webhook 处理器
 * POST /api/paypal/webhook
 */
export async function POST(request: NextRequest) {
  const reqId = crypto.randomUUID();
  
  try {
    const body = await request.json();
    const headers = request.headers;

    // 获取 Webhook 验证头
    const transmissionId = headers.get('paypal-transmission-id') || '';
    const transmissionTime = headers.get('paypal-transmission-time') || '';

    console.log(`[${reqId}] Webhook received: ${body.event_type}`);

    // 验证 Webhook 签名（生产环境必须）
    const isValid = await verifyWebhookSignature(
      transmissionId,
      transmissionTime,
      PAYPAL_WEBHOOK_ID,
      body
    );

    if (!isValid) {
      console.error(`[${reqId}] ❌ Webhook signature verification failed`);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const eventType = body.event_type;
    const resource = body.resource;

    // 处理不同类型的 Webhook 事件
    switch (eventType) {
      // ============================================
      // 订阅相关事件
      // ============================================
      
      case 'BILLING.SUBSCRIPTION.ACTIVATED': {
        console.log(`[${reqId}] ✅ Subscription activated: ${resource.id}`);
        
        const subscription = await prisma.subscription.findUnique({
          where: { paypalSubscriptionId: resource.id },
        });

        if (subscription) {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: { status: 'ACTIVE' },
          });

          await prisma.user.update({
            where: { id: subscription.userId },
            data: { subscriptionStatus: 'ACTIVE' },
          });

          await prisma.subscriptionEvent.create({
            data: {
              userId: subscription.userId,
              subscriptionId: subscription.id,
              eventType: 'SUBSCRIPTION_ACTIVATED',
              newStatus: 'ACTIVE',
              paypalSubscriptionId: resource.id,
            },
          });
        }
        break;
      }

      case 'BILLING.SUBSCRIPTION.CANCELLED': {
        console.log(`[${reqId}] ❌ Subscription cancelled: ${resource.id}`);
        
        const subscription = await prisma.subscription.findUnique({
          where: { paypalSubscriptionId: resource.id },
        });

        if (subscription) {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: { 
              status: 'CANCELLED',
            },
          });

          await prisma.user.update({
            where: { id: subscription.userId },
            data: { subscriptionStatus: 'CANCELLED' },
          });

          await prisma.subscriptionEvent.create({
            data: {
              userId: subscription.userId,
              subscriptionId: subscription.id,
              eventType: 'SUBSCRIPTION_CANCELLED',
              oldStatus: 'ACTIVE',
              newStatus: 'CANCELLED',
              paypalSubscriptionId: resource.id,
            },
          });
        }
        break;
      }

      case 'BILLING.SUBSCRIPTION.EXPIRED': {
        console.log(`[${reqId}] ⏰ Subscription expired: ${resource.id}`);
        
        const subscription = await prisma.subscription.findUnique({
          where: { paypalSubscriptionId: resource.id },
        });

        if (subscription) {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: { status: 'EXPIRED' },
          });

          await prisma.user.update({
            where: { id: subscription.userId },
            data: { subscriptionStatus: 'EXPIRED' },
          });

          await prisma.subscriptionEvent.create({
            data: {
              userId: subscription.userId,
              subscriptionId: subscription.id,
              eventType: 'SUBSCRIPTION_EXPIRED',
              oldStatus: 'ACTIVE',
              newStatus: 'EXPIRED',
              paypalSubscriptionId: resource.id,
            },
          });
        }
        break;
      }

      case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED': {
        console.log(`[${reqId}] 💸 Subscription payment failed: ${resource.id}`);
        
        const subscription = await prisma.subscription.findUnique({
          where: { paypalSubscriptionId: resource.id },
        });

        if (subscription) {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: { status: 'PAST_DUE' },
          });

          await prisma.user.update({
            where: { id: subscription.userId },
            data: { subscriptionStatus: 'PAST_DUE' },
          });

          await prisma.subscriptionEvent.create({
            data: {
              userId: subscription.userId,
              subscriptionId: subscription.id,
              eventType: 'PAYMENT_FAILED',
              oldStatus: 'ACTIVE',
              newStatus: 'PAST_DUE',
              paypalSubscriptionId: resource.id,
            },
          });
        }
        break;
      }

      case 'BILLING.SUBSCRIPTION.UPDATED': {
        console.log(`[${reqId}] 🔄 Subscription updated: ${resource.id}`);
        
        // 订阅更新（如计划变更）
        const subscription = await prisma.subscription.findUnique({
          where: { paypalSubscriptionId: resource.id },
        });

        if (subscription) {
          await prisma.subscriptionEvent.create({
            data: {
              userId: subscription.userId,
              subscriptionId: subscription.id,
              eventType: 'SUBSCRIPTION_RENEWED',
              paypalSubscriptionId: resource.id,
            },
          });
        }
        break;
      }

      // ============================================
      // 支付相关事件
      // ============================================

      case 'PAYMENT.CAPTURE.COMPLETED': {
        console.log(`[${reqId}] 💰 Payment completed: ${resource.id}`);
        
        // 查找关联的订阅
        const subscription = await prisma.subscription.findFirst({
          where: { paypalSubscriptionId: resource.billing_agreement_id || resource.id },
        });

        if (subscription) {
          await prisma.subscriptionEvent.create({
            data: {
              userId: subscription.userId,
              subscriptionId: subscription.id,
              eventType: 'PAYMENT_SUCCEEDED',
              amount: parseFloat(resource.amount?.value || '0'),
              paypalSubscriptionId: subscription.paypalSubscriptionId,
            },
          });
        }
        break;
      }

      case 'PAYMENT.CAPTURE.REFUNDED': {
        console.log(`[${reqId}] ↩️ Payment refunded: ${resource.id}`);
        
        // 处理退款逻辑
        break;
      }

      // ============================================
      // 试用相关事件
      // ============================================

      case 'BILLING.SUBSCRIPTION.TRIAL.STARTED': {
        console.log(`[${reqId}] 🎁 Trial started: ${resource.id}`);
        
        const subscription = await prisma.subscription.findUnique({
          where: { paypalSubscriptionId: resource.id },
        });

        if (subscription) {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: { status: 'TRIALING' },
          });

          await prisma.subscriptionEvent.create({
            data: {
              userId: subscription.userId,
              subscriptionId: subscription.id,
              eventType: 'TRIAL_STARTED',
              paypalSubscriptionId: resource.id,
            },
          });
        }
        break;
      }

      case 'BILLING.SUBSCRIPTION.TRIAL.CONVERTED': {
        console.log(`[${reqId}] ✨ Trial converted: ${resource.id}`);
        
        const subscription = await prisma.subscription.findUnique({
          where: { paypalSubscriptionId: resource.id },
        });

        if (subscription) {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: { status: 'ACTIVE' },
          });

          await prisma.subscriptionEvent.create({
            data: {
              userId: subscription.userId,
              subscriptionId: subscription.id,
              eventType: 'TRIAL_CONVERTED',
              newStatus: 'ACTIVE',
              paypalSubscriptionId: resource.id,
            },
          });
        }
        break;
      }

      default:
        console.log(`[${reqId}] ℹ️ Unhandled event type: ${eventType}`);
    }

    // 返回成功响应
    return NextResponse.json({ status: 'success' });

  } catch (error: any) {
    console.error(`[${reqId}] Webhook Error:`, error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
