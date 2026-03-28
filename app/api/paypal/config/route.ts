import { NextResponse } from 'next/server';

// 提供 PayPal 配置给前端
export async function GET() {
  return NextResponse.json({
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    plans: {
      proMonthly: process.env.NEXT_PUBLIC_PAYPAL_PLAN_PRO_MONTHLY,
      proYearly: process.env.NEXT_PUBLIC_PAYPAL_PLAN_PRO_YEARLY,
      businessMonthly: process.env.NEXT_PUBLIC_PAYPAL_PLAN_BUSINESS_MONTHLY,
      businessYearly: process.env.NEXT_PUBLIC_PAYPAL_PLAN_BUSINESS_YEARLY,
    },
    apiUrl: process.env.PAYPAL_API_URL,
  });
}
