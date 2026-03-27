// PayPal 配置
// 需要在 PayPal Developer 创建账号并获取凭证
// 1. 访问 https://developer.paypal.com
// 2. 创建 App
// 3. 获取 Client ID 和 Secret

export const paypalConfig = {
  // 测试环境（Sandbox）
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'YOUR_PAYPAL_CLIENT_ID',
  secret: process.env.PAYPAL_SECRET || 'YOUR_PAYPAL_SECRET',
  
  // API 端点
  baseUrl: process.env.NODE_ENV === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com',
  
  // 价格配置
  prices: {
    pro: {
      monthly: {
        id: 'pro_monthly',
        price: 9.99,
        currency: 'USD',
        interval: 'month',
        intervalCount: 1,
      },
      yearly: {
        id: 'pro_yearly',
        price: 99,
        currency: 'USD',
        interval: 'year',
        intervalCount: 1,
      },
    },
    business: {
      monthly: {
        id: 'business_monthly',
        price: 29.99,
        currency: 'USD',
        interval: 'month',
        intervalCount: 1,
      },
      yearly: {
        id: 'business_yearly',
        price: 299,
        currency: 'USD',
        interval: 'year',
        intervalCount: 1,
      },
    },
  },
};

// 创建 PayPal 订单
export const createPayPalOrder = async ({
  planId,
  userId,
  returnUrl,
  cancelUrl,
}: {
  planId: string;
  userId: string;
  returnUrl: string;
  cancelUrl: string;
}) => {
  try {
    const response = await fetch('/api/paypal/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId,
        userId,
        returnUrl,
        cancelUrl,
      }),
    });

    const data = await response.json();
    
    if (data.approvalUrl) {
      // 重定向用户到 PayPal 审批页面
      window.location.href = data.approvalUrl;
    }
    
    return { orderId: data.orderId, approvalUrl: data.approvalUrl, error: null };
  } catch (error: any) {
    console.error('PayPal Order Creation Error:', error);
    return { orderId: null, approvalUrl: null, error: error.message };
  }
};

// 捕获 PayPal 订单（用户批准后）
export const capturePayPalOrder = async (orderId: string) => {
  try {
    const response = await fetch('/api/paypal/capture-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });

    const data = await response.json();
    return { 
      success: data.success, 
      subscriptionId: data.subscriptionId,
      error: data.error 
    };
  } catch (error: any) {
    console.error('PayPal Order Capture Error:', error);
    return { success: false, subscriptionId: null, error: error.message };
  }
};

// 取消订阅
export const cancelSubscription = async (subscriptionId: string) => {
  try {
    const response = await fetch('/api/paypal/cancel-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriptionId }),
    });

    const data = await response.json();
    return { success: data.success, error: data.error };
  } catch (error: any) {
    console.error('PayPal Subscription Cancellation Error:', error);
    return { success: false, error: error.message };
  }
};

export default paypalConfig;
