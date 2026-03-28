# 📋 完整部署检查清单

**技术方案：** Vercel + Next.js 14 + Prisma + Supabase PostgreSQL

---

## 🎯 阶段 1：数据库设置（5 分钟）

### 1.1 创建 Supabase 项目

- [ ] 访问 https://supabase.com
- [ ] 点击 **"New Project"**
- [ ] 项目名称：`zuhio-keyword-count-checker`
- [ ] 数据库密码：**（保存好！）**
- [ ] 地区：`us-east-1`（推荐）
- [ ] 点击 **"Create new project"**
- [ ] 等待 2-3 分钟

### 1.2 获取连接字符串

- [ ] 进入项目 Dashboard
- [ ] 点击 **"Settings"** → **"Database"**
- [ ] 点击 **"Connection string"**
- [ ] 选择 **"URI"** 模式
- [ ] 复制连接字符串

### 1.3 修改为 PGBouncer 模式

**原格式：**
```
postgresql://postgres.xxx:password@host:5432/postgres
```

**修改为：**
```
postgresql://postgres.xxx:password@host:6543/postgres?pgbouncer=true
```

**注意：**
- [ ] 端口改为 **6543**
- [ ] 添加 `?pgbouncer=true`

### 1.4 保存连接字符串

- [ ] 暂时保存在安全地方（密码管理器）
- [ ] 不要提交到 Git

---

## 🎯 阶段 2：环境变量配置（5 分钟）

### 2.1 本地 `.env` 文件

**创建 `.env` 文件：**

```bash
# Supabase 数据库
DATABASE_URL="postgresql://postgres.xxx:password@host:6543/postgres?pgbouncer=true"

# PayPal（沙箱）
NEXT_PUBLIC_PAYPAL_CLIENT_ID="AevvA8o2Kppx2FwFBom4Q6ZzPCTdxCKkeRI2ZBVgerfRZqcvDUWLKYvrLTWK_SBoabipvGH5wBa_1iGw"
PAYPAL_SECRET="ELoML4ZUrSqaR9O5nNtXjq3Oc1MgO0L60riU1Kx_Z2ixa2Iz3KEl2VqyTKpMetexKBKLzfnIVqSKDswG"
PAYPAL_API_URL="https://api-m.sandbox.paypal.com"
PAYPAL_WEBHOOK_ID=""

# PayPal 计划 ID
NEXT_PUBLIC_PAYPAL_PLAN_PRO_MONTHLY="P-1AK67303R1503452TNHDOITQ"
NEXT_PUBLIC_PAYPAL_PLAN_PRO_YEARLY="P-9BF18630VW4069643NHDOITY"
NEXT_PUBLIC_PAYPAL_PLAN_BUSINESS_MONTHLY="P-56W56046144411137NHDOITY"
NEXT_PUBLIC_PAYPAL_PLAN_BUSINESS_YEARLY="P-94F994413Y785902JNHDOIUA"

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyBgP_Oy5KTYfsEyNiXrtXwSAp1tztOuDyM"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="zuhio-keyword-count-checker.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="zuhio-keyword-count-checker"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="zuhio-keyword-count-checker.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="289541466359"
NEXT_PUBLIC_FIREBASE_APP_ID="1:289541466359:web:e6105f849bd6a5df90cbf2"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-CTZEVL2EWZ"

# 应用
NEXT_PUBLIC_BASE_URL="https://zuhiokeywordcountchecker.shop"
NODE_ENV="production"
```

### 2.2 Vercel 环境变量

**访问：** https://vercel.com/lumaxiangshang-6334s-projects/zuhio-keyword-count-checker/settings/environment-variables

**添加以下变量（共 18 个）：**

#### 数据库（1 个）
- [ ] `DATABASE_URL` - Supabase 连接字符串

#### PayPal（11 个）
- [ ] `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
- [ ] `PAYPAL_SECRET`
- [ ] `PAYPAL_API_URL`
- [ ] `PAYPAL_WEBHOOK_ID`（可选）
- [ ] `NEXT_PUBLIC_PAYPAL_PLAN_PRO_MONTHLY`
- [ ] `NEXT_PUBLIC_PAYPAL_PLAN_PRO_YEARLY`
- [ ] `NEXT_PUBLIC_PAYPAL_PLAN_BUSINESS_MONTHLY`
- [ ] `NEXT_PUBLIC_PAYPAL_PLAN_BUSINESS_YEARLY`

#### Firebase（7 个）
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

#### 应用（1 个）
- [ ] `NEXT_PUBLIC_BASE_URL`
- [ ] `NODE_ENV`

**设置范围：**
- [ ] Production ✓
- [ ] Preview ✓
- [ ] Development ✓

---

## 🎯 阶段 3：数据库迁移（3 分钟）

### 3.1 安装依赖

```bash
cd /root/.openclaw/workspace/zuhio-keyword-count-checker
npm install
```

- [ ] 依赖安装成功

### 3.2 生成 Prisma Client

```bash
npx prisma generate
```

- [ ] 生成成功

### 3.3 运行数据库迁移

```bash
npx prisma migrate deploy --name init
```

- [ ] 迁移成功
- [ ] 所有表创建成功

### 3.4 测试数据库连接

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

- [ ] 测试通过

---

## 🎯 阶段 4：部署到 Vercel（2 分钟）

### 4.1 确认代码已推送

```bash
git status
```

- [ ] 所有更改已提交
- [ ] 已推送到 GitHub

### 4.2 查看 Vercel 部署

**访问：** https://vercel.com/lumaxiangshang-6334s-projects/zuhio-keyword-count-checker

- [ ] 部署状态：**Ready**
- [ ] 构建成功
- [ ] 无错误

### 4.3 查看部署日志

- [ ] 检查构建日志
- [ ] 确认 `prisma migrate deploy` 执行成功
- [ ] 无警告信息

---

## 🎯 阶段 5：功能测试（5 分钟）

### 5.1 访问网站

**URL：** https://zuhiokeywordcountchecker.shop

- [ ] 首页正常加载
- [ ] 无 404 错误
- [ ] 样式正常显示

### 5.2 测试定价页面

**URL：** `https://zuhiokeywordcountchecker.shop/pricing`

- [ ] 页面正常加载
- [ ] Pro 套餐显示 PayPal 按钮
- [ ] Business 套餐显示 PayPal 按钮
- [ ] 月/年切换正常

### 5.3 测试积分购买页面

**URL：** `https://zuhiokeywordcountchecker.shop/credits`

- [ ] 页面正常加载
- [ ] 4 个积分包显示
- [ ] PayPal 按钮显示

### 5.4 测试 PayPal 支付

**测试流程：**

1. 点击 PayPal 按钮
   - [ ] PayPal 弹窗出现

2. 使用沙盒账号登录
   - [ ] 登录成功

3. 完成支付
   - [ ] 支付成功
   - [ ] 跳转到 `/payment/success`

4. 检查数据库
   ```bash
   npm run db:studio
   ```
   - [ ] Payment 表有新记录
   - [ ] User 表积分已增加

### 5.5 检查 API 端点

**测试配置端点：**
```bash
curl https://zuhiokeywordcountchecker.shop/api/paypal/config
```

- [ ] 返回 JSON
- [ ] Client ID 正确
- [ ] Plan IDs 正确

---

## 🎯 阶段 6：Webhook 配置（5 分钟）

### 6.1 获取 Webhook ID

**访问：** https://developer.paypal.com/dashboard/applications

- [ ] 选择你的 App
- [ ] 复制 Webhook ID

### 6.2 配置 Webhook URL

**在 PayPal Dashboard：**

- [ ] 点击 **"Add webhook"**
- [ ] URL: `https://zuhiokeywordcountchecker.shop/api/paypal/webhook`
- [ ] 选择事件：
  - [ ] `PAYMENT.CAPTURE.COMPLETED`
  - [ ] `PAYMENT.CAPTURE.REFUNDED`
  - [ ] `BILLING.SUBSCRIPTION.ACTIVATED`
  - [ ] `BILLING.SUBSCRIPTION.CANCELLED`
- [ ] 保存

### 6.3 更新环境变量

**在 Vercel 添加：**

- [ ] `PAYPAL_WEBHOOK_ID` - Webhook ID

**重新部署：**

- [ ] 点击 **"Redeploy"**

---

## 🎯 阶段 7：生产环境准备（可选）

### 7.1 切换到 PayPal Live

- [ ] 创建 PayPal Live App
- [ ] 获取 Live Client ID 和 Secret
- [ ] 创建 Live 订阅计划
- [ ] 更新环境变量

### 7.2 配置自定义域名

**在 Vercel：**

- [ ] 进入项目 Settings → Domains
- [ ] 添加域名：`zuhiokeywordcountchecker.shop`
- [ ] 配置 DNS（按照 Vercel 提示）
- [ ] 等待 DNS 传播

### 7.3 配置 Firebase OAuth

**在 Firebase Console：**

- [ ] 添加授权域名：`zuhiokeywordcountchecker.shop`
- [ ] 启用 Google 登录

---

## ✅ 最终检查

### 功能完整性

- [ ] 用户可以购买积分
- [ ] 积分正确添加到账户
- [ ] 订阅支付正常工作
- [ ] 订阅状态正确更新
- [ ] Webhook 正常接收通知
- [ ] 支付历史记录完整

### 安全性

- [ ] 环境变量未泄露
- [ ] `.env` 已添加到 `.gitignore`
- [ ] 数据库连接使用 SSL
- [ ] Webhook 签名验证启用

### 性能

- [ ] 页面加载时间 < 3 秒
- [ ] API 响应时间 < 500ms
- [ ] 数据库查询有索引
- [ ] CDN 缓存启用

### 监控

- [ ] Vercel Analytics 启用
- [ ] 错误日志监控
- [ ] 数据库性能监控
- [ ] 支付失败告警

---

## 📊 时间估算

| 阶段 | 预计时间 | 实际时间 |
|------|---------|---------|
| 1. 数据库设置 | 5 分钟 | ___ |
| 2. 环境变量配置 | 5 分钟 | ___ |
| 3. 数据库迁移 | 3 分钟 | ___ |
| 4. Vercel 部署 | 2 分钟 | ___ |
| 5. 功能测试 | 5 分钟 | ___ |
| 6. Webhook 配置 | 5 分钟 | ___ |
| **总计** | **25 分钟** | ___ |

---

## 🎯 常见问题

### Q1: 数据库连接失败？

**解决：**
1. 检查 `DATABASE_URL` 是否正确
2. 确认使用 PGBouncer（端口 6543）
3. 检查防火墙设置
4. 运行 `npm run db:test` 查看详细错误

### Q2: Prisma 迁移失败？

**解决：**
1. 运行 `npx prisma generate` 重新生成
2. 检查数据库连接
3. 查看迁移日志
4. 使用 `npx prisma migrate resolve` 解决冲突

### Q3: PayPal 按钮不显示？

**解决：**
1. 检查浏览器 Console 错误
2. 确认环境变量已配置
3. 检查 Client ID 是否正确
4. 清除浏览器缓存

### Q4: Vercel 部署失败？

**解决：**
1. 查看部署日志
2. 检查 `package.json` 脚本
3. 确认环境变量已配置
4. 重新触发部署

---

## 📞 支持资源

- **完整文档：** `README.md`
- **Supabase 设置：** `SUPABASE_SETUP.md`
- **技术栈说明：** `TECH_STACK_MIGRATION.md`
- **支付功能：** `COMPLETE_PAYMENT_FEATURES.md`

---

## 🎉 部署完成！

**恭喜！你的应用已成功部署！**

**下一步：**
1. 监控支付流程
2. 收集用户反馈
3. 优化性能
4. 准备上线运营

---

**最后更新：** 2026-03-28 21:05  
**状态：** ✅ 准备部署
