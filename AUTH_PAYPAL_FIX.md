# 🔧 Google Auth 和 PayPal 故障排查报告

**生成时间：** 2026-03-29 06:55 GMT+8  
**状态：** ⚠️ 需要手动配置

---

## 📋 问题总结

### 1. ❌ Google Auth 登录失败

**可能原因：**

1. **Firebase 控制台未添加授权域名**
   - 生产域名 `zuhiokeywordcountchecker.shop` 未添加到 Firebase Authorized Domains
   - Vercel 预览域名未添加

2. **Firebase 配置问题**
   - Google 登录 provider 未在 Firebase 控制台启用
   - OAuth 同意屏幕未配置

3. **代码问题**
   - 使用了 `signInWithPopup` 在某些浏览器/环境下不兼容
   - 需要改用 `signInWithRedirect`

### 2. ❌ PayPal 支付失败

**可能原因：**

1. **环境变量未同步到 Vercel**
   - `.env.local` 文件只在本地有效
   - Vercel 需要单独配置环境变量

2. **PayPal 沙箱账号问题**
   - 沙箱账号可能被限制
   - 订阅计划 ID 配置错误

3. **API 路由问题**
   - `/api/paypal/*` 路由在 Vercel 上可能未正确部署
   - 数据库连接问题导致支付记录无法创建

---

## 🔍 已检查的配置

### ✅ 本地环境变量（.env.local）

```bash
# Firebase 配置 ✅
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBgP_Oy5KTYfsEyNiXrtXwSAp1tztOuDyM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=zuhio-keyword-count-checker.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=zuhio-keyword-count-checker
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=zuhio-keyword-count-checker.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=289541466359
NEXT_PUBLIC_FIREBASE_APP_ID=1:289541466359:web:e6105f849bd6a5df90cbf2
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-CTZEVL2EWZ

# PayPal 配置 ✅
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AevvA8o2Kppx2FwFBom4Q6ZzPCTdxCKkeRI2ZBVgerfRZqcvDUWLKYvrLTWK_SBoabipvGH5wBa_1iGw
PAYPAL_SECRET=ELoML4ZUrSqaR9O5nNtXjq3Oc1MgO0L60riU1Kx_Z2ixa2Iz3KEl2VqyTKpMetexKBKLzfnIVqSKDswG
PAYPAL_API_URL=https://api-m.sandbox.paypal.com
```

### ✅ 代码配置检查

- `lib/firebase.ts` - Firebase 初始化正确 ✅
- `lib/paypal.ts` - PayPal 配置正确 ✅
- `components/GoogleLogin.tsx` - Google 登录组件正确 ✅
- `app/api/paypal/create-order/route.ts` - PayPal API 路由正确 ✅

---

## 🛠️ 解决方案

### 方案 1: 修复 Google Auth

#### 步骤 1: 配置 Firebase 授权域名

1. 访问 [Firebase Console](https://console.firebase.google.com/project/zuhio-keyword-count-checker/authentication/providers)

2. 点击 **Sign-in method** 标签

3. 确保 **Google** 已启用：
   - 点击 Google
   - 开启 **Enable**
   - 设置支持邮箱（可选）
   - 保存

4. 添加授权域名：
   - 在 **Settings** 标签下找到 **Authorized domains**
   - 添加以下域名：
     ```
     zuhiokeywordcountchecker.shop
     zuhio-keyword-count-checker.vercel.app
     localhost (本地开发用)
     ```

#### 步骤 2: 配置 OAuth 同意屏幕

1. 访问 [Google Cloud Console](https://console.cloud.google.com/apis/credentials/consent)

2. 选择项目：`zuhio-keyword-count-checker`

3. 填写必要信息：
   - App name: Zuhio Keyword Checker
   - User support email: 你的邮箱
   - Developer contact: 你的邮箱

4. 添加测试用户（如果是测试模式）

#### 步骤 3: 修改代码使用 Redirect 模式（备选）

如果 popup 模式持续失败，修改 `lib/firebase.ts`：

```typescript
// 添加导入
import { signInWithRedirect, getRedirectResult } from 'firebase/auth';

// 修改登录函数
export const signInWithGoogle = async () => {
  try {
    // 使用 redirect 而不是 popup
    await signInWithRedirect(auth, googleProvider);
    return { user: null, error: null }; // 重定向后不会立即返回
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    return { user: null, error: error.message };
  }
};

// 在应用启动时检查重定向结果
export const checkRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    return { user: result?.user || null, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};
```

---

### 方案 2: 修复 PayPal 支付

#### 步骤 1: 在 Vercel 配置环境变量

1. 访问 [Vercel Dashboard](https://vercel.com/lumaxiangshang-6334s-projects/zuhio-keyword-count-checker/settings/environment-variables)

2. 添加以下环境变量（**Production** 环境）：

```bash
# 数据库
DATABASE_URL=postgresql://postgres.ikmnnmurlleldzszgddc:qXsYiXmFrMUDaP6K@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AevvA8o2Kppx2FwFBom4Q6ZzPCTdxCKkeRI2ZBVgerfRZqcvDUWLKYvrLTWK_SBoabipvGH5wBa_1iGw
PAYPAL_SECRET=ELoML4ZUrSqaR9O5nNtXjq3Oc1MgO0L60riU1Kx_Z2ixa2Iz3KEl2VqyTKpMetexKBKLzfnIVqSKDswG
PAYPAL_API_URL=https://api-m.sandbox.paypal.com
PAYPAL_WEBHOOK_ID=

# PayPal 计划 ID
NEXT_PUBLIC_PAYPAL_PLAN_PRO_MONTHLY=P-1AK67303R1503452TNHDOITQ
NEXT_PUBLIC_PAYPAL_PLAN_PRO_YEARLY=P-9BF18630VW4069643NHDOITY
NEXT_PUBLIC_PAYPAL_PLAN_BUSINESS_MONTHLY=P-56W56046144411137NHDOITY
NEXT_PUBLIC_PAYPAL_PLAN_BUSINESS_YEARLY=P-94F994413Y785902JNHDOIUA

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBgP_Oy5KTYfsEyNiXrtXwSAp1tztOuDyM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=zuhio-keyword-count-checker.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=zuhio-keyword-count-checker
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=zuhio-keyword-count-checker.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=289541466359
NEXT_PUBLIC_FIREBASE_APP_ID=1:289541466359:web:e6105f849bd6a5df90cbf2
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-CTZEVL2EWZ

# 应用
NEXT_PUBLIC_BASE_URL=https://zuhiokeywordcountchecker.shop
NODE_ENV=production
```

3. 保存后，**重新部署** 项目

#### 步骤 2: 测试 PayPal API

访问部署后的 API 端点测试：
```
https://zuhiokeywordcountchecker.shop/api/paypal/config
```

应该返回 JSON：
```json
{
  "clientId": "AevvA8o2Kppx2FwFBom4Q6ZzPCTdxCKkeRI2ZBVgerfRZqcvDUWLKYvrLTWK_SBoabipvGH5wBa_1iGw",
  "plans": {
    "proMonthly": "P-1AK67303R1503452TNHDOITQ",
    "proYearly": "P-9BF18630VW4069643NHDOITY",
    "businessMonthly": "P-56W56046144411137NHDOITY",
    "businessYearly": "P-94F994413Y785902JNHDOIUA"
  },
  "apiUrl": "https://api-m.sandbox.paypal.com"
}
```

#### 步骤 3: 检查数据库连接

在 Vercel 部署日志中查看：
- 是否有 `prisma migrate deploy` 错误
- 数据库连接是否成功

---

## 🧪 测试清单

### Google Auth 测试

- [ ] 访问 https://zuhiokeywordcountchecker.shop
- [ ] 点击 "Sign in with Google" 按钮
- [ ] 检查是否弹出 Google 登录窗口
- [ ] 完成登录
- [ ] 检查是否成功跳转到 dashboard
- [ ] 检查浏览器控制台是否有错误

### PayPal 支付测试

- [ ] 访问 https://zuhiokeywordcountchecker.shop/api/paypal/config
- [ ] 确认返回正确的配置 JSON
- [ ] 访问 /credits 页面
- [ ] 选择积分包
- [ ] 点击 PayPal 支付按钮
- [ ] 检查是否跳转到 PayPal
- [ ] 使用沙箱账号完成支付
- [ ] 检查是否成功返回并添加积分

---

## 📞 需要的操作

### 路总需要完成：

1. **Firebase 配置**（5 分钟）
   - [ ] 访问 Firebase Console
   - [ ] 启用 Google 登录 provider
   - [ ] 添加授权域名 `zuhiokeywordcountchecker.shop`
   - [ ] 配置 OAuth 同意屏幕

2. **Vercel 环境变量**（3 分钟）
   - [ ] 访问 Vercel Dashboard
   - [ ] 添加所有环境变量（见上方列表）
   - [ ] 触发重新部署

3. **测试**（5 分钟）
   - [ ] 测试 Google 登录
   - [ ] 测试 PayPal 支付
   - [ ] 报告任何错误信息

---

## 🚨 常见错误及解决

### 错误：`auth/unauthorized-domain`

**原因：** 域名未在 Firebase 授权列表

**解决：** 在 Firebase Console → Authentication → Settings → Authorized domains 添加域名

### 错误：`popup-closed-by-user`

**原因：** 浏览器阻止 popup 或用户提前关闭

**解决：** 
- 允许浏览器 popup
- 或改用 `signInWithRedirect` 模式

### 错误：`PayPal credentials not configured`

**原因：** Vercel 环境变量未配置

**解决：** 在 Vercel Dashboard 添加环境变量并重新部署

### 错误：`Database connection failed`

**原因：** 数据库 URL 配置错误或 Supabase 连接问题

**解决：** 
- 检查 DATABASE_URL 是否正确
- 确认 Supabase 项目状态正常
- 检查 SSL 模式配置

---

## 📝 后续优化

1. **切换到 PayPal Live 环境**
   - 创建 PayPal 生产 App
   - 获取 Live Client ID 和 Secret
   - 更新环境变量

2. **添加错误监控**
   - 集成 Sentry 或 LogRocket
   - 追踪认证和支付错误

3. **优化用户体验**
   - 添加加载状态
   - 显示友好的错误提示
   - 添加重试机制

---

**下一步：** 请路总完成上述配置后告诉我测试结果，如有错误我会继续协助解决！
