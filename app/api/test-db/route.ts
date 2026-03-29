import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * 数据库连接测试 API
 * 访问：https://zuhiokeywordcountchecker.shop/api/test-db
 */
export async function GET() {
  const reqId = crypto.randomUUID();
  console.log(`[${reqId}] Database connection test started`);

  try {
    // 测试数据库连接
    await prisma.$connect();
    console.log(`[${reqId}] Database connected successfully`);

    // 简单查询测试
    const userCount = await prisma.user.count();
    console.log(`[${reqId}] User count: ${userCount}`);

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
      stats: {
        userCount,
      },
    });
  } catch (error: any) {
    console.error(`[${reqId}] Database connection failed:`, error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.toString(),
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
