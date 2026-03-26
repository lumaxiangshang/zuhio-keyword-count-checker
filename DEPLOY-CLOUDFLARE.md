# ☁️ Cloudflare Pages 部署指南

## ⚠️ 重要说明

你提供的 Token 是 **Global API Key**（32 位），而不是 **API Token**（JWT 格式）。

**推荐使用 GitHub 原生集成方式**，无需配置 Token！

---

## 🚀 方案一：GitHub 原生集成（推荐 - 5 分钟完成）

### 第 1 步：访问 Cloudflare Dashboard

```
https://dash.cloudflare.com/?to=/:account/pages
```

### 第 2 步：创建项目

1. 点击 **Create a project**
2. 选择 **Connect to Git**

### 第 3 步：授权 GitHub

- 如果首次使用，点击 **Authorize Cloudflare Pages**
- 登录 GitHub 并授权
- 选择仓库访问权限（建议选 **All repositories** 或指定 `zuhio-keyword-count-checker`）

### 第 4 步：选择仓库

- **Repository**: `lumaxiangshang/zuhio-keyword-count-checker`
- **Branch**: `main`

### 第 5 步：配置构建

```
Framework preset: Next.js
Build command: npm run build
Build output directory: .next
Root directory: /
```

### 第 6 步：设置环境变量（可选）

点击 **Advanced** → **Add variable**：

| Variable | Value |
|----------|-------|
| `NODE_VERSION` | `18` |
| `NEXT_TELEMETRY_DISABLED` | `1` |

### 第 7 步：部署

点击 **Save and Deploy**

等待 2-3 分钟，部署完成后你会获得：
- **URL**: `https://zuhio-keyword-count-checker.pages.dev`
- **自动 HTTPS**: ✅
- **全球 CDN**: ✅

---

## 🔧 方案二：CLI 部署（需要正确的 API Token）

### 获取正确的 API Token

1. 访问 https://dash.cloudflare.com/profile/api-tokens
2. 点击 **Create Token**
3. 选择 **Edit Cloudflare Workers** 模板
4. **权限**：
   - Account Cloudflare Pages: Edit
   - Account Cloudflare Workers: Edit
5. 点击 **Create Token**
6. 复制 Token（格式：`eyJxxxxx.xxxxx.xxxxx`）

### 使用 CLI 部署

```bash
# 1. 设置环境变量
export CLOUDFLARE_API_TOKEN="eyJxxxxx..."
export CLOUDFLARE_ACCOUNT_ID="your_account_id"

# 2. 构建项目
npx @cloudflare/next-on-pages

# 3. 部署
npx wrangler pages deploy .vercel/output/static \
  --project-name=zuhio-keyword-count-checker \
  --branch=main
```

---

## 📦 项目配置

### 已添加的文件

| 文件 | 说明 |
|------|------|
| `wrangler.toml` | Wrangler 配置 |
| `functions/[[path]].js` | Pages Functions |
| `cloudflare-pages.toml` | Pages 配置 |

### package.json 脚本

```json
{
  "scripts": {
    "pages:build": "npx @cloudflare/next-on-pages",
    "deploy": "npx wrangler pages deploy .vercel/output/static"
  }
}
```

---

## 🌐 部署后配置

### 自定义域名（可选）

1. 进入 Pages 项目
2. 点击 **Custom domains**
3. 点击 **Add custom domain**
4. 输入 `zuhio.com`
5. 自动配置 DNS

### 环境变量

在 Cloudflare 控制台设置：

1. Pages 项目 → **Settings**
2. **Environment variables**
3. 添加变量

推荐设置：
- `NODE_VERSION`: `18`
- `NEXT_TELEMETRY_DISABLED`: `1`

---

## ✅ 验证部署

部署完成后访问：
```
https://zuhio-keyword-count-checker.pages.dev
```

测试功能：
1. ✅ 页面加载正常
2. ✅ 输入文本实时分析
3. ✅ 关键词密度计算
4. ✅ 响应式布局

---

## 🛠️ 故障排查

### 构建失败

```bash
# 本地测试构建
npm run build

# 检查输出
npx @cloudflare/next-on-pages
```

### 404 错误

检查输出目录是否正确：
- 应该是 `.vercel/output/static`
- 或 `.next`（静态导出）

### API Token 无效

- 确认 Token 格式：`eyJ...`（JWT）
- 检查权限：Pages: Edit
- 重新创建 Token

---

## 📞 需要帮助？

**推荐操作**：
1. 使用方案一（GitHub 原生集成）
2. 在 Cloudflare 控制台网页操作
3. 无需配置 Token

**如果遇到问题**：
- 检查 GitHub 授权
- 确认仓库可见性（Public）
- 查看 Cloudflare 构建日志

---

**创建时间**: 2026-03-26  
**项目**: Zuhio Keyword Count Checker
