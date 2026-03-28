# 🚀 Supabase + Next.js + Prisma 完整方案

**推荐指数：** ⭐⭐⭐⭐⭐

---

## 🎯 为什么选择 Supabase？

### 完美匹配你的需求

1. **支付系统** - 需要关系型数据库 + 事务
2. **用户订阅** - 复杂关系（User ↔ Subscription）
3. **数据一致性** - ACID 事务保证
4. **扩展性** - SQL 支持复杂查询

### 技术优势

| 特性 | Supabase | Firebase |
|------|----------|----------|
| 数据库类型 | PostgreSQL（关系型） | Firestore（NoSQL） |
| 事务支持 | ✅ 完整 ACID | ⚠️ 有限支持 |
| JOIN 查询 | ✅ 支持 | ❌ 不支持 |
| Prisma 支持 | ✅ 完美 | ❌ 不支持 |
| 实时订阅 | ✅ 支持 | ✅ 支持 |
| Row Level Security | ✅ 数据库级 | ⚠️ 应用级 |
| 复杂查询 | ✅ SQL | ⚠️ 受限 |
| 数据迁移 | ✅ Prisma Migrate | ❌ 手动 |

---

## 📦 完整实现方案

### 技术栈

```
Vercel (部署)
  ↓
Next.js 14 App Router
  ↓
Prisma ORM
  ↓
Supabase PostgreSQL
```

### 核心功能

- ✅ 用户积分系统
- ✅ 一次性支付（积分包）
- ✅ 订阅支付（Pro/Business）
- ✅ Webhook 异步通知
- ✅ 支付历史记录
- ✅ 实时数据更新

---

## 🔧 Supabase 设置步骤

### 步骤 1：创建 Supabase 项目

1. 访问 https://supabase.com
2. 点击 **"New Project"**
3. 填写：
   - **Name:** `zuhio-keyword-count-checker`
   - **Database Password:** （保存好！）
   - **Region:** `us-east-1`（推荐）
4. 点击 **"Create new project"**

等待 2-3 分钟，数据库创建完成。

### 步骤 2：获取连接字符串

1. 进入项目 Dashboard
2. 点击 **"Settings"**（左侧）→ **"Database"**
3. 点击 **"Connection string"**
4. 选择 **"URI"** 标签
5. 复制连接字符串

**格式：**
```
postgresql://postgres.[project-id]:[password]@[host]:5432/postgres
```

**添加 PGBouncer（重要）：**
```
postgresql://postgres.[project-id]:[password]@[host]:6543/postgres?pgbouncer=true
```

### 步骤 3：配置环境变量

创建 `.env` 文件：

```bash
# Supabase 数据库
DATABASE_URL="postgresql://postgres.xxx:password@host:6543/postgres?pgbouncer=true"

# Supabase API（可选，用于 Auth）
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"

# PayPal 配置
NEXT_PUBLIC_PAYPAL_CLIENT_ID="AevvA8o2Kppx2FwFBom4Q6ZzPCTdxCKkeRI2ZBVgerfRZqcvDUWLKYvrLTWK_SBoabipvGH5wBa_1iGw"
PAYPAL_SECRET="ELoML4ZUrSqaR9O5nNtXjq3Oc1MgO0L60riU1Kx_Z2ixa2Iz3KEl2VqyTKpMetexKBKLzfnIVqSKDswG"
PAYPAL_API_URL="https://api-m.sandbox.paypal.com"
PAYPAL_WEBHOOK_ID="your_webhook_id"

# PayPal 计划 ID
NEXT_PUBLIC_PAYPAL_PLAN_PRO_MONTHLY="P-1AK67303R1503452TNHDOITQ"
NEXT_PUBLIC_PAYPAL_PLAN_PRO_YEARLY="P-9BF18630VW4069643NHDOITY"
NEXT_PUBLIC_PAYPAL_PLAN_BUSINESS_MONTHLY="P-56W56046144411137NHDOITY"
NEXT_PUBLIC_PAYPAL_PLAN_BUSINESS_YEARLY="P-94F994413Y785902JNHDOIUA"

# Firebase（仅用于 Auth）
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="zuhio-keyword-count-checker.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="zuhio-keyword-count-checker"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="zuhio-keyword-count-checker.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="289541466359"
NEXT_PUBLIC_FIREBASE_APP_ID="1:289541466359:web:e6105f849bd6a5df90cbf2"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-CTZEVL2EWZ"

# 应用
NEXT_PUBLIC_BASE_URL="https://zuhiokeywordcountchecker.shop"
```

### 步骤 4：运行数据库迁移

```bash
cd /root/.openclaw/workspace/zuhio-keyword-count-checker

# 安装依赖
npm install

# 生成 Prisma Client
npx prisma generate

# 运行迁移（创建所有表）
npx prisma migrate deploy --name init
```

### 步骤 5：测试连接

```bash
npm run db:test
```

**预期输出：**
```
🔍 Testing database connection...
✅ Database connection successful!
📊 Total users: 0
📊 Total payments: 0
📊 Total subscriptions: 0

✅ All database tests passed!
```

---

## 📊 数据库 Schema

### 完整 Schema（已实现）

```prisma
// 用户模型
model User {
  id                    String    @id @default(cuid())
  email                 String    @unique
  name                  String?
  image                 String?
  
  // 积分系统
  credits               Int       @default(0)
  
  // 订阅信息
  subscriptionPlan      SubscriptionPlan @default(FREE)
  subscriptionStatus    SubscriptionStatus @default(INACTIVE)
  subscriptionEndDate   DateTime?
  paypalSubscriptionId  String?   @unique
  
  // 关系
  payments              Payment[]
  subscriptions         Subscription[]
  
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  @@index([email])
  @@index([subscriptionStatus])
}

// 支付记录
model Payment {
  id                  String        @id @default(cuid())
  userId              String
  user                User          @relation(fields: [userId], references: [id])
  
  amount              Float
  currency            String        @default("USD")
  
  paypalOrderId       String?       @unique
  paypalCaptureId     String?
  
  paymentType         PaymentType
  status              PaymentStatus @default(PENDING)
  credits             Int?
  
  createdAt           DateTime      @default(now())
  updatedAt           DateTime      @updatedAt
  
  @@index([userId])
  @@index([paypalOrderId])
  @@index([status])
}

// 订阅记录
model Subscription {
  id                  String        @id @default(cuid())
  userId              String
  user                User          @relation(fields: [userId], references: [id])
  
  paypalSubscriptionId String       @unique
  planId              String
  planName            String
  billingCycle        BillingCycle
  amount              Float
  currency            String        @default("USD")
  
  status              SubscriptionStatus
  currentPeriodStart  DateTime
  currentPeriodEnd    DateTime
  cancelledAt         DateTime?
  
  createdAt           DateTime      @default(now())
  updatedAt           DateTime      @updatedAt
  
  @@index([userId])
  @@index([paypalSubscriptionId])
}
```

---

## 🔐 Row Level Security (RLS)

**可选：启用数据库级权限**

```sql
-- 启用 RLS
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能查看自己的数据
CREATE POLICY "Users can view own data"
ON "User" FOR SELECT
USING (auth.uid()::text = id);

-- 创建策略：用户只能更新自己的数据
CREATE POLICY "Users can update own data"
ON "User" FOR UPDATE
USING (auth.uid()::text = id);
```

---

## 💻 代码实现

### 1. Prisma 客户端（已实现）

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 2. 创建订单（已实现）

```typescript
// app/api/paypal/create-order/route.ts
const payment = await prisma.payment.create({
  data: {
    userId,
    amount: parseFloat(price),
    currency: 'USD',
    paypalOrderId: order.id,
    paymentType: 'ONE_TIME',
    status: 'PENDING',
    credits,
  },
});
```

### 3. 捕获支付（已实现）

```typescript
// app/api/paypal/capture-order/route.ts
const [updatedPayment, updatedUser] = await prisma.$transaction([
  prisma.payment.update({
    where: { id: payment.id },
    data: { status: 'COMPLETED' },
  }),
  prisma.user.update({
    where: { id: payment.userId },
    data: { credits: { increment: payment.credits || 0 } },
  }),
]);
```

### 4. 激活订阅（已实现）

```typescript
// app/api/paypal/activate-subscription/route.ts
const [subscription, updatedUser] = await prisma.$transaction([
  prisma.subscription.create({
    data: {
      userId,
      paypalSubscriptionId: subscriptionID,
      planId,
      planName,
      billingCycle,
      amount: parseFloat(price),
      status: 'ACTIVE',
    },
  }),
  prisma.user.update({
    where: { email },
    data: {
      subscriptionPlan: planType,
      subscriptionStatus: 'ACTIVE',
      subscriptionEndDate: currentPeriodEnd,
    },
  }),
]);
```

---

## 🧪 测试脚本

### 测试数据库连接

```bash
npm run db:test
```

### 创建测试用户

```typescript
// scripts/seed-db.ts
import { prisma } from '../lib/prisma';

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      credits: 100,
      subscriptionPlan: 'PRO',
    },
  });
  console.log('Created user:', user);
}

main();
```

---

## 📊 Supabase Dashboard

### 有用功能

1. **Table Editor** - 可视化查看和编辑数据
2. **SQL Editor** - 执行自定义 SQL 查询
3. **API Docs** - 自动生成 REST API 文档
4. **Logs** - 查看数据库日志
5. **Settings** - 管理连接字符串和密钥

---

## 🚀 部署到 Vercel

### 自动部署

代码已推送，Vercel 会自动构建和部署。

### 配置环境变量

在 Vercel Dashboard 添加：

1. `DATABASE_URL`（Supabase 连接字符串）
2. 所有 PayPal 配置
3. 所有 Firebase 配置

### 运行迁移

**Vercel 会自动执行：**
```bash
npm install
npx prisma generate
npx prisma migrate deploy
```

---

## 📈 性能优化

### 连接池配置

```bash
# 使用 PGBouncer（端口 6543）
DATABASE_URL="postgresql://...:6543/postgres?pgbouncer=true"
```

### 查询优化

```typescript
// 只选择需要的字段
const user = await prisma.user.findUnique({
  where: { id },
  select: { id, email, credits, subscriptionPlan: true },
});

// 使用索引
const payments = await prisma.payment.findMany({
  where: { userId, status: 'COMPLETED' },
});
```

---

## 🎯 总结

### 为什么选择 Supabase？

1. ✅ **PostgreSQL** - 最适合支付系统
2. ✅ **Prisma 支持** - 类型安全、自动迁移
3. ✅ **事务支持** - 保证数据一致性
4. ✅ **扩展性强** - SQL 支持复杂查询
5. ✅ **免费额度高** - 500MB 数据库 + 2GB 带宽
6. ✅ **易于使用** - 优秀的 Dashboard 和文档

### 定价

- **免费层：** 500MB 数据库，足够初期使用
- **Pro 层：** $25/月，8GB 数据库
- **团队层：** 按需定制

---

## 📞 快速链接

- **Supabase Dashboard:** https://supabase.com/dashboard
- **项目设置:** https://supabase.com/dashboard/project/_/settings/database
- **连接字符串:** https://supabase.com/dashboard/project/_/settings/database
- **文档:** https://supabase.com/docs

---

**立即开始：**
1. 创建 Supabase 项目（5 分钟）
2. 配置 DATABASE_URL
3. 运行迁移
4. 测试支付流程

**预计完成时间：** 15 分钟
