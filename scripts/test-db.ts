import { prisma } from '../lib/prisma';

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // 测试连接
    await prisma.$connect();
    console.log('✅ Database connection successful!');

    // 查询用户数量
    const userCount = await prisma.user.count();
    console.log(`📊 Total users: ${userCount}`);

    // 查询支付记录
    const paymentCount = await prisma.payment.count();
    console.log(`📊 Total payments: ${paymentCount}`);

    // 查询订阅记录
    const subscriptionCount = await prisma.subscription.count();
    console.log(`📊 Total subscriptions: ${subscriptionCount}`);

    console.log('\n✅ All database tests passed!');

  } catch (error: any) {
    console.error('\n❌ Database connection failed:');
    console.error(error.message);
    console.error('\nPlease check your DATABASE_URL environment variable.');
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
