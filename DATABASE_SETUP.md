# 🗄️ 数据库设置指南

**技术方案：** Vercel + Next.js + PostgreSQL + Prisma

---

## 🚀 快速开始

### 方案 1：使用 Neon（推荐）

**Neon** 是无服务器 PostgreSQL，与 Vercel 完美集成。

#### 步骤 1：创建 Neon 数据库

1. 访问 https://neon.tech
2. 点击 **"Create a project"**
3. 输入项目名称：`zuhio-keyword-count-checker`
4. 选择地区：选择离你用户最近的（推荐 `us-east-1`）
5. 点击 **"Create project"**

#### 步骤 2：获取数据库连接字符串

1. 在 Neon Dashboard 中，点击你的项目
2. 进入 **"Connection Details"**
3. 复制 **Connection string**
4. 格式应该是：
   ```
   postgresql://user:password@host.region.aws.neon.tech/dbname?sslmode=require
   ```

#### 步骤 3：配置环境变量

在项目根目录创建 `.env` 文件：

```bash
DATABASE_URL="postgresql://user:password@host.region.aws.neon.tech/dbname?pgbouncer=true"

# PayPal 配置
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your_client_id"
PAYPAL_SECRET="your_secret"
PAYPAL_API_URL="https://api-m.sandbox.paypal.com"
PAYPAL_WEBHOOK_ID="your_webhook_id"

# PayPal 计划 ID
NEXT_PUBLIC_PAYPAL_PLAN_PRO_MONTHLY="P-1AK67303R1503452TNHDOITQ"
NEXT_PUBLIC_PAYPAL_PLAN_PRO_YEARLY="P-9BF18630VW4069643NHDOITY"
NEXT_PUBLIC_PAYPAL_PLAN_BUSINESS_MONTHLY="P-56W56046144411137NHDOITY"
NEXT_PUBLIC_PAYPAL_PLAN_BUSINESS_YEARLY="P-94F994413Y785902JNHDOIUA"

# Firebase 配置（已有）
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="..."

# 应用配置
NEXT_PUBLIC_BASE_URL="https://your-domain.vercel.app"
```

#### 步骤 4：运行数据库迁移

```bash
cd /root/.openclaw/workspace/zuhio-keyword-count-checker

# 安装依赖
npm install

# 生成 Prisma Client
npx prisma generate

# 运行迁移
npx prisma migrate dev --name init
```

#### 步骤 5：推送 Schema 到生产环境

```bash
# 推送到 Neon（生产环境）
npx prisma migrate deploy
```

---

### 方案 2：使用 Supabase

**Supabase** 是另一个优秀的 PostgreSQL 选择。

#### 步骤 1：创建 Supabase 项目

1. 访问 https://supabase.com
2. 点击 **"New Project"**
3. 填写项目信息
4. 设置数据库密码
5. 选择地区（推荐 `us-east-1`）

#### 步骤 2：获取连接字符串

1. 进入项目 Dashboard
2. 点击 **"Settings"** → **"Database"**
3. 点击 **"Connection string"**
4. 选择 **"URI"** 模式
5. 复制连接字符串

#### 步骤 3：配置 PGBouncer

在连接字符串中添加 `?pgbouncer=true`：

```bash
DATABASE_URL="postgresql://postgres:password@host.supabase.co:6543/postgres?pgbouncer=true"
```

#### 步骤 4：运行迁移

```bash
npx prisma migrate deploy
```

---

## 📋 Prisma 命令参考

### 开发环境

```bash
# 生成 Prisma Client
npx prisma generate

# 创建新迁移
npx prisma migrate dev --name <migration_name>

# 重置数据库（开发环境）
npx prisma migrate reset

# 打开 Prisma Studio（数据库 GUI）
npx prisma studio
```

### 生产环境

```bash
# 生成 Prisma Client
npx prisma generate

# 应用所有待处理的迁移
npx prisma migrate deploy

# 同步 Schema（不创建迁移文件）
npx prisma db push
```

---

## 🔧 Vercel 配置

### 在 Vercel 配置环境变量

1. 访问 https://vercel.com/dashboard
2. 选择你的项目
3. 进入 **"Settings"** → **"Environment Variables"**
4. 添加以下变量：
   - `DATABASE_URL`（生产环境）
   - `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
   - `PAYPAL_SECRET`
   - 其他环境变量

### 构建配置

在 `package.json` 中：

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "db:migrate": "prisma migrate deploy",
    "db:studio": "prisma studio"
  }
}
```

---

## 🧪 测试数据库连接

### 创建测试脚本

创建 `scripts/test-db.ts`：

```typescript
import { prisma } from '../lib/prisma';

async function testConnection() {
  try {
    // 测试连接
    await prisma.$connect();
    console.log('✅ Database connection successful!');

    // 查询用户数量
    const userCount = await prisma.user.count();
    console.log(`📊 Total users: ${userCount}`);

    // 创建测试用户
    const testUser = await prisma.user.create({
      data: {
        email: `test_${Date.now()}@example.com`,
        name: 'Test User',
        credits: 100,
      },
    });
    console.log('✅ Test user created:', testUser.id);

    // 清理
    await prisma.user.delete({ where: { id: testUser.id } });
    console.log('✅ Test user deleted');

  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
```

运行测试：

```bash
npx ts-node scripts/test-db.ts
```

---

## 📊 数据库 Schema 说明

### 核心模型

1. **User** - 用户
   - 积分系统
   - 订阅状态
   - PayPal 订阅 ID

2. **Payment** - 支付记录
   - 一次性支付
   - 订阅支付
   - PayPal 订单 ID

3. **Subscription** - 订阅
   - 订阅计划
   - 计费周期
   - 订阅状态

4. **WebhookLog** - Webhook 日志
   - 事件类型
   - 原始 payload
   - 处理状态

---

## 🎯 下一步

1. **选择数据库提供商**（Neon 或 Supabase）
2. **创建数据库**
3. **配置环境变量**
4. **运行迁移**
5. **测试连接**
6. **部署到 Vercel**

---

## 📞 支持资源

- **Neon 文档:** https://neon.tech/docs
- **Supabase 文档:** https://supabase.com/docs
- **Prisma 文档:** https://prisma.io/docs
- **Vercel + Prisma:** https://vercel.com/guides/nextjs-prisma-postgres

---

**准备就绪后，运行：**
```bash
npx prisma migrate dev --name init
```
