import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 用户认证回调 API
 * Google 登录成功后调用，将用户信息写入数据库
 */
export async function POST(request: NextRequest) {
  const reqId = crypto.randomUUID();
  console.log(`[${reqId}] Auth callback - Request received`);

  try {
    const body = await request.json();
    console.log(`[${reqId}] Request body:`, body);
    
    const { uid, email, displayName, photoURL, emailVerified } = body;

    if (!email) {
      console.error(`[${reqId}] Email is required`);
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log(`[${reqId}] Processing auth for: ${email}`);

    // 检查用户是否已存在
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // 用户已存在，更新信息
      console.log(`[${reqId}] User exists, updating: ${user.id}`);
      user = await prisma.user.update({
        where: { email },
        data: {
          name: displayName || user.name,
          image: photoURL || user.image,
          emailVerified: emailVerified ? new Date() : user.emailVerified,
          updatedAt: new Date(),
        },
      });
    } else {
      // 新用户，创建记录
      console.log(`[${reqId}] Creating new user`);
      user = await prisma.user.create({
        data: {
          email,
          name: displayName,
          image: photoURL,
          emailVerified: emailVerified ? new Date() : null,
          subscriptionPlan: 'FREE',
          subscriptionStatus: 'INACTIVE',
        },
      });
    }

    console.log(`[${reqId}] User saved: ${user.id}`);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionStatus: user.subscriptionStatus,
      },
    });

  } catch (error: any) {
    console.error(`[${reqId}] Auth callback error:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * 获取用户信息
 */
export async function GET(request: NextRequest) {
  const reqId = crypto.randomUUID();
  
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        subscriptionEndDate: true,
        createdAt: true,
        todayUsage: true,
        lastUsageDate: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });

  } catch (error: any) {
    console.error(`[${reqId}] Get user error:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
