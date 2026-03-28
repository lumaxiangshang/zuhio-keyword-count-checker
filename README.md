# Zuhio Keyword Count Checker - 完整技术方案

**技术栈：** Vercel + Next.js 14 + Prisma + Supabase PostgreSQL

---

## 🎯 技术架构

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
│  Supabase PostgreSQL (数据库)       │
│  - 关系型数据库                     │
│  - ACID 事务                        │
│  - Row Level Security               │
└─────────────────────────────────────┘
```

---

## 🚀 快速开始

### 1. 环境配置

**创建 `.env` 文件：**

```bash
# Supabase 数据库连接
DATABASE_URL="postgresql://postgres.xxx:password@host:6543/postgres?pgbouncer=true"

# PayPal 配置（沙箱）
NEXT_PUBLIC_PAYPAL_CLIENT_ID="AevvA8o2Kppx2FwFBom4Q6ZzPCTdxCKkeRI2ZBVgerfRZqcvDUWLKYvrLTWK_SBoabipvGH5wBa_1iGw"
PAYPAL_SECRET="ELoML4ZUrSqaR9O5nNtXjq3Oc1MgO0L60riU1Kx_Z2ixa2Iz3KEl2VqyTKpMetexKBKLzfnIVqSKDswG"
PAYPAL_API_URL="https://api-m.sandbox.paypal.com"
PAYPAL_WEBHOOK_ID="your_webhook_id"

# PayPal 订阅计划 ID
NEXT_PUBLIC_PAYPAL_PLAN_PRO_MONTHLY="P-1AK67303R1503452TNHDOITQ"
NEXT_PUBLIC_PAYPAL_PLAN_PRO_YEARLY="P-9BF18630VW4069643NHDOITY"
NEXT_PUBLIC_PAYPAL_PLAN_BUSINESS_MONTHLY="P-56W56046144411137NHDOITY"
NEXT_PUBLIC_PAYPAL_PLAN_BUSINESS_YEARLY="P-94F994413Y785902JNHDOIUA"

# Firebase 配置（用于 Auth）
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyBgP_Oy5KTYfsEyNiXrtXwSAp1tztOuDyM"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="zuhio-keyword-count-checker.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="zuhio-keyword-count-checker"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="zuhio-keyword-count-checker.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="289541466359"
NEXT_PUBLIC_FIREBASE_APP_ID="1:289541466359:web:e6105f849bd6a5df90cbf2"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-CTZEVL2EWZ"

# 应用配置
NEXT_PUBLIC_BASE_URL="https://zuhiokeywordcountchecker.shop"
NODE_ENV="production"
```

### 2. 安装依赖

```bash
npm install
```

### 3. 设置数据库

```bash
# 生成 Prisma Client
npx prisma generate

# 运行数据库迁移
npx prisma migrate deploy --name init
```

### 4. 测试数据库连接

```bash
npm run db:test
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

---

## 📁 项目结构

```
zuhio-keyword-count-checker/
├── prisma/
│   └── schema.prisma          # 数据库 Schema
├── lib/
│   ├── prisma.ts              # Prisma 客户端
│   ├── firebase.ts            # Firebase Auth
│   └── paypal-config.ts       # PayPal 配置
├── app/
│   ├── api/
│   │   └── paypal/
│   │       ├── config/        # 配置端点
│   │       ├── create-order/  # 创建订单
│   │       ├── capture-order/ # 捕获支付
│   │       ├── activate-subscription/ # 激活订阅
│   │       └── webhook/       # Webhook 处理
│   ├── payment/
│   │   ├── success/           # 支付成功
│   │   └── cancelled/         # 支付取消
│   ├── pricing/               # 定价页面
│   ├── credits/               # 积分购买
│   └── dashboard/             # 用户仪表板
├── components/
│   ├── PayPalCheckout.tsx     # 订阅支付组件
│   └── PayPalOneTimePayment.tsx # 一次性支付组件
├── scripts/
│   ├── test-db.ts             # 数据库测试
│   └── seed-db.ts             # 种子数据
├── .env                       # 环境变量
├── .env.example               # 环境变量示例
├── package.json
└── README.md
```

---

## 🗄️ 数据库 Schema

### 核心模型

**User（用户）**
- 积分系统
- 订阅状态
- PayPal 订阅 ID

**Payment（支付）**
- 一次性支付
- 订阅支付
- PayPal 订单 ID

**Subscription（订阅）**
- 订阅计划（Pro/Business）
- 计费周期（月/年）
- 订阅状态

**WebhookLog（Webhook 日志）**
- 事件类型
- 原始 payload
- 处理状态

---

## 💰 支付功能

### 一次性支付（积分包）

**流程：**
1. 用户选择积分包
2. 调用 `/api/paypal/create-order`
3. 跳转到 PayPal 支付
4. 支付成功后回调 `/payment/success`
5. 调用 `/api/paypal/capture-order`
6. **事务处理：** 更新支付记录 + 添加积分

**API 端点：**
- `POST /api/paypal/create-order`
- `POST /api/paypal/capture-order`

### 订阅支付（Pro/Business）

**流程：**
1. 用户选择套餐（Pro/Business × 月/年）
2. 调用 PayPal 创建订阅
3. 用户授权订阅
4. 调用 `/api/paypal/activate-subscription`
5. **事务处理：** 创建订阅记录 + 更新用户状态

**API 端点：**
- `POST /api/paypal/activate-subscription`

### Webhook 异步通知

**支持事件：**
- `PAYMENT.CAPTURE.COMPLETED` - 支付完成
- `PAYMENT.CAPTURE.REFUNDED` - 退款
- `BILLING.SUBSCRIPTION.ACTIVATED` - 订阅激活
- `BILLING.SUBSCRIPTION.CANCELLED` - 订阅取消

**API 端点：**
- `POST /api/paypal/webhook`

---

## 🚀 部署到 Vercel

### 自动部署

代码已推送到 GitHub，Vercel 会自动部署。

### 配置环境变量

在 Vercel Dashboard 添加所有环境变量（见上方）。

### 数据库迁移

**Vercel 会自动执行：**
```bash
npm install
npx prisma generate
npx prisma migrate deploy
```

### 查看部署状态

https://vercel.com/lumaxiangshang-6334s-projects/zuhio-keyword-count-checker

---

## 🧪 开发命令

```bash
# 开发服务器
npm run dev

# 构建
npm run build

# 启动生产服务器
npm run start

# 代码检查
npm run lint

# 数据库命令
npm run db:migrate      # 生产环境迁移
npm run db:migrate:dev  # 开发环境迁移
npm run db:studio       # 打开数据库 GUI
npm run db:test         # 测试数据库连接
npm run db:seed         # 种子数据

# PayPal 命令
npm run paypal:create-products  # 创建订阅计划
npm run paypal:test-api         # 测试 PayPal API
```

---

## 🔧 Supabase 设置

### 步骤 1：创建项目

1. 访问 https://supabase.com
2. 点击 **"New Project"**
3. 填写项目信息
4. 选择地区（推荐 `us-east-1`）
5. 等待 2-3 分钟

### 步骤 2：获取连接字符串

1. **Settings** → **Database**
2. 点击 **"Connection string"**
3. 选择 **"URI"** 模式
4. 复制连接字符串

**修改为 PGBouncer 模式：**
```
postgresql://postgres.xxx:password@host:6543/postgres?pgbouncer=true
```
（端口改为 **6543**，添加 `?pgbouncer=true`）

### 步骤 3：运行迁移

```bash
npx prisma migrate deploy
```

---

## 📊 技术优势

### 为什么选择这个技术栈？

1. **Vercel**
   - ✅ 零配置部署
   - ✅ 自动 HTTPS + CDN
   - ✅ 自动扩展
   - ✅ 与 Next.js 完美集成

2. **Next.js 14**
   - ✅ App Router（最新架构）
   - ✅ Server Components（性能优化）
   - ✅ API Routes（后端 API）
   - ✅ 类型安全（TypeScript）

3. **Prisma**
   - ✅ 类型安全（自动生成类型）
   - ✅ 自动迁移
   - ✅ 事务支持
   - ✅ 强大的查询能力

4. **Supabase PostgreSQL**
   - ✅ 关系型数据库
   - ✅ ACID 事务
   - ✅ Row Level Security
   - ✅ 实时订阅
   - ✅ 免费额度高（500MB）

---

## 🎯 核心功能

### ✅ 已完成

- [x] 用户积分系统
- [x] 一次性支付（4 个积分包）
- [x] 订阅支付（Pro/Business × 月/年）
- [x] 支付成功/取消页面
- [x] Webhook 异步通知
- [x] 数据库事务处理
- [x] 支付历史记录
- [x] 订阅状态管理
- [x] 数据库迁移系统
- [x] 完整的错误处理

### 📋 待完成

- [ ] 用户仪表板（显示积分和订阅）
- [ ] 支付历史页面
- [ ] 邮件通知
- [ ] 退款功能
- [ ] 管理员后台
- [ ] 数据统计报表

---

## 📞 支持资源

- **Supabase 文档:** https://supabase.com/docs
- **Prisma 文档:** https://prisma.io/docs
- **Next.js 文档:** https://nextjs.org/docs
- **Vercel 文档:** https://vercel.com/docs
- **PayPal 文档:** https://developer.paypal.com/docs

---

## 🎓 学习路径

### 新手指南

1. **阅读 `SUPABASE_SETUP.md`** - Supabase 设置指南
2. **阅读 `TECH_STACK_MIGRATION.md`** - 技术栈说明
3. **运行 `npm run db:test`** - 测试数据库
4. **启动开发服务器** - `npm run dev`
5. **测试支付流程** - 访问 `/credits` 和 `/pricing`

### 进阶开发

1. **学习 Prisma Schema** - `prisma/schema.prisma`
2. **学习事务处理** - `app/api/paypal/capture-order/route.ts`
3. **学习 Webhook** - `app/api/paypal/webhook/route.ts`
4. **自定义功能** - 参考完整文档

---

## 🔒 安全性

- ✅ 环境变量（敏感信息）
- ✅ SSL/TLS 数据库连接
- ✅ 参数化查询（防 SQL 注入）
- ✅ Webhook 签名验证
- ✅ Row Level Security（可选）
- ✅ 输入验证

---

## 📈 性能优化

- ✅ 数据库索引优化
- ✅ 连接池（PGBouncer）
- ✅ Prisma 查询优化
- ✅ Vercel CDN 缓存
- ✅ Next.js SSR/SSG
- ✅ 按需加载组件

---

## 💰 成本估算

### 免费层（初期）

- **Vercel:** 免费（个人项目）
- **Supabase:** 免费（500MB 数据库）
- **PayPal:** 按交易收费（2.9% + $0.30）

**总计：** $0/月 + PayPal 交易费

### 生产环境

- **Vercel Pro:** $20/月（团队）
- **Supabase Pro:** $25/月（8GB 数据库）
- **PayPal:** 按交易收费

**总计：** $45/月 + PayPal 交易费

---

## ✅ 部署检查清单

部署前确认：

- [ ] 创建 Supabase 项目
- [ ] 获取 DATABASE_URL
- [ ] 配置所有环境变量
- [ ] 运行 `npx prisma generate`
- [ ] 运行 `npx prisma migrate deploy`
- [ ] 运行 `npm run db:test`
- [ ] 推送到 GitHub
- [ ] Vercel 自动部署
- [ ] 测试完整支付流程
- [ ] 配置 PayPal Webhook URL

---

## 🎉 总结

**完整技术方案：**
- Vercel（部署）+ Next.js 14（前端）+ Prisma（ORM）+ Supabase（数据库）

**核心功能：**
- 完整的支付系统（一次性 + 订阅）
- 数据库事务保证数据一致性
- 自动部署和迁移
- 类型安全和错误处理

**下一步：**
1. 创建 Supabase 项目
2. 配置环境变量
3. 运行数据库迁移
4. 测试支付流程
5. 上线运营

---

**状态：** ✅ 代码已就绪  
**预计部署时间：** 15 分钟  
**文档：** 完整（见各 `.md` 文件）
