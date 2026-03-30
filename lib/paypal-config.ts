// PayPal 配置 - 纯订阅制（Pro 个人计划优先）
// 第一阶段：只上线 Free + Pro，快速验证收益

export const paypalConfig = {
  // 环境配置
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'AevvA8o2Kppx2FwFBom4Q6ZzPCTdxCKkeRI2ZBVgerfRZqcvDUWLKYvrLTWK_SBoabipvGH5wBa_1iGw',
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com',
  
  // 订阅计划配置 - 第一阶段只上线 Pro
  plans: {
    // Pro 计划 - 个人创作者（核心收益产品）
    proMonthly: {
      id: 'P-1AK67303R1503452TNHDOITQ',
      name: 'PRO',
      billingCycle: 'MONTHLY',
      price: 9.99,
      currency: 'USD',
      dailyLimit: 999999, // 无限使用
      features: [
        '无限次关键词分析',
        '导出 PDF/CSV',
        '30 天历史记录',
        '高级关键词密度报告',
        '邮件支持',
      ],
      isPopular: true,
    },
    proYearly: {
      id: 'P-9BF18630VW4069643NHDOITY',
      name: 'PRO',
      billingCycle: 'YEARLY',
      price: 99,
      currency: 'USD',
      dailyLimit: 999999, // 无限使用
      features: [
        '无限次关键词分析',
        '导出 PDF/CSV',
        '30 天历史记录',
        '高级关键词密度报告',
        '邮件支持',
        '节省 17%（相当于 2 个月免费）',
      ],
      isPopular: false,
    },
  },
} as const;

export type PlanKey = keyof typeof paypalConfig.plans;
export type PlanInfo = typeof paypalConfig.plans[PlanKey];

export default paypalConfig;
