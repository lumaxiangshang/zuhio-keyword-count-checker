// Stripe 配置
// 需要在 Stripe 控制台创建账号并获取密钥
// 1. 访问 https://dashboard.stripe.com
// 2. 创建账号
// 3. 获取 API Keys

export const stripeConfig = {
  // 测试环境密钥（开发时使用）
  publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || 'pk_test_xxx',
  secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_xxx',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_xxx',
  
  // 价格 ID（需要在 Stripe 创建产品）
  prices: {
    pro: {
      monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_pro_monthly',
      yearly: process.env.STRIPE_PRICE_PRO_YEARLY || 'price_pro_yearly',
    },
    business: {
      monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY || 'price_biz_monthly',
      yearly: process.env.STRIPE_PRICE_BUSINESS_YEARLY || 'price_biz_yearly',
    },
  },
};

// 创建 Checkout Session
export const createCheckoutSession = async ({
  priceId,
  userId,
  successUrl,
  cancelUrl,
}: {
  priceId: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}) => {
  try {
    // 这里需要后端 API 支持
    // 实际项目中需要调用 /api/stripe/checkout
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId,
        userId,
        successUrl,
        cancelUrl,
      }),
    });

    const data = await response.json();
    return { sessionId: data.sessionId, error: null };
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return { sessionId: null, error: error.message };
  }
};

// 创建 Customer Portal（管理订阅）
export const createPortalSession = async (userId: string, returnUrl: string) => {
  try {
    const response = await fetch('/api/stripe/portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, returnUrl }),
    });

    const data = await response.json();
    return { url: data.url, error: null };
  } catch (error: any) {
    console.error('Stripe Portal Error:', error);
    return { url: null, error: error.message };
  }
};

export default stripeConfig;
