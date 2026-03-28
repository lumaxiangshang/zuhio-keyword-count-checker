// PayPal 配置 - 硬编码以避免静态导出问题
// 这些值在构建时会被打包到客户端代码中

export const paypalConfig = {
  clientId: 'AevvA8o2Kppx2FwFBom4Q6ZzPCTdxCKkeRI2ZBVgerfRZqcvDUWLKYvrLTWK_SBoabipvGH5wBa_1iGw',
  apiUrl: 'https://api-m.sandbox.paypal.com',
  plans: {
    proMonthly: 'P-1AK67303R1503452TNHDOITQ',
    proYearly: 'P-9BF18630VW4069643NHDOITY',
    businessMonthly: 'P-56W56046144411137NHDOITY',
    businessYearly: 'P-94F994413Y785902JNHDOIUA',
  },
} as const;

export default paypalConfig;
