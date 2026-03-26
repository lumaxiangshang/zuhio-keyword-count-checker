# 🌐 域名配置指南 - zuhiokeywordcountchecker.shop

## ⚠️ 重要说明

你的 Token 格式无法通过 API 验证，但可以通过 **Cloudflare 控制台网页** 完成域名配置。

---

## 📋 方案一：Cloudflare 控制台配置（推荐）

### 第 1 步：添加域名到 Cloudflare

1. **访问 Cloudflare Dashboard**
   ```
   https://dash.cloudflare.com/sign-up/domains
   ```

2. **输入域名**
   ```
   zuhiokeywordcountchecker.shop
   ```

3. **选择套餐**
   - 选择 **Free** 套餐（免费）
   - 点击 **Continue**

4. **确认 DNS 记录**
   - Cloudflare 会自动扫描现有 DNS 记录
   - 如果没有记录，显示为空

5. **获取 Nameservers**
   - Cloudflare 会显示两个 Nameservers
   - 例如：
     ```
     ns1.cloudflare.com
     ns2.cloudflare.com
     ```

---

### 第 2 步：在域名注册商处更新 Nameservers

**在你的域名注册商处操作**（GoDaddy、Namecheap、阿里云等）：

1. 登录域名注册商账户
2. 找到域名管理 → `zuhiokeywordcountchecker.shop`
3. 点击 **修改 DNS 服务器** / **Change Nameservers**
4. 选择 **自定义 DNS 服务器**
5. 输入 Cloudflare 提供的两个 Nameservers
6. 保存更改

**常见注册商的 Nameserver 修改位置**：

| 注册商 | 操作路径 |
|--------|---------|
| **GoDaddy** | Domain Settings → DNS → Nameservers → Change |
| **Namecheap** | Domain List → Manage → Nameservers → Custom DNS |
| **阿里云** | 域名控制台 → DNS 修改 → 修改 DNS 服务器 |
| **腾讯云** | 域名注册 → DNS 修改 → 修改 DNS 服务器 |

---

### 第 3 步：等待 DNS 传播

- DNS 更改通常需要 **15 分钟 - 48 小时** 生效
- 大多数情况下 **30 分钟内** 生效
- 可以在 Cloudflare 控制台查看状态

---

### 第 4 步：绑定到 Cloudflare Pages

DNS 生效后，在 Cloudflare 控制台绑定域名：

1. **访问 Pages 项目**
   ```
   https://dash.cloudflare.com/?to=/:account/pages/project/zuhio-keyword-count-checker
   ```

2. **点击 Custom domains** 标签

3. **点击 Add custom domain**

4. **输入域名**
   ```
   zuhiokeywordcountchecker.shop
   ```

5. **点击 Add domain**

6. **自动配置 DNS**
   - Cloudflare 会自动创建必要的 DNS 记录
   - 状态显示为 **Active** 即完成

---

### 第 5 步：配置 WWW 子域名（可选）

如果需要 `www.zuhiokeywordcountchecker.shop` 也指向网站：

1. 在 Pages 项目的 **Custom domains** 页面
2. 点击 **Add custom domain**
3. 输入：`www.zuhiokeywordcountchecker.shop`
4. 点击 **Add domain**
5. 启用 **Redirect www to root**（重定向到主域名）

---

## 🔧 方案二：API 自动配置（需要正确的 Token）

如果你获取了正确的 JWT 格式 API Token，我可以帮你自动配置。

### 获取正确的 API Token

1. 访问：https://dash.cloudflare.com/profile/api-tokens
2. 点击 **Create Token**
3. 选择 **Edit Cloudflare Workers** 模板
4. 配置权限：
   - Account Cloudflare Pages: Edit ✅
   - Account Cloudflare Workers: Edit ✅
   - Zone: Edit ✅（用于 DNS 管理）
5. 点击 **Create Token**
6. 复制 JWT 格式的 Token（以 `eyJ` 开头）
7. 告诉我新 Token

---

## 📊 DNS 记录说明

绑定域名后，Cloudflare 会自动创建以下 DNS 记录：

| 类型 | 名称 | 内容 | 说明 |
|------|------|------|------|
| CNAME | @ | zuhio-keyword-count-checker.pages.dev | 主域名 |
| CNAME | www | zuhio-keyword-count-checker.pages.dev | WWW 子域名 |

---

## 🎯 完整配置流程

```
1. 添加域名到 Cloudflare
   ↓
2. 获取 Nameservers
   ↓
3. 在注册商处更新 Nameservers
   ↓
4. 等待 DNS 传播（15 分钟 - 48 小时）
   ↓
5. 在 Pages 项目绑定域名
   ↓
6. 配置完成！
```

---

## 🌐 访问 URL

配置完成后，可以通过以下 URL 访问：

| 类型 | URL |
|------|-----|
| **原始 URL** | https://zuhio-keyword-count-checker.pages.dev |
| **自定义域名** | https://zuhiokeywordcountchecker.shop |
| **WWW** | https://www.zuhiokeywordcountchecker.shop |

---

## ⚙️ SSL/HTTPS 配置

Cloudflare 会自动为自定义域名配置 SSL 证书：

- ✅ 自动签发 SSL 证书
- ✅ 强制 HTTPS 重定向
- ✅ 证书自动续期

无需手动配置！

---

## 🔍 验证配置

### 检查 DNS 是否生效

```bash
# 使用 nslookup 检查
nslookup zuhiokeywordcountchecker.shop

# 或使用在线工具
https://dnschecker.org/
```

### 检查 Cloudflare 状态

访问 Cloudflare Dashboard：
```
https://dash.cloudflare.com/?to=/:account/pages/project/zuhio-keyword-count-checker
```

查看域名状态：
- ✅ Active = 配置成功
- ⏳ Pending = 等待 DNS 传播
- ❌ Error = 需要检查配置

---

## 🛠️ 常见问题

### Q: DNS 传播太慢怎么办？

**A**: 
- 等待 15-30 分钟
- 清除本地 DNS 缓存
- 使用公共 DNS（如 8.8.8.8）

### Q: 域名显示"Already managed by another account"

**A**: 
- 域名已在其他 Cloudflare 账户
- 需要从原账户移除
- 或联系 Cloudflare 支持

### Q: SSL 证书未生效

**A**: 
- 等待证书签发（通常 5-10 分钟）
- 检查 DNS 是否正确配置
- 清除浏览器缓存

---

## 📞 需要帮助？

**如果在配置过程中遇到问题：**
1. 截图错误信息
2. 告诉我卡在哪一步
3. 我会立即帮你解决

**或者，提供正确的 JWT 格式 API Token，我可以帮你自动配置！**

---

## 🚀 立即开始

### 第一步：添加域名到 Cloudflare

```
https://dash.cloudflare.com/sign-up/domains
```

输入域名：`zuhiokeywordcountchecker.shop`

---

**现在就开始配置吧！预计 30 分钟完成！** 🎉
