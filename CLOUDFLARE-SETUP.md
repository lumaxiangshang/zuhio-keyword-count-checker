# ☁️ Cloudflare Pages 部署指南

## 📋 方案选择

### 方案一：GitHub 原生集成（推荐）

**优点：**
- ✅ 自动部署（push 到 main 分支自动触发）
- ✅ 预览部署（PR 自动创建 preview）
- ✅ 无需配置 token
- ✅ 可视化配置界面

**步骤：**

1. **访问 Cloudflare Dashboard**
   - https://dash.cloudflare.com/?to=/:account/pages

2. **创建项目**
   - 点击 **Create a project**
   - 选择 **Connect to Git**

3. **授权 GitHub**
   - 如果未授权，点击 **Authorize Cloudflare Pages**
   - 登录 GitHub 并授权
   - 选择要访问的仓库（可选全部或指定）

4. **选择仓库**
   - Repository: `lumaxiangshang/zuhio-keyword-count-checker`
   - Branch: `main`

5. **配置构建设置**

```
Framework preset: Next.js
Build command: npm run build
Build output directory: .next
Root directory: /
```

6. **环境变量**（可选）

```
NODE_VERSION = 18
```

7. **点击 Save and Deploy**

---

### 方案二：Wrangler CLI 部署

**优点：**
- ✅ 完全自动化
- ✅ 适合 CI/CD
- ✅ 可自定义配置

**需要：**
- Cloudflare API Token
- Cloudflare Account ID

**步骤：**

#### 1. 安装依赖

```bash
npm install -g wrangler
npm install -D @cloudflare/next-on-pages
```

#### 2. 登录 Cloudflare

```bash
wrangler login
```

#### 3. 构建项目

```bash
npx @cloudflare/next-on-pages
```

#### 4. 部署

```bash
npx wrangler pages deploy .vercel/output/static
```

---

## 🔐 方案二需要的 Token

### Cloudflare API Token

**获取步骤：**

1. 访问 https://dash.cloudflare.com/profile/api-tokens
2. 点击 **Create Token**
3. 选择 **Edit Cloudflare Workers** 模板
4. **权限配置**：
   - Account Cloudflare Pages: Edit
   - Account Cloudflare Workers: Edit
5. 点击 **Create Token**
6. 复制 Token（格式：`eyJ...`）

### Cloudflare Account ID

**获取方式：**
- 访问 https://dash.cloudflare.com/
- 右侧边栏显示 Account ID
- 或：https://api.cloudflare.com/client/v4/user/tokens/verify

---

## 📦 项目配置说明

### 已添加的文件

| 文件 | 说明 |
|------|------|
| `cloudflare-pages.toml` | Pages 配置文件 |
| `functions/[[path]].js` | Pages Functions 路由 |
| `CLOUDFLARE-SETUP.md` | 本部署指南 |

### package.json 更新

添加了 Cloudflare 相关脚本：

```json
{
  "scripts": {
    "pages:build": "npx @cloudflare/next-on-pages",
    "preview": "npx wrangler pages dev .vercel/output/static",
    "deploy": "npx wrangler pages deploy .vercel/output/static"
  }
}
```

---

## 🌐 自定义域名（可选）

### 在 Cloudflare 控制台配置

1. 进入 Pages 项目
2. 点击 **Custom domains**
3. 点击 **Add custom domain**
4. 输入域名（如：zuhio.com）
5. 自动配置 DNS

### 需要的 DNS 记录

```
Type: CNAME
Name: @ 或 www
Content: <project-name>.pages.dev
Proxy: Enabled (橙色云朵)
```

---

## ⚡ 环境变量

### 在 Cloudflare 控制台设置

1. 进入 Pages 项目
2. 点击 **Settings** → **Environment variables**
3. 点击 **Add variable**

### 推荐设置

| Variable | Value |
|----------|-------|
| `NODE_VERSION` | `18` |
| `NEXT_TELEMETRY_DISABLED` | `1` |

---

## 🚀 推荐流程

### 最快部署（5 分钟）

```bash
# 1. 推送代码到 GitHub
cd /root/projects/zuhio-keyword-count-checker
git add .
git commit -m "Add Cloudflare Pages configuration"
git push origin main

# 2. 在 Cloudflare 控制台创建项目
# https://dash.cloudflare.com/?to=/:account/pages

# 3. 选择仓库，配置构建，点击部署
```

### 自动化部署（推荐）

1. 完成上述步骤后
2. 每次 push 到 main 分支自动部署
3. PR 自动创建 preview 部署

---

## 📊 部署后的 URL

- **生产环境**: `https://<project-name>.pages.dev`
- **Preview**: `https://<pr-number>-<project-name>.pages.dev`
- **自定义域名**: `https://zuhio.com`（配置后）

---

## 🛠️ 故障排查

### 构建失败

```bash
# 本地测试构建
npm run build

# 检查 Next.js 配置
npx @cloudflare/next-on-pages
```

### 部署后 404

检查输出目录：
- 应该是 `.vercel/output/static`
- 或 `.next`（静态导出）

### API Token 无效

- 检查权限是否包含 Pages: Edit
- 确认 Account ID 正确
- 重新创建 Token

---

## 📞 需要帮助？

**告诉我：**
- 选择方案一还是方案二
- 是否需要我帮你推送配置代码
- 是否需要创建自动化部署脚本

---

**创建时间**: 2026-03-26  
**项目**: Zuhio Keyword Count Checker
