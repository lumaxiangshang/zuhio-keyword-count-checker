# 🔐 Google OAuth 登录配置指南

## 步骤 1：创建 Firebase 项目

1. 访问 [Firebase 控制台](https://console.firebase.google.com)
2. 点击 **添加项目**
3. 输入项目名称：`zuhio-keyword-count-checker`
4. 启用/禁用 Google Analytics（可选）
5. 点击 **创建项目**

---

## 步骤 2：启用 Google 登录

1. 在左侧菜单选择 **Authentication**
2. 点击 **开始使用**（如果还未启用）
3. 在 **登录方法** 标签页，选择 **Google**
4. 点击启用，输入项目支持邮箱
5. 点击 **保存**

---

## 步骤 3：添加 Web 应用

1. 点击项目概览页的 **Web** 图标（`</>`）
2. 输入应用昵称：`Zuhio Web App`
3. 勾选 **同时设置 Firebase Hosting**（可选）
4. 点击 **注册应用**

---

## 步骤 4：复制配置

注册后会看到 Firebase 配置：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "zuhio-keyword-count-checker.firebaseapp.com",
  projectId: "zuhio-keyword-count-checker",
  storageBucket: "zuhio-keyword-count-checker.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

---

## 步骤 5：配置环境变量

在项目根目录创建 `.env.local` 文件：

```bash
# 复制 .env.example
cp .env.example .env.local

# 编辑 .env.local，填入你的配置
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=zuhio-keyword-count-checker.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=zuhio-keyword-count-checker
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=zuhio-keyword-count-checker.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

---

## 步骤 6：配置 Cloudflare Pages 环境变量

由于部署在 Cloudflare Pages，需要在控制台添加环境变量：

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Pages** → 选择项目
3. 点击 **Settings** → **Environment variables**
4. 点击 **Add variable**
5. 添加以下变量（production 和 preview 都要加）：

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `zuhio-keyword-count-checker.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `zuhio-keyword-count-checker` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `zuhio-keyword-count-checker.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `123456789012` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:123456789012:web:abcdef1234567890` |

6. 点击 **Save**

---

## 步骤 7：重新部署

环境变量配置完成后，触发新的部署：

```bash
# 本地构建并部署
npm run build
npx wrangler pages deploy out --project-name=zuhio-keyword-count-checker
```

或者在 Cloudflare Pages 控制台点击 **Retry deployment**

---

## 步骤 8：测试登录

1. 访问网站：https://zuhio-keyword-count-checker.pages.dev
2. 点击右上角 **Sign in with Google** 按钮
3. 选择 Google 账号登录
4. 登录后显示用户信息和头像
5. 点击 **Sign out** 退出登录

---

## 🔧 常见问题

### 1. 登录失败，提示 "Firebase: Error (auth/unauthorized-domain)"

**原因：** Firebase 未授权当前域名

**解决：**
1. 访问 Firebase 控制台 → Authentication → Settings
2. 在 **Authorized domains** 中添加你的域名
3. 例如：`zuhio-keyword-count-checker.pages.dev`

### 2. 环境变量不生效

**原因：** Cloudflare Pages 需要重新部署才能读取新环境变量

**解决：**
1. 在 Cloudflare Pages 控制台点击 **Retry deployment**
2. 或者本地执行 `npx wrangler pages deploy`

### 3. 本地测试

**本地开发时：**
```bash
# 创建 .env.local 文件
cp .env.example .env.local

# 编辑 .env.local 填入配置

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 测试

---

## 📊 用户数据使用

登录后可以在应用中访问用户信息：

```typescript
import { useAuth } from '@/lib/firebase';

const { user } = useAuth();

if (user) {
  console.log('用户邮箱:', user.email);
  console.log('用户名称:', user.displayName);
  console.log('用户头像:', user.photoURL);
  console.log('用户 ID:', user.uid);
}
```

---

## 🎯 后续功能建议

1. **用户历史记录** - 保存用户的分析历史
2. **个性化设置** - 保存用户偏好（语言、主题等）
3. **高级功能** - 登录用户专属功能（批量分析、导出报告等）
4. **订阅系统** - 付费订阅高级功能

---

**配置完成后，删除此文件！** 🚀
