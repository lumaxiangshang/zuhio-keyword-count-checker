# 🚀 Cloudflare Pages 部署 - 快速指南

## ⚠️ Token 说明

你提供的凭据：
- **API Key**: `f6fd3e21ab61c8cabf313d192400127f`（Global API Key 格式）
- **Account ID**: `cfat_IUmL7bemYHMcPBqg7eEVL8Fe1AhV6pwSPxOCW5EM9f86a5b7`

**问题**: 这是 Global API Key，不是 API Token。Cloudflare CLI 需要 JWT 格式的 API Token。

**解决方案**: 使用 **GitHub 原生集成**（网页操作，无需 Token）！

---

## ✅ 推荐方案：GitHub 原生集成（5 分钟）

### 第 1 步：打开 Cloudflare Dashboard

点击链接直接访问：
```
https://dash.cloudflare.com/?to=/:account/pages
```

### 第 2 步：创建项目

1. 点击 **Create a project** 按钮
2. 选择 **Connect to Git**

### 第 3 步：授权 GitHub

如果首次使用，会看到：
```
Authorize Cloudflare Pages
```

点击 **Authorize Cloudflare Pages**，然后：
- 登录 GitHub（如果未登录）
- 点击 **Authorize cloudflare** 按钮
- 选择 **All repositories** 或 **Only select repositories** → 选择 `zuhio-keyword-count-checker`

### 第 4 步：选择仓库

在仓库列表中找到并选择：
```
lumaxiangshang/zuhio-keyword-count-checker
```

点击 **Begin setup**

### 第 5 步：配置构建

填写以下配置：

```
Project name: zuhio-keyword-count-checker
Production branch: main
Framework preset: Next.js
Build command: npm run build
Build output directory: .next
Root directory: /
```

### 第 6 步：环境变量（可选）

点击 **Advanced** → **Add environment variable**：

| Variable name | Value |
|---------------|-------|
| `NODE_VERSION` | `18` |

### 第 7 步：部署

点击 **Save and Deploy**

等待 2-5 分钟，看到：
```
🎉 Deployment complete!
Your project is now live at:
https://zuhio-keyword-count-checker.pages.dev
```

---

## 🌐 访问你的网站

部署完成后，访问：
```
https://zuhio-keyword-count-checker.pages.dev
```

---

## 📱 测试功能

1. ✅ 页面加载正常
2. ✅ 输入英文文本，查看实时统计
3. ✅ 输入关键词，查看密度分析
4. ✅ 手机访问测试响应式

---

## 🎯 后续配置

### 自定义域名（可选）

1. 进入 Pages 项目
2. 点击 **Custom domains** 标签
3. 点击 **Add custom domain**
4. 输入你的域名（如 `zuhio.com`）
5. 点击 **Add domain**
6. 自动配置 DNS（如果域名在 Cloudflare）

### 查看部署日志

1. 进入 Pages 项目
2. 点击 **Deployments** 标签
3. 查看最新的部署记录
4. 点击可查看构建日志

### 自动部署

配置完成后：
- ✅ Push 到 `main` 分支 → 自动部署到生产环境
- ✅ 创建 Pull Request → 自动创建 Preview 部署

---

## 🛠️ 如果遇到问题

### GitHub 仓库未显示

**原因**: GitHub 授权时未选择该仓库

**解决**:
1. 在 Cloudflare Pages 创建页面
2. 点击 **Configure GitHub App**
3. 添加 `zuhio-keyword-count-checker` 仓库

### 构建失败

**检查**:
1. 点击失败的部署
2. 查看构建日志
3. 常见错误：
   - `npm install` 失败 → 检查 package.json
   - `npm run build` 失败 → 检查 Next.js 配置

### 部署后 404

**原因**: 输出目录配置错误

**解决**:
- 确认 Build output directory: `.next`
- 或尝试 `.vercel/output/static`

---

## 📞 需要帮助？

**操作过程中遇到任何问题，告诉我：**
- 截图错误信息
- 描述卡在哪一步
- 我会立即帮你解决

---

**现在就开始吧！打开链接，5 分钟完成部署！** 🚀

```
https://dash.cloudflare.com/?to=/:account/pages
```
