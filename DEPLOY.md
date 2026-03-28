# 🚀 部署指南

**项目已准备就绪，等待推送到 GitHub**

---

## 📋 当前状态

✅ 所有代码已提交到 Git  
⏳ 等待推送到 GitHub  
⏳ 等待部署到 Vercel/Cloudflare Pages

---

## 🔧 推送方法

### 方法 1：使用 GitHub Token（推荐）

1. **获取 GitHub Token**
   - 访问 https://github.com/settings/tokens
   - 创建新的 Personal Access Token
   - 选择权限：`repo`（完整仓库权限）
   - 复制生成的 token

2. **设置 Git 认证**
   ```bash
   cd /root/.openclaw/workspace/zuhio-keyword-count-checker
   
   # 使用 token 推送（替换 YOUR_TOKEN）
   git push https://YOUR_TOKEN@github.com/lumaxiangshang/zuhio-keyword-count-checker.git main
   ```

### 方法 2：配置 SSH 密钥

1. **生成 SSH 密钥**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. **添加公钥到 GitHub**
   - 访问 https://github.com/settings/keys
   - 点击 "New SSH key"
   - 粘贴 `~/.ssh/id_ed25519.pub` 的内容

3. **修改远程仓库为 SSH**
   ```bash
   cd /root/.openclaw/workspace/zuhio-keyword-count-checker
   git remote set-url origin git@github.com:lumaxiangshang/zuhio-keyword-count-checker.git
   git push origin main
   ```

### 方法 3：在本地电脑推送

1. **克隆仓库**
   ```bash
   git clone https://github.com/lumaxiangshang/zuhio-keyword-count-checker.git
   cd zuhio-keyword-count-checker
   ```

2. **从当前服务器拉取更改**
   
   或者直接在本地开发，然后推送。

---

## 📦 部署到 Vercel

### 步骤 1：推送到 GitHub

使用上述任一方法推送到 GitHub。

### 步骤 2：连接 Vercel

1. 访问 https://vercel.com/new
2. 点击 "Import Git Repository"
3. 选择 `zuhio-keyword-count-checker` 仓库
4. 点击 "Import"

### 步骤 3：配置环境变量

在 Vercel 项目设置中添加以下环境变量：

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBgP_Oy5KTYfsEyNiXrtXwSAp1tztOuDyM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=zuhio-keyword-count-checker.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=zuhio-keyword-count-checker
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=zuhio-keyword-count-checker.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=289541466359
NEXT_PUBLIC_FIREBASE_APP_ID=1:289541466359:web:e6105f849bd6a5df90cbf2
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-CTZEVL2EWZ

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AevvA8o2Kppx2FwFBom4Q6ZzPCTdxCKkeRI2ZBVgerfRZqcvDUWLKYvrLTWK_SBoabipvGH5wBa_1iGw
PAYPAL_SECRET=ELoML4ZUrSqaR9O5nNtXjq3Oc1MgO0L60riU1Kx_Z2ixa2Iz3KEl2VqyTKpMetexKBKLzfnIVqSKDswG
PAYPAL_API_URL=https://api-m.sandbox.paypal.com

# PayPal Plans
NEXT_PUBLIC_PAYPAL_PLAN_PRO_MONTHLY=P-1AK67303R1503452TNHDOITQ
NEXT_PUBLIC_PAYPAL_PLAN_PRO_YEARLY=P-9BF18630VW4069643NHDOITY
NEXT_PUBLIC_PAYPAL_PLAN_BUSINESS_MONTHLY=P-56W56046144411137NHDOITY
NEXT_PUBLIC_PAYPAL_PLAN_BUSINESS_YEARLY=P-94F994413Y785902JNHDOIUA
```

### 步骤 4：部署

点击 "Deploy"，Vercel 会自动构建并部署。

---

## ☁️ 部署到 Cloudflare Pages

### 步骤 1：连接 GitHub

1. 访问 https://dash.cloudflare.com/?to=/:account/pages
2. 点击 "Create a project"
3. 选择 "Connect to Git"
4. 选择 `zuhio-keyword-count-checker` 仓库

### 步骤 2：配置构建设置

- **Build command:** `npm run build`
- **Build output directory:** `.next`
- **Root directory:** `/`

### 步骤 3：配置环境变量

与 Vercel 相同，添加所有环境变量。

### 步骤 4：部署

点击 "Save and Deploy"。

---

## 📊 部署后的测试 URL

部署成功后，访问以下页面测试：

1. **首页:** `https://your-domain.com/`
2. **定价页:** `https://your-domain.com/pricing`
3. **积分页:** `https://your-domain.com/credits`
4. **调试页:** `https://your-domain.com/debug-paypal`
5. **配置测试:** `https://your-domain.com/paypal-test`

---

## 🔐 安全提示

### ⚠️ 重要：生产环境配置

上线前必须：

1. **创建 Live PayPal 账号**
   - 访问 https://developer.paypal.com
   - 切换到 Live 模式
   - 创建新的 App
   - 获取 Live Client ID 和 Secret

2. **创建 Live 订阅计划**
   ```bash
   # 修改脚本中的 URL 为生产环境
   const PAYPAL_BASE_URL = 'https://api-m.paypal.com';
   
   # 重新运行创建脚本
   npm run paypal:create-products
   ```

3. **更新环境变量**
   - 替换为 Live 凭证
   - 替换为 Live Plan IDs

4. **不要提交 .env.local**
   - 已添加到 .gitignore
   - 只在部署平台配置

---

## 📝 快速推送命令

如果你有 GitHub Token，直接运行：

```bash
cd /root/.openclaw/workspace/zuhio-keyword-count-checker

# 使用 token 推送（替换 YOUR_GITHUB_TOKEN）
git push https://YOUR_GITHUB_TOKEN@github.com/lumaxiangshang/zuhio-keyword-count-checker.git main
```

---

## 🎯 下一步

1. **选择部署方式**
   - Vercel（推荐，简单快速）
   - Cloudflare Pages
   - 其他平台

2. **配置环境变量**
   - 复制 .env.local 中的所有变量
   - 在部署平台配置

3. **测试支付**
   - 使用沙盒账号测试
   - 确认所有功能正常

4. **切换到生产环境**
   - 创建 Live PayPal 凭证
   - 更新环境变量
   - 重新部署

---

**当前提交哈希：** 5a4bd34  
**提交时间：** 2026-03-28  
**提交内容：** 完整的 PayPal 支付集成
