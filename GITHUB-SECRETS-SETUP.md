# 🔐 GitHub Secrets 配置指南

## ⚙️ 自动部署配置

### 第 1 步：在 GitHub 添加 Secrets

1. **访问仓库 Settings**
   ```
   https://github.com/lumaxiangshang/zuhio-keyword-count-checker/settings/secrets/actions
   ```

2. **添加 Cloudflare API Token**
   - 点击 **New repository secret**
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: `cfat_0HcuNEpintfBc7LkpmCwfeW6pE5alFsYrXeASXdU5bf8a476`
   - 点击 **Add secret**

3. **添加 Cloudflare Account ID**
   - 点击 **New repository secret**
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Value: `f6fd3e21ab61c8cabf313d192400127f`
   - 点击 **Add secret**

### 第 2 步：验证配置

添加完成后，你应该看到两个 Secrets：
- ✅ `CLOUDFLARE_API_TOKEN`
- ✅ `CLOUDFLARE_ACCOUNT_ID`

### 第 3 步：触发部署

推送代码到 main 分支会自动触发部署：

```bash
git add .
git commit -m "Trigger auto deployment"
git push origin main
```

### 第 4 步：查看部署状态

1. 访问 Actions 标签
   ```
   https://github.com/lumaxiangshang/zuhio-keyword-count-checker/actions
   ```

2. 查看最新的 workflow run
3. 点击查看详情
4. 等待部署完成（2-5 分钟）

---

## 🚀 部署成功后的 URL

```
https://zuhio-keyword-count-checker.pages.dev
```

---

## ⚠️ 如果 Token 格式有问题

如果部署失败，提示 Token 无效：

### 获取正确的 API Token

1. 访问：https://dash.cloudflare.com/profile/api-tokens
2. 点击 **Create Token**
3. 选择 **Edit Cloudflare Workers** 模板
4. 配置权限：
   - Account Cloudflare Pages: Edit ✅
   - Account Cloudflare Workers: Edit ✅
5. 点击 **Continue to summary**
6. 点击 **Create Token**
7. 复制 JWT 格式的 Token（以 `eyJ` 开头）
8. 更新 GitHub Secret

---

## 📋 已配置的工作流

文件：`.github/workflows/cloudflare-pages-deploy.yml`

**触发条件**：
- Push 到 main 分支
- Pull Request 到 main 分支

**执行步骤**：
1. Checkout 代码
2. 安装 Node.js 18
3. 安装依赖
4. 构建项目
5. 部署到 Cloudflare Pages

---

**现在请去 GitHub 添加 Secrets，然后推送代码触发自动部署！** 🚀
