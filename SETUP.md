# 🚀 Zuhio - 完整配置指南

## 📋 环境变量说明

### 本地开发 (.env.local)

```bash
# Supabase 数据库（已在 .env 中配置）
DATABASE_URL="postgresql://postgres.ikmnnmurlleldzszgddc:qXsYiXmFrMUDaP6K@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"

# Firebase 配置
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBgP_Oy5KTYfsEyNiXrtXwSAp1tztOuDyM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=zuhio-keyword-count-checker.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=zuhio-keyword-count-checker
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=zuhio-keyword-count-checker.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=289541466359
NEXT_PUBLIC_FIREBASE_APP_ID=1:289541466359:web:e6105f849bd6a5df90cbf2
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-CTZEVL2EWZ

# PayPal 配置（沙箱环境）
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AevvA8o2Kppx2FwFBom4Q6ZzPCTdxCKkeRI2ZBVgerfRZqcvDUWLKYvrLTWK_SBoabipvGH5wBa_1iGw
PAYPAL_SECRET=ELoML4ZUrSqaR9O5nNtXjq3Oc1MgO0L60riU1Kx_Z2ixa2Iz3KEl2VqyTKpMetexKBKLzfnIVqSKDswG
PAYPAL_API_URL=https://api-m.sandbox.paypal.com

# PayPal 订阅计划 ID
NEXT_PUBLIC_PAYPAL_PLAN_PRO_MONTHLY=P-1AK67303R1503452TNHDOITQ
NEXT_PUBLIC_PAYPAL_PLAN_PRO_YEARLY=P-9BF18630VW4069643NHDOITY
```

### Vercel 生产环境

**⚠️ 必须在 Vercel Dashboard 配置以下环境变量：**

访问：https://vercel.com/lumaxiangshangs-projects/zuhio-keyword-count-checker/settings/environment-variables

#### 1. 数据库（Vercel 集成 Supabase）

如果使用 Vercel 的 Supabase 集成，Vercel 会自动注入 `DATABASE_URL`。

**检查方法：**
- Vercel Dashboard → Storage → Supabase → 确认已连接

如果未自动注入，手动添加：
```
DATABASE_URL=postgresql://...（从 Supabase Dashboard 获取）
```

#### 2. Firebase（必需）

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBgP_Oy5KTYfsEyNiXrtXwSAp1tztOuDyM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=zuhio-keyword-count-checker.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=zuhio-keyword-count-checker
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=zuhio-keyword-count-checker.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=289541466359
NEXT_PUBLIC_FIREBASE_APP_ID=1:289541466359:web:e6105f849bd6a5df90cbf2
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-CTZEVL2EWZ
```

#### 3. PayPal（必需）

**沙箱环境（测试）：**
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AevvA8o2Kppx2FwFBom4Q6ZzPCTdxCKkeRI2ZBVgerfRZqcvDUWLKYvrLTWK_SBoabipvGH5wBa_1iGw
PAYPAL_SECRET=ELoML4ZUrSqaR9O5nNtXjq3Oc1MgO0L60riU1Kx_Z2ixa2Iz3KEl2VqyTKpMetexKBKLzfnIVqSKDswG
PAYPAL_API_URL=https://api-m.sandbox.paypal.com
NEXT_PUBLIC_PAYPAL_PLAN_PRO_MONTHLY=P-1AK67303R1503452TNHDOITQ
NEXT_PUBLIC_PAYPAL_PLAN_PRO_YEARLY=P-9BF18630VW4069643NHDOITY
```

**生产环境（上线）：**
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=你的 LIVE Client ID
PAYPAL_SECRET=你的 LIVE Secret
PAYPAL_API_URL=https://api-m.paypal.com
NEXT_PUBLIC_PAYPAL_PLAN_PRO_MONTHLY=你的 LIVE 计划 ID
NEXT_PUBLIC_PAYPAL_PLAN_PRO_YEARLY=你的 LIVE 计划 ID
```

---

## 🔍 验证配置

### 1. 本地测试

```bash
cd /root/.openclaw/workspace/zuhio-keyword-count-checker

# 安装依赖
npm install

# 生成 Prisma Client
npx prisma generate

# 测试数据库连接
npx prisma db pull

# 启动开发服务器
npm run dev
```

访问：http://localhost:3000

### 2. Vercel 测试

部署后访问：
- 主页：https://www.zuhiokeywordcountchecker.shop
- API 测试：https://www.zuhiokeywordcountchecker.shop/api/paypal/config

**期望响应：**
```json
{
  "clientId": "AevvA8o2...",
  "apiUrl": "https://api-m.sandbox.paypal.com",
  "configured": true
}
```

---

## ⚠️ 常见错误排查

### 错误 1：500 Internal Server Error

**症状：** 调用 `/api/subscription/create` 返回 500

**原因：**
- ❌ 环境变量未配置
- ❌ 数据库连接失败
- ❌ PayPal 密钥错误

**解决方案：**
1. 检查 Vercel 环境变量是否全部配置
2. 查看 Vercel Functions 日志
3. 确认 DATABASE_URL 正确

### 错误 2：Prisma Client 未生成

**症状：** `Error: Cannot find module '@prisma/client'`

**解决方案：**
```bash
npx prisma generate
```

### 错误 3：Firebase 认证失败

**症状：** 无法登录

**解决方案：**
1. 检查 Firebase 环境变量
2. 确认 Firebase 项目已启用 Google Auth
3. 检查 Firebase Console 授权域名

---

## 📊 Vercel 集成检查

### Supabase 集成

1. Vercel Dashboard → **Storage**
2. 确认 **Supabase** 已连接
3. 点击 **Connect Database**（如未连接）
4. Vercel 会自动注入 `DATABASE_URL`

### 验证集成

```bash
# 本地测试数据库连接
npx prisma db pull

# 应该看到数据库表结构
```

---

## 🔄 部署流程

### 本地构建测试
```bash
npm run build
```

### 推送到 GitHub
```bash
git add .
git commit -m "fix: 描述"
git push origin main
```

### Vercel 自动部署
- Vercel 检测到 Git push 后自动部署
- 约 2-5 分钟完成

### 手动重新部署
Vercel Dashboard → **Deployments** → **Redeploy**

---

## 📞 支持

遇到问题时：
1. 查看 Vercel Functions 日志
2. 检查环境变量配置
3. 验证数据库连接
4. 测试 PayPal API

---

**最后更新：** 2026-03-30  
**版本：** v2.0.0  
**状态：** ✅ 配置完成
