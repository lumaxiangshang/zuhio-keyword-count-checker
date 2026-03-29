# 🚨 紧急修复指南 - PayPal 支付问题

**时间：** 2026-03-29 16:55 GMT+8  
**状态：** ⚠️ 需要立即操作

---

## 🔴 当前问题

### 错误信息
```
POST https://zuhiokeywordcountchecker.shop/api/paypal/create-order 405 (Method Not Allowed)
Failed to execute 'json' on 'Response': Unexpected end of JSON input
```

### 问题原因

1. **浏览器缓存** - 前端代码还在调用旧的 API 路径
2. **Vercel 部署未完成** - 新的 `create-order-lite` API 还未生效
3. **数据库未初始化** - Prisma 表结构未创建

---

## ✅ 立即解决方案（按顺序执行）

### 第 1 步：清除浏览器缓存（30 秒）

**强制刷新页面：**
- Windows: `Ctrl + Shift + R` 或 `Ctrl + F5`
- Mac: `Cmd + Shift + R`

**或者清除缓存：**
1. 按 `F12` 打开开发者工具
2. 右键点击刷新按钮
3. 选择 "Empty Cache and Hard Reload"

---

### 第 2 步：检查 Vercel 部署状态（1 分钟）

访问：
```
https://vercel.com/lumaxiangshang-6334s-projects/zuhio-keyword-count-checker
```

**确认：**
- [ ] 最新部署状态是 **Ready**（绿色✓）
- [ ] 部署时间是最近的
- [ ] 没有失败的部署

**如果还在 Building：** 等待 2-3 分钟

**如果部署失败：** 点击查看详情，截图发给我

---

### 第 3 步：初始化数据库（5 分钟）

#### 方案 A：使用 Vercel 自动迁移（推荐）

Vercel 会在部署时自动运行 `prisma migrate deploy`，检查部署日志：

1. 点击最新部署
2. 查看 **Build Logs**
3. 搜索 `prisma migrate` 关键字
4. 确认迁移成功

#### 方案 B：手动运行迁移（如果自动失败）

在本地运行：

```bash
cd /root/.openclaw/workspace/zuhio-keyword-count-checker

# 设置环境变量
export DATABASE_URL="postgresql://postgres.ikmnnmurlleldzszgddc:qXsYiXmFrMUDaP6K@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"

# 运行迁移
npx prisma migrate deploy

# 生成 Prisma Client
npx prisma generate
```

---

### 第 4 步：测试 API（2 分钟）

#### 测试 1: 检查 API 路径

在浏览器 Console 中运行：

```javascript
// 测试新 API
fetch('/api/paypal/create-order-lite', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ credits: 100, price: 9.99 })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

**预期结果：**
```json
{
  "success": true,
  "orderId": "5X...",
  "approvalUrl": "https://..."
}
```

#### 测试 2: 检查前端调用

在 Console 中检查：

```javascript
// 查看页面加载了哪个脚本
document.querySelectorAll('script[src*="page-"]').forEach(s => console.log(s.src));
```

---

## 🗄️ 数据库完整方案

### 数据库表结构

已创建完整的 Prisma Schema，包含：

1. **User** - 用户表
   - 积分系统
   - 订阅状态
   - Google 登录信息

2. **Payment** - 支付记录
   - PayPal 订单 ID
   - 支付类型（一次性/订阅）
   - 积分数量

3. **Subscription** - 订阅记录
   - 订阅计划
   - 账单周期
   - 订阅状态

4. **WebhookLog** - Webhook 日志
   - PayPal 事件记录
   - 处理状态

### 插入测试数据

创建种子脚本 `scripts/seed-db.ts`：

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 创建测试用户
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      credits: 100,
      subscriptionPlan: 'PRO',
      subscriptionStatus: 'ACTIVE',
    },
  });

  console.log('Created user:', user);

  // 创建测试支付记录
  const payment = await prisma.payment.create({
    data: {
      userId: user.id,
      amount: 9.99,
      currency: 'USD',
      paymentType: 'ONE_TIME',
      status: 'COMPLETED',
      credits: 100,
      paypalOrderId: 'test-order-123',
    },
  });

  console.log('Created payment:', payment);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

运行种子脚本：

```bash
npx ts-node scripts/seed-db.ts
```

---

## 🎯 完整测试流程

### 1. 清除缓存后重新访问

```
https://zuhiokeywordcountchecker.shop/credits
```

### 2. 打开浏览器 Console（F12）

查看加载的脚本，确认不是缓存版本

### 3. 点击 PayPal 按钮

应该看到：
- ✅ PayPal 按钮正常渲染
- ✅ 点击后调用 `/api/paypal/create-order-lite`
- ✅ 返回 orderId
- ✅ 跳转到 PayPal 沙箱页面

### 4. 检查 Network 标签

在开发者工具的 **Network** 标签中：
- 找到 `create-order-lite` 请求
- 状态码应该是 **200**
- 响应应该是 JSON

---

## 📋 检查清单

完成以下检查：

```
### 浏览器端
- [ ] 清除了浏览器缓存
- [ ] 强制刷新了页面（Ctrl+F5）
- [ ] Console 没有 405 错误
- [ ] Console 显示调用 create-order-lite

### Vercel 部署
- [ ] 部署状态是 Ready
- [ ] 部署时间是最近的
- [ ] Build Logs 没有错误
- [ ] Prisma 迁移成功

### 数据库
- [ ] 数据库表已创建
- [ ] Prisma Client 已生成
- [ ] 可以正常连接数据库

### 支付功能
- [ ] PayPal 按钮显示正常
- [ ] 点击按钮有反应
- [ ] 成功创建订单
- [ ] 跳转到 PayPal 页面
```

---

## 🚨 如果还有问题

### 问题 1: 仍然调用旧的 API

**解决：**
```javascript
// 在 Console 中手动测试新 API
window.location.href = '/credits?nocache=' + Date.now();
```

### 问题 2: API 返回 404

**原因：** Vercel 部署未完成

**解决：** 等待部署完成，刷新页面

### 问题 3: API 返回 500

**原因：** 数据库连接问题

**解决：** 检查 DATABASE_URL 环境变量

---

## 📞 立即执行

1. **立即清除浏览器缓存**（Ctrl+Shift+R）
2. **检查 Vercel 部署状态**
3. **重新测试支付功能**
4. **告诉我结果**

---

**执行完后立即告诉我测试结果！** 🚀
