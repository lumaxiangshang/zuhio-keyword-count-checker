# ☁️ Cloudflare Pages 部署指南

**构建状态：** ✅ 成功  
**部署状态：** ⏳ 等待 API Token

---

## 📋 当前状态

✅ 项目已构建完成  
✅ wrangler.toml 已配置  
⏳ 需要 Cloudflare API Token 进行部署

---

## 🔑 获取 Cloudflare API Token

### 步骤 1：创建 API Token

1. **访问 Cloudflare Dashboard：**
   ```
   https://dash.cloudflare.com/profile/api-tokens
   ```

2. **创建 Token：**
   - 点击 "Create Token"
   - 选择 "Create Custom Token"
   - 点击 "Get started"

3. **配置权限：**
   - **Name:** `Zuhio Deploy Token`
   - **Permissions:**
     - `Account` → `Cloudflare Pages` → `Edit`
     - `Account` → `Cloudflare Pages` → `Read`
   - **Account:** 选择你的账号

4. **生成并复制 Token：**
   - 点击 "Continue to summary"
   - 点击 "Create Token"
   - **立即复制 Token**（只显示一次）

---

## 🚀 部署方法

### 方法 1：使用 API Token（推荐）

**在你的电脑或服务器上运行：**

```bash
cd /root/.openclaw/workspace/zuhio-keyword-count-checker

# 设置环境变量（替换 YOUR_TOKEN）
export CLOUDFLARE_API_TOKEN=YOUR_TOKEN

# 部署到 Cloudflare Pages
wrangler pages deploy .next --project-name=zuhi-keyword-count-checker
```

### 方法 2：使用 Wrangler Login

```bash
cd /root/.openclaw/workspace/zuhio-keyword-count-checker

# 登录 Cloudflare
wrangler login

# 部署
wrangler pages deploy .next --project-name=zuhi-keyword-count-checker
```

### 方法 3：通过 GitHub 连接（最简单）

1. **推送到 GitHub：**
   ```bash
   # 使用你的 GitHub Token 推送
   git push https://YOUR_GITHUB_TOKEN@github.com/lumaxiangshang/zuhio-keyword-count-checker.git main
   ```

2. **在 Cloudflare Dashboard 连接：**
   - 访问 https://dash.cloudflare.com/?to=/:account/pages
   - 点击 "Create a project"
   - 选择 "Connect to Git"
   - 选择 `zuhio-keyword-count-checker` 仓库
   - 点击 "Begin setup"

3. **配置构建设置：**
   - **Build command:** `npm run build`
   - **Build output directory:** `.next`
   - **Root directory:** `/`

4. **配置环境变量：**
   在 Cloudflare Dashboard 中添加以下变量：
   
   ```
   # PayPal
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=AevvA8o2Kppx2FwFBom4Q6ZzPCTdxCKkeRI2ZBVgerfRZqcvDUWLKYvrLTWK_SBoabipvGH5wBa_1iGw
   PAYPAL_SECRET=ELoML4ZUrSqaR9O5nNtXjq3Oc1MgO0L60riU1Kx_Z2ixa2Iz3KEl2VqyTKpMetexKBKLzfnIVqSKDswG
   PAYPAL_API_URL=https://api-m.sandbox.paypal.com
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
   ```

5. **点击 "Save and Deploy"**

---

## 📊 部署后的 URL

部署成功后，你会获得：
- **生产环境 URL:** `https://zuhi-keyword-count-checker.pages.dev`
- **预览环境 URL:** 每次 Git 推送都会生成新的预览 URL

**测试页面：**
- 首页：`https://zuhi-keyword-count-checker.pages.dev/`
- 定价页：`https://zuhi-keyword-count-checker.pages.dev/pricing`
- 积分页：`https://zuhi-keyword-count-checker.pages.dev/credits`
- 调试页：`https://zuhi-keyword-count-checker.pages.dev/debug-paypal`

---

## 🎯 推荐方案

**最简单的方式：通过 GitHub 连接**

1. 在你的电脑上推送代码到 GitHub
2. 在 Cloudflare Dashboard 连接 GitHub 仓库
3. 配置环境变量
4. 自动部署

**优点：**
- ✅ 无需管理 API Token
- ✅ 自动部署（每次推送都会自动构建）
- ✅ 有预览环境
- ✅ 容易回滚

---

## 🔐 环境变量说明

### 必须配置的环境变量

**PayPal 配置：**
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` - PayPal 客户端 ID
- `PAYPAL_SECRET` - PayPal 密钥（仅服务端）
- `PAYPAL_API_URL` - PayPal API 地址
- `NEXT_PUBLIC_PAYPAL_PLAN_*` - 订阅计划 ID

**Firebase 配置：**
- `NEXT_PUBLIC_FIREBASE_*` - Firebase 认证配置

### ⚠️ 安全提示

1. **不要提交 .env.local 到 Git**
   - 已添加到 .gitignore
   - 敏感信息只在部署平台配置

2. **生产环境使用 Live 凭证**
   - 当前配置的是沙箱环境
   - 上线前需要创建 Live PayPal App
   - 更新所有 Plan IDs

---

## 📝 快速部署命令

如果你有 Cloudflare API Token：

```bash
cd /root/.openclaw/workspace/zuhio-keyword-count-checker

# 设置 Token
export CLOUDFLARE_API_TOKEN=YOUR_TOKEN_HERE

# 直接部署
wrangler pages deploy .next --project-name=zuhi-keyword-count-checker
```

---

## 🧪 部署后测试

1. **访问定价页面**
   ```
   https://zuhi-keyword-count-checker.pages.dev/pricing
   ```

2. **测试 PayPal 支付**
   - 选择 Pro Monthly
   - 点击 PayPal 按钮
   - 使用沙盒账号完成支付

3. **检查 Console 日志**
   - 按 F12 打开开发者工具
   - 查看是否有错误

4. **验证交易**
   - 访问 https://developer.paypal.com/dashboard/transactions
   - 查看测试交易记录

---

## 📞 需要帮助？

**提供以下信息：**

1. **部署方式：**
   - [ ] 使用 API Token
   - [ ] 使用 Wrangler Login
   - [ ] 通过 GitHub 连接

2. **遇到的问题：**
   - 错误信息
   - 截图
   - 部署日志

3. **当前状态：**
   - 是否已推送到 GitHub
   - 是否有 Cloudflare 账号
   - 是否有 API Token

---

**构建完成时间：** 2026-03-28  
**构建输出目录：** `.next`  
**项目状态：** 等待部署
