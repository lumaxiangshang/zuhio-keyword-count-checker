# Vercel 环境变量配置指南

## ⚠️ 必须在 Vercel Dashboard 配置的环境变量

### 生产环境 (Production)

```bash
# 数据库连接
DATABASE_URL="postgresql://..."

# PayPal 配置（生产环境）
NEXT_PUBLIC_PAYPAL_CLIENT_ID="YOUR_LIVE_CLIENT_ID"
PAYPAL_SECRET="YOUR_LIVE_SECRET"
PAYPAL_API_URL="https://api-m.paypal.com"

# Firebase 配置
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyBgP_Oy5KTYfsEyNiXrtXwSAp1tztOuDyM"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="zuhio-keyword-count-checker.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="zuhio-keyword-count-checker"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="zuhio-keyword-count-checker.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="289541466359"
NEXT_PUBLIC_FIREBASE_APP_ID="1:289541466359:web:e6105f849bd6a5df90cbf2"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-CTZEVL2EWZ"

# 应用配置
NEXT_PUBLIC_BASE_URL="https://www.zuhiokeywordcountchecker.shop"
NODE_ENV="production"
```

### 预览环境 (Preview)

```bash
# 使用沙箱环境配置
NEXT_PUBLIC_PAYPAL_CLIENT_ID="AevvA8o2Kppx2FwFBom4Q6ZzPCTdxCKkeRI2ZBVgerfRZqcvDUWLKYvrLTWK_SBoabipvGH5wBa_1iGw"
PAYPAL_SECRET="ELoML4ZUrSqaR9O5nNtXjq3Oc1MgO0L60riU1Kx_Z2ixa2Iz3KEl2VqyTKpMetexKBKLzfnIVqSKDswG"
PAYPAL_API_URL="https://api-m.sandbox.paypal.com"
```

---

## 📋 配置步骤

1. 访问 Vercel Dashboard: https://vercel.com/dashboard
2. 选择项目：`zuhio-keyword-count-checker`
3. 进入 **Settings** → **Environment Variables**
4. 点击 **Add New** 添加每个环境变量
5. 选择环境（Production / Preview / Development）
6. 保存后重新部署项目

---

## 🔍 验证配置

部署后访问：
- https://www.zuhiokeywordcountchecker.shop/api/paypal/config

应该返回：
```json
{
  "clientId": "AevvA8o2Kppx2FwFBom4Q6ZzPCTdxCKkeRI2ZBVgerfRZqcvDUWLKYvrLTWK_SBoabipvGH5wBa_1iGw",
  "apiUrl": "https://api-m.sandbox.paypal.com",
  "configured": true
}
```

---

## ⚠️ 常见错误

### 500 Internal Server Error
**原因：** 环境变量未配置或数据库连接失败

**解决方案：**
1. 检查 Vercel Dashboard 环境变量
2. 确认 DATABASE_URL 正确
3. 查看 Vercel 函数日志

### 404 Not Found
**原因：** 路由不存在或静态资源加载失败

**解决方案：**
1. 清除浏览器缓存
2. 强制刷新（Ctrl+Shift+R）
3. 检查 Vercel 部署日志

---

## 🚀 重新部署

配置环境变量后：
1. Vercel 会自动重新部署
2. 或手动触发：**Deployments** → **Redeploy**

---

**最后更新：** 2026-03-30  
**版本：** v2.0.0
