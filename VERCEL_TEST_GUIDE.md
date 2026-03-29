# 🧪 Vercel 完整功能测试指南

**最后更新：** 2026-03-29 12:50 GMT+8  
**适用对象：** 不熟悉 Vercel 的开发者  
**预计时间：** 15-20 分钟

---

## 📋 测试前准备

### 1. 确认部署状态

访问 Vercel Dashboard：
```
https://vercel.com/lumaxiangshang-6334s-projects/zuhio-keyword-count-checker
```

**检查点：**
- [ ] 最新部署状态是 **Ready**（绿色✓）
- [ ] 没有失败的部署（红色✗）
- [ ] 部署时间最近（说明代码已更新）

**如果部署失败：**
1. 点击失败的部署
2. 查看 **Build Logs**
3. 找到错误信息（通常在底部）
4. 截图发给我修复

---

## 🎯 测试流程（按顺序执行）

### 第一步：访问生产网站（2 分钟）

#### 1.1 打开生产 URL

在浏览器中访问：
```
https://zuhiokeywordcountchecker.shop
```

**预期结果：**
- ✅ 网站正常加载
- ✅ 看到紫色渐变背景
- ✅ 顶部有 Zuhio Logo 和导航
- ✅ 中间有大文本框用于输入内容

**可能的问题：**
- ❌ 404 错误 → 域名未正确配置
- ❌ 空白页面 → JavaScript 错误，打开控制台查看
- ❌ 加载很慢 → Vercel 部署区域问题

#### 1.2 打开浏览器开发者工具

**Chrome/Edge:**
- 按 `F12` 或 `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- 点击 **Console** 标签

**检查点：**
- [ ] 没有红色错误（Error）
- [ ] 可能有黄色警告（Warning），这个可以忽略

**如果有红色错误：**
- 截图错误信息
- 发给我分析

---

### 第二步：测试核心功能 - 关键词密度分析（3 分钟）

#### 2.1 输入测试文本

在文本框中输入以下内容（英文）：

```
SEO writing is important for website ranking. Good SEO writing helps search engines understand your content. 
When you write SEO content, you should focus on keyword density. SEO writing requires practice and patience.
```

#### 2.2 输入关键词

在关键词输入框中输入：
```
SEO writing
```

#### 2.3 检查结果

**应该显示：**
- ✅ 总字数（Word Count）
- ✅ 关键词出现次数
- ✅ 关键词密度百分比
- ✅ 密度状态提示（Too Low / Good / Too High）

**预期密度：** 约 2.5-3%（绿色 "Good" 状态）

**测试不同状态：**

| 测试场景 | 操作 | 预期结果 |
|---------|------|---------|
| 密度过低 | 输入很少的关键词 | 红色 "Too Low" |
| 密度正常 | 密度 0.5-4% | 绿色 "Good" |
| 密度过高 | 重复关键词很多次 | 红色 "Too High" |

---

### 第三步：测试 Google 登录（5 分钟）

⚠️ **前提：** 已完成 Firebase 配置（授权域名 + 启用 Google 登录）

#### 3.1 点击登录按钮

在页面右上角找到：
- **按钮文字：** "Sign in with Google"
- **按钮样式：** 白色背景，带 Google 彩色 Logo

#### 3.2 完成 Google 登录

1. 点击后会弹出 Google 登录窗口
2. 选择你的 Google 账号
3. 授权应用访问基本信息
4. 等待页面跳转

**预期结果：**
- ✅ 登录成功后显示用户头像和邮箱
- ✅ 页面可能跳转到 `/dashboard`
- ✅ 浏览器 Console 没有错误

**可能遇到的错误：**

| 错误信息 | 原因 | 解决方法 |
|---------|------|---------|
| `auth/unauthorized-domain` | 域名未授权 | 在 Firebase Console 添加域名 |
| `popup-closed-by-user` | 浏览器阻止 popup | 允许 popup 或改用 redirect |
| `auth/configuration-not-found` | Firebase 配置错误 | 检查 Firebase 项目 ID |

#### 3.3 检查登录状态

登录后应该看到：
- ✅ 用户头像（如果有）
- ✅ 用户邮箱或昵称
- ✅ "Sign out" 按钮

**测试登出：**
1. 点击 "Sign out"
2. 应该返回未登录状态
3. 刷新页面保持登出状态

---

### 第四步：测试 PayPal 支付配置（5 分钟）

#### 4.1 访问支付配置 API

在浏览器地址栏输入：
```
https://zuhiokeywordcountchecker.shop/api/paypal/config
```

**预期结果（JSON）：**
```json
{
  "clientId": "AevvA8o2Kppx2FwFBom4Q6ZzPCTdxCKkeRI2ZBVgerfRZqcvDUWLKYvrLTWK_SBoabipvGH5wBa_1iGw",
  "plans": {
    "proMonthly": "P-1AK67303R1503452TNHDOITQ",
    "proYearly": "P-9BF18630VW4069643NHDOITY",
    "businessMonthly": "P-56W56046144411137NHDOITY",
    "businessYearly": "P-94F994413Y785902JNHDOIUA"
  },
  "apiUrl": "https://api-m.sandbox.paypal.com"
}
```

**检查点：**
- [ ] 返回有效的 JSON（不是 HTML 错误页面）
- [ ] `clientId` 不为空
- [ ] `plans` 包含所有订阅计划 ID
- [ ] `apiUrl` 是 sandbox 环境

**如果返回 404：**
- API 路由未正确部署
- 需要检查 Vercel 部署日志

**如果返回 500：**
- 服务器错误
- 打开浏览器 Console 查看详细错误

#### 4.2 访问积分购买页面

访问：
```
https://zuhiokeywordcountchecker.shop/credits
```

**预期内容：**
- ✅ 显示积分包选项
- ✅ 显示价格（USD）
- ✅ 有 PayPal 支付按钮

#### 4.3 测试 PayPal 按钮（可选，需要沙箱账号）

⚠️ **警告：** 这一步需要 PayPal 沙箱测试账号

**测试步骤：**
1. 选择一个积分包
2. 点击 "Buy with PayPal" 按钮
3. 应该跳转到 PayPal 沙箱页面
4. 使用沙箱买家账号登录
5. 完成支付流程
6. 应该跳转回成功页面

**可能的问题：**
- ❌ 按钮点击无反应 → JavaScript 错误
- ❌ 跳转到错误页面 → URL 配置错误
- ❌ 支付失败 → PayPal 凭证问题

---

### 第五步：检查 Vercel 部署日志（3 分钟）

#### 5.1 访问部署详情

1. 打开 Vercel Dashboard：
   ```
   https://vercel.com/lumaxiangshang-6334s-projects/zuhio-keyword-count-checker
   ```

2. 点击最新的部署（通常在列表顶部）

#### 5.2 查看构建日志

1. 点击 **Build Logs** 标签
2. 从上到下滚动查看

**关键检查点：**

| 阶段 | 应该看到 | 不应该看到 |
|------|---------|-----------|
| Setup | "Cloning github.com/..." | "Failed to clone" |
| Build | "Running build command" | "Build failed" |
| Install | "npm install completed" | "npm ERR!" |
| Prisma | "Prisma schema loaded" | "Prisma migration failed" |
| Deploy | "Deployment completed" | "Deployment failed" |

#### 5.3 检查环境变量

1. 点击 **Settings** → **Environment Variables**
2. 检查是否有以下变量：

**必须有的变量：**
- [ ] `DATABASE_URL`
- [ ] `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
- [ ] `PAYPAL_SECRET`
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_BASE_URL`

**如果变量缺失：**
1. 点击 **Add New**
2. 填写变量名和值
3. 选择环境（Production）
4. 保存后重新部署

---

## 📊 测试结果记录表

复制以下表格，填写测试结果：

```markdown
## 测试结果

**测试时间：** 2026-03-29 __:__

### 基础功能
- [ ] 网站正常加载
- [ ] 无 JavaScript 错误
- [ ] 关键词分析功能正常

### Google 登录
- [ ] 可以点击登录按钮
- [ ] Google 登录窗口弹出
- [ ] 登录成功并显示用户信息
- [ ] 登出功能正常
- 遇到的错误：___________

### PayPal 配置
- [ ] /api/paypal/config 返回 JSON
- [ ] clientId 不为空
- [ ] /credits 页面正常
- [ ] PayPal 按钮可见
- 遇到的错误：___________

### Vercel 部署
- [ ] 部署状态 Ready
- [ ] 构建日志无错误
- [ ] 环境变量已配置
- 遇到的问题：___________

### 截图
（在此粘贴重要截图）
```

---

## 🚨 常见问题快速解决

### 问题 1: 网站显示 404

**原因：** 域名未配置或部署失败

**解决：**
1. 检查 Vercel 部署状态
2. 确认域名在 Vercel 中已添加
3. 查看 DNS 解析是否正确

### 问题 2: 页面空白或加载失败

**原因：** JavaScript 错误或资源加载失败

**解决：**
1. 打开浏览器 Console（F12）
2. 查看红色错误信息
3. 截图发给我分析

### 问题 3: Google 登录失败

**原因：** Firebase 配置问题

**解决：**
1. 确认 Firebase Console 已启用 Google 登录
2. 确认域名已添加到 Authorized domains
3. 检查 Firebase 配置是否正确

### 问题 4: PayPal API 返回 404

**原因：** API 路由未部署

**解决：**
1. 检查 Vercel 构建日志
2. 确认 `app/api/paypal` 目录存在
3. 重新触发部署

### 问题 5: 环境变量未生效

**原因：** 变量未配置或作用域错误

**解决：**
1. 在 Vercel Settings → Environment Variables 检查
2. 确认变量作用域包含 Production
3. 重新部署使变量生效

---

## 📞 需要帮助时

测试完成后，告诉我：

1. **哪些功能正常** ✅
2. **哪些功能失败** ❌
3. **具体的错误信息**（截图或复制文字）
4. **浏览器 Console 的错误**（如果有）

我会根据测试结果继续修复！

---

## 🎯 测试优先级

如果时间有限，按以下顺序测试：

**P0 - 必须测试（核心功能）：**
1. ✅ 网站能否正常访问
2. ✅ 关键词密度分析是否工作
3. ✅ `/api/paypal/config` 是否返回 JSON

**P1 - 重要功能：**
4. ✅ Google 登录是否工作
5. ✅ 环境变量是否配置

**P2 - 可选测试：**
6. ⭕ 完整支付流程（需要沙箱账号）
7. ⭕ 用户仪表板功能

---

**开始测试吧！有任何问题随时告诉我。** 🚀
