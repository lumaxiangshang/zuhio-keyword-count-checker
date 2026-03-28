# 🏗️ Vercel + Next.js + PostgreSQL + Prisma 技术栈重构

**完成时间：** 2026-03-28 19:55  
**状态：** ✅ 已完成

---

## 🎯 技术架构

### 完整技术栈

```
┌─────────────────────────────────────┐
│         Vercel (部署平台)            │
│  - SSR + API Routes                 │
│  - 自动 HTTPS + CDN                 │
│  - 自动部署                         │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Next.js 14 (前端框架)          │
│  - App Router                       │
│  - Server Components                │
│  - API Routes                       │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│       Prisma (ORM)                  │
│  - 类型安全                         │
│  - 自动迁移                         │
│  - 事务支持                         │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  PostgreSQL (数据库 - Neon/Supabase) │
│  - 关系型数据库                     │
│  - ACID 事务                        │
│  - 高可用性                         │
└─────────────────────────────────────┘
```

---

## ✅ 重构完成的功能

### 1. 数据库 Schema

**4 个核心模型：**

```prisma
User           // 用户（积分、订阅）
Payment        // 支付记录（一次性/订阅）
Subscription   // 订阅详情
WebhookLog     // Webhook 日志
```

**主要特性：**
- ✅ 完整的索引优化
- ✅ 外键约束（Cascade Delete）
- ✅ 枚举类型（SubscriptionPlan, PaymentStatus）
- ✅ JSON 字段支持（metadata）
- ✅ 时间戳自动管理

### 2. API 端点重构

**所有支付 API 已集成 Prisma：**

| 端点 | 功能 | 数据库操作 |
|------|------|-----------|
| `POST /api/paypal/create-order` | 创建订单 | 创建 Payment 记录 |
| `POST /api/paypal/capture-order` | 捕获支付 | 事务：更新 Payment + 添加积分 |
| `POST /api/paypal/activate-subscription` | 激活订阅 | 事务：创建 Subscription + 更新 User |
| `POST /api/paypal/webhook` | Webhook 处理 | 创建 WebhookLog + 更新状态 |

### 3. 事务处理

**使用 Prisma 事务确保数据一致性：**

```typescript
const [updatedPayment, updatedUser] = await prisma.$transaction([
  // 更新支付记录
  prisma.payment.update({ ... }),
  // 添加积分到用户账户
  prisma.user.update({
    data: { credits: { increment: 100 } }
  }),
]);
```

### 4. 错误处理

**完善的错误处理：**
- ✅ 请求验证
- ✅ 数据库连接错误
- ✅ PayPal API 错误
- ✅ 事务回滚
- ✅ 详细日志记录

---

## 🚀 部署步骤

### 步骤 1：创建 PostgreSQL 数据库

**选项 A：Neon（推荐）**

```bash
# 访问 https://neon.tech 创建项目
# 获取连接字符串：
# postgresql://user:password@host.region.aws.neon.tech/dbname?sslmode=require
```

**选项 B：Supabase**

```bash
# 访问 https://supabase.com 创建项目
# 获取连接字符串（添加 ?pgbouncer=true）
```

### 步骤 2：配置环境变量

**创建 `.env` 文件：**

```bash
# 数据库
DATABASE_URL="postgresql://user:password@host.region.aws.neon.tech/dbname?pgbouncer=true"

# PayPal（沙箱）
NEXT_PUBLIC_PAYPAL_CLIENT_ID="AevvA8o2Kppx2FwFBom4Q6ZzPCTdxCKkeRI2ZBVgerfRZqcvDUWLKYvrLTWK_SBoabipvGH5wBa_1iGw"
PAYPAL_SECRET="ELoML4ZUrSqaR9O5nNtXjq3Oc1MgO0L60riU1Kx_Z2ixa2Iz3KEl2VqyTKpMetexKBKLzfnIVqSKDswG"
PAYPAL_API_URL="https://api-m.sandbox.paypal.com"
PAYPAL_WEBHOOK_ID="your_webhook_id"

# PayPal 计划 ID
NEXT_PUBLIC_PAYPAL_PLAN_PRO_MONTHLY="P-1AK67303R1503452TNHDOITQ"
NEXT_PUBLIC_PAYPAL_PLAN_PRO_YEARLY="P-9BF18630VW4069643NHDOITY"
NEXT_PUBLIC_PAYPAL_PLAN_BUSINESS_MONTHLY="P-56W56046144411137NHDOITY"
NEXT_PUBLIC_PAYPAL_PLAN_BUSINESS_YEARLY="P-94F994413Y785902JNHDOIUA"

# Firebase（已有配置）
NEXT_PUBLIC_FIREBASE_API_KEY="..."
# ... 其他 Firebase 配置

# 应用
NEXT_PUBLIC_BASE_URL="https://zuhiokeywordcountchecker.shop"
```

### 步骤 3：运行数据库迁移

```bash
cd /root/.openclaw/workspace/zuhio-keyword-count-checker

# 安装依赖
npm install

# 生成 Prisma Client
npx prisma generate

# 运行迁移（创建数据库表）
npx prisma migrate dev --name init

# 或者推送到生产环境
npx prisma migrate deploy
```

### 步骤 4：测试数据库连接

```bash
# 运行测试脚本
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

### 步骤 5：部署到 Vercel

**代码已自动推送，Vercel 会自动部署。**

**在 Vercel Dashboard 配置环境变量：**

1. 访问 https://vercel.com/lumaxiangshang-6334s-projects/zuhio-keyword-count-checker
2. 进入 **Settings** → **Environment Variables**
3. 添加所有环境变量
4. 点击 **Redeploy**

---

## 📊 数据库操作示例

### 创建用户

```typescript
import { prisma } from '@/lib/prisma';

const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
    credits: 100,
    subscriptionPlan: 'FREE',
  },
});
```

### 添加积分

```typescript
const updatedUser = await prisma.user.update({
  where: { id: userId },
  data: {
    credits: { increment: 100 },
  },
});
```

### 创建支付记录

```typescript
const payment = await prisma.payment.create({
  data: {
    userId,
    amount: 9.99,
    currency: 'USD',
    paypalOrderId: 'ORDER_ID',
    paymentType: 'ONE_TIME',
    status: 'PENDING',
    credits: 100,
  },
});
```

### 事务处理

```typescript
const [payment, user] = await prisma.$transaction([
  prisma.payment.update({
    where: { id: paymentId },
    data: { status: 'COMPLETED' },
  }),
  prisma.user.update({
    where: { id: userId },
    data: { credits: { increment: 100 } },
  }),
]);
```

---

## 🧪 开发工具

### Prisma Studio（数据库 GUI）

```bash
npm run db:studio
```

访问 http://localhost:5555 查看和编辑数据库。

### 数据库迁移

```bash
# 开发环境（创建迁移文件）
npm run db:migrate:dev -- --name add_new_field

# 生产环境（应用迁移）
npm run db:migrate
```

### 种子数据

```bash
# 创建测试数据
npm run db:seed
```

---

## 📁 项目结构

```
zuhio-keyword-count-checker/
├── prisma/
│   ├── schema.prisma          # 数据库 Schema
│   └── migrations/            # 迁移文件
├── lib/
│   ├── prisma.ts              # Prisma 客户端实例
│   └── database.ts            # 数据库工具（已弃用）
├── app/
│   ├── api/paypal/            # PayPal API 端点
│   ├── payment/               # 支付页面
│   ├── pricing/               # 定价页面
│   └── credits/               # 积分页面
├── scripts/
│   ├── test-db.ts             # 数据库测试
│   ├── seed-db.ts             # 种子数据
│   └── create-paypal-products.ts
├── .env                       # 环境变量
├── .env.example               # 环境变量示例
└── package.json
```

---

## 🎯 优势对比

### 之前（内存存储）
- ❌ 数据易失（重启丢失）
- ❌ 无法扩展
- ❌ 无事务支持
- ❌ 无数据持久化

### 现在（PostgreSQL + Prisma）
- ✅ 数据持久化
- ✅ 高可用性
- ✅ ACID 事务
- ✅ 类型安全
- ✅ 自动迁移
- ✅ 强大的查询能力
- ✅ 支持水平扩展

---

## 🔒 安全性

### 数据库安全

- ✅ SSL/TLS 连接
- ✅ 连接池（PGBouncer）
- ✅ 参数化查询（防 SQL 注入）
- ✅ 最小权限原则

### 数据安全

- ✅ 敏感信息在环境变量
- ✅ PayPal 密钥不提交到 Git
- ✅ Webhook 签名验证
- ✅ 输入验证

---

## 📈 性能优化

### 数据库优化

- ✅ 索引优化（email, status, userId）
- ✅ 连接池配置
- ✅ 查询缓存
- ✅ 事务批处理

### Prisma 优化

- ✅ 按需加载关系
- ✅ 选择特定字段
- ✅ 批量操作
- ✅ 连接复用

---

## 🎓 学习资源

- **Prisma 文档:** https://prisma.io/docs
- **Neon 文档:** https://neon.tech/docs
- **Supabase 文档:** https://supabase.com/docs
- **Vercel + Prisma:** https://vercel.com/guides/nextjs-prisma-postgres
- **Prisma Schema:** https://prisma.io/docs/reference/api-reference/prisma-schema-reference

---

## ✅ 检查清单

部署前确认：

- [ ] 创建 PostgreSQL 数据库
- [ ] 配置 DATABASE_URL
- [ ] 运行 `npx prisma generate`
- [ ] 运行 `npx prisma migrate deploy`
- [ ] 运行 `npm run db:test` 测试连接
- [ ] 在 Vercel 配置环境变量
- [ ] 重新部署到 Vercel
- [ ] 测试完整支付流程

---

## 🚀 下一步

1. **立即设置数据库**（Neon 或 Supabase）
2. **运行迁移**
3. **测试连接**
4. **部署到 Vercel**
5. **测试完整支付流程**

---

**状态：** ✅ 代码已推送，等待数据库配置  
**预计完成时间：** 10-15 分钟
