// PayPal SDK - 纯订阅制
import paypalConfig, { type PlanKey } from './paypal-config';

/**
 * 初始化 PayPal SDK
 */
export const initializePayPal = () => {
  if (typeof window === 'undefined') return null;
  
  // PayPal SDK 会通过 script 标签加载
  // @ts-ignore - PayPal 全局对象
  return window.paypal;
};

/**
 * 创建订阅按钮配置
 */
export const createSubscriptionConfig = (planKey: PlanKey, onSuccess?: (subscriptionId: string) => void) => {
  const plan = paypalConfig.plans[planKey];
  
  return {
    style: {
      label: 'subscribe',
      color: 'gold',
      layout: 'vertical',
      shape: 'rect',
    },
    createSubscription: (data: any, actions: any) => {
      return actions.subscription.create({
        plan_id: plan.id,
      });
    },
    onApprove: (data: any, actions: any) => {
      // 订阅批准后的回调
      const subscriptionId = data.subscriptionID;
      console.log('✅ Subscription approved:', subscriptionId);
      
      // 调用后端 API 激活订阅
      return fetch('/api/subscription/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId,
          planKey,
        }),
      })
        .then(res => res.json())
        .then(result => {
          if (result.success && onSuccess) {
            onSuccess(subscriptionId);
          }
          return result;
        })
        .catch(error => {
          console.error('❌ Subscription activation error:', error);
          throw error;
        });
    },
    onError: (err: any) => {
      console.error('❌ PayPal Subscription Error:', err);
    },
  };
};

/**
 * 获取订阅状态
 */
export const getSubscriptionStatus = async (subscriptionId: string) => {
  try {
    const response = await fetch('/api/subscription/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriptionId }),
    });
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Get subscription status error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 取消订阅
 */
export const cancelSubscription = async (subscriptionId: string, reason?: string) => {
  try {
    const response = await fetch('/api/subscription/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriptionId, reason }),
    });
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Cancel subscription error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 获取用户当前订阅
 */
export const getUserSubscription = async () => {
  try {
    const response = await fetch('/api/subscription/me');
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Get user subscription error:', error);
    return { success: false, error: error.message };
  }
};

export default paypalConfig;
