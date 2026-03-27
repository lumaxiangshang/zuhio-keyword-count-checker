# ⚙️ Cloudflare Pages 环境变量配置

## 快速配置指南

### 方案一：控制台手动配置（推荐）

**1. 访问 Cloudflare 控制台**
```
https://dash.cloudflare.com/?to=/:account/pages
```

**2. 选择项目**
- 项目名：`zuhio-keyword-count-checker`

**3. 进入环境变量设置**
- 点击 **Settings** → **Environment variables**

**4. 添加环境变量**

点击 **Add variable**，依次添加以下 7 个变量：

| Variable Name | Value |
|---------------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyBgP_Oy5KTYfsEyNiXrtXwSAp1tztOuDyM` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `zuhio-keyword-count-checker.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `zuhio-keyword-count-checker` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `zuhio-keyword-count-checker.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `289541466359` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:289541466359:web:e6105f849bd6a5df90cbf2` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-CTZEVL2EWZ` |

**重要：** Production 和 Preview 环境都要添加！

**5. 保存并重新部署**
- 点击 **Save** 保存
- 进入 **Deployments** 页面
- 点击 **Retry deployment** 重新部署

---

### 方案二：使用 Wrangler CLI（高级）

如果你安装了 Wrangler CLI，可以用命令配置：

```bash
# 安装 Wrangler（如果还没安装）
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 配置 Production 环境变量
wrangler pages secret put NEXT_PUBLIC_FIREBASE_API_KEY --project-name=zuhio-keyword-count-checker
# 粘贴：AIzaSyBgP_Oy5KTYfsEyNiXrtXwSAp1tztOuDyM

wrangler pages secret put NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN --project-name=zuhio-keyword-count-checker
# 粘贴：zuhio-keyword-count-checker.firebaseapp.com

wrangler pages secret put NEXT_PUBLIC_FIREBASE_PROJECT_ID --project-name=zuhio-keyword-count-checker
# 粘贴：zuhio-keyword-count-checker

wrangler pages secret put NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET --project-name=zuhio-keyword-count-checker
# 粘贴：zuhio-keyword-count-checker.firebasestorage.app

wrangler pages secret put NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID --project-name=zuhio-keyword-count-checker
# 粘贴：289541466359

wrangler pages secret put NEXT_PUBLIC_FIREBASE_APP_ID --project-name=zuhio-keyword-count-checker
# 粘贴：1:289541466359:web:e6105f849bd6a5df90cbf2

wrangler pages secret put NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID --project-name=zuhio-keyword-count-checker
# 粘贴：G-CTZEVL2EWZ
```

---

## ✅ 验证配置

配置完成后，验证环境变量是否生效：

**1. 检查部署日志**
- 访问 Cloudflare Pages → Deployments
- 查看最新部署的日志
- 确认没有环境变量相关的错误

**2. 测试登录功能**
- 访问网站：https://zuhio-keyword-count-checker.pages.dev
- 点击右上角 **Sign in with Google** 按钮
- 如果能弹出 Google 登录窗口，说明配置成功！

---

## 🔧 Firebase 授权域名

**重要：** 还需要在 Firebase 控制台授权域名！

**步骤：**

1. 访问 [Firebase Console](https://console.firebase.google.com)
2. 选择项目：`zuhio-keyword-count-checker`
3. 左侧菜单：**Authentication** → **Settings**
4. 找到 **Authorized domains** 部分
5. 点击 **Add domain**
6. 添加以下域名：
   - `zuhio-keyword-count-checker.pages.dev`
   - `localhost`（本地开发用）
7. 点击 **Save**

---

## 📊 环境变量说明

| 变量 | 说明 | 示例 |
|------|------|------|
| `API_KEY` | Firebase API 密钥 | `AIzaSyBgP_Oy5KTYfsEyNiXrtXwSAp1tztOuDyM` |
| `AUTH_DOMAIN` | 认证域名 | `project.firebaseapp.com` |
| `PROJECT_ID` | 项目 ID | `zuhio-keyword-count-checker` |
| `STORAGE_BUCKET` | 存储桶 | `project.firebasestorage.app` |
| `MESSAGING_SENDER_ID` | 消息发送者 ID | `289541466359` |
| `APP_ID` | 应用 ID | `1:289541466359:web:xxx` |
| `MEASUREMENT_ID` | Google Analytics ID | `G-CTZEVL2EWZ` |

---

## ⚠️ 常见问题

### 1. 登录失败：`auth/unauthorized-domain`

**原因：** Firebase 未授权当前域名

**解决：**
- Firebase 控制台 → Authentication → Settings
- Authorized domains 添加你的域名

### 2. 环境变量不生效

**原因：** 环境变量只在新的部署中生效

**解决：**
- 重新触发部署（Retry deployment）
- 或者推送新的代码

### 3. 本地开发如何测试？

**方法：**
```bash
# 在项目根目录创建 .env.local 文件
cat > .env.local << 'ENVEOF'
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBgP_Oy5KTYfsEyNiXrtXwSAp1tztOuDyM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=zuhio-keyword-count-checker.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=zuhio-keyword-count-checker
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=zuhio-keyword-count-checker.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=289541466359
NEXT_PUBLIC_FIREBASE_APP_ID=1:289541466359:web:e6105f849bd6a5df90cbf2
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-CTZEVL2EWZ
ENVEOF

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 测试

---

## 🎯 下一步

环境变量配置完成后：

1. ✅ 测试 Google 登录功能
2. ✅ 验证用户信息显示
3. ✅ 测试登出功能
4. ✅ 检查移动端适配

**配置完成后可以删除此文件！** 🚀

---

**最后更新：** 2026-03-28  
**项目：** Zuhio Keyword Count Checker
