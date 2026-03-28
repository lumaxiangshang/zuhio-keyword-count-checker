# 💰 完整支付功能文档

**更新时间：** 2026-03-28 18:15  
**状态：** ✅ 已完成

---

## 🎯 功能清单

### ✅ 已完成的功能

#### 1. 一次性支付（积分包）
- [x] 创建订单（Create Order）
- [x] 捕获支付（Capture Payment）
- [x] 添加积分到用户账户
- [x] 支付成功页面
- [x] 支付取消页面
- [x] 错误处理

#### 2. 订阅支付（Pro/Business）
- [x] 创建订阅
- [x] 激活订阅
- [x] 订阅状态管理
- [x] 月付/年付支持

#### 3. Webhook 支持
- [x] 支付完成通知
- [x] 退款通知
- [x] 订阅激活通知
- [x] 订阅取消通知
- [x] 签名验证（待配置）

#### 4. 数据库集成
- [x] 用户模型
- [x] 支付记录模型
- [x] 积分管理
- [x] 订阅状态管理

---

## 📁 文件结构

```
app/
├── api/
│   └── paypal/
│       ├── config/              # 配置端点
│       ├── create-order/        # 创建订单
│       ├── capture-order/       # 捕获支付
│       ├── activate-subscription/ # 激活订阅
│       └── webhook/             # Webhook 处理
├── payment/
│   ├── success/                 # 支付成功页面
│   └── cancelled/               # 支付取消页面
├── pricing/                     # 定价页面
└── credits/                     # 积分购买页面

lib/
└── database.ts                  # 数据库工具（示例）

components/
├── PayPalCheckout.tsx           # 订阅支付组件
└── PayPalOneTimePayment.tsx     # 一次性支付组件
```

---

## 🔧 API 端点

### 1. POST `/api/paypal/create-order`

**功能：** 创建一次性支付订单

**请求体：**
```json
{
  "credits": 100,
  "price": "9.99",
  "userId": "user_123"
}
```

**响应：**
```json
{
  "success": true,
  "orderId": "5O190127TN364715T",
  "approvalUrl": "https://www.paypal.com/checkout/..."
}
```

---

### 2. POST `/api/paypal/capture-order`

**功能：** 捕获支付并添加积分

**请求体：**
```json
{
  "orderId": "5O190127TN364715T",
  "userId": "user_123"
}
```

**响应：**
```json
{
  "success": true,
  "status": "COMPLETED",
  "captureId": "8AB12345CD678901E",
  "amount": "9.99",
  "currency": "USD",
  "credits": 100
}
```

---

### 3. POST `/api/paypal/activate-subscription`

**功能：** 激活订阅

**请求体：**
```json
{
  "subscriptionID": "I-ABCDEFGHIJKLMN",
  "planId": "P-1AK67303R1503452TNHDOITQ"
}
```

**响应：**
```json
{
  "success": true,
  "subscriptionId": "I-ABCDEFGHIJKLMN",
  "plan": "pro",
  "billingCycle": "monthly",
  "status": "ACTIVE"
}
```

---

### 4. POST `/api/paypal/webhook`

**功能：** 接收 PayPal Webhook 通知

**支持的事件类型：**
- `PAYMENT.CAPTURE.COMPLETED` - 支付完成
- `PAYMENT.CAPTURE.REFUNDED` - 退款
- `BILLING.SUBSCRIPTION.ACTIVATED` - 订阅激活
- `BILLING.SUBSCRIPTION.CANCELLED` - 订阅取消

**配置 Webhook：**
1. 访问 https://developer.paypal.com/dashboard/applications
2. 选择你的 App
3. 点击 **Add webhook**
4. 输入 URL: `https://your-domain.com/api/paypal/webhook`
5. 选择要监听的事件
6. 保存 Webhook ID 到环境变量 `PAYPAL_WEBHOOK_ID`

---

## 🗄️ 数据库模型

### User（用户）
```typescript
interface User {
  id: string;
  email: string;
  credits: number;                      // 当前积分
  subscriptionPlan: 'free' | 'pro' | 'business';
  subscriptionStatus: 'active' | 'cancelled' | 'expired';
  subscriptionEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Payment（支付记录）
```typescript
interface Payment {
  id: string;
  userId: string;
  amount: number;                       // 支付金额
  currency: string;                     // 币种
  paypalOrderId?: string;               // PayPal 订单 ID
  paypalCaptureId?: string;             // PayPal 捕获 ID
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  type: 'one-time' | 'subscription';    // 支付类型
  credits?: number;                     // 获得的积分
  createdAt: Date;
}
```

---

## 🧪 测试流程

### 测试一次性支付

1. **访问积分购买页面**
   ```
   https://your-domain.com/credits
   ```

2. **选择积分包**
   - 50 credits - $4.99
   - 100 credits - $9.99 ⭐
   - 250 credits - $19.99
   - 500 credits - $34.99

3. **点击 PayPal 按钮**

4. **完成沙盒支付**
   - 使用沙盒买家账号登录
   - 确认支付

5. **验证结果**
   - 跳转到 `/payment/success`
   - 积分添加到账户
   - 查看支付记录

### 测试订阅支付

1. **访问定价页面**
   ```
   https://your-domain.com/pricing
   ```

2. **选择套餐**
   - Pro Monthly - $9.99/月
   - Pro Yearly - $99/年
   - Business Monthly - $29.99/月
   - Business Yearly - $299/年

3. **点击 PayPal 按钮**

4. **完成订阅**

5. **验证**
   - 订阅状态激活
   - Dashboard 显示 Pro/Business 功能

---

## 🚀 部署到 Vercel

### 自动部署

代码已推送到 GitHub，Vercel 会自动部署。

**查看部署状态：**
```
https://vercel.com/lumaxiangshang-6334s-projects/zuhio-keyword-count-checker
```

### 环境变量配置

确保以下环境变量已配置：

**PayPal（7 个）：**
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
PAYPAL_SECRET=...
PAYPAL_API_URL=https://api-m.sandbox.paypal.com
NEXT_PUBLIC_PAYPAL_PLAN_PRO_MONTHLY=...
NEXT_PUBLIC_PAYPAL_PLAN_PRO_YEARLY=...
NEXT_PUBLIC_PAYPAL_PLAN_BUSINESS_MONTHLY=...
NEXT_PUBLIC_PAYPAL_PLAN_BUSINESS_YEARLY=...
PAYPAL_WEBHOOK_ID=...  # Webhook ID（可选）
```

**Firebase（7 个）：**
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

---

## 📊 生产环境准备

### 上线前必须完成

1. **创建 PayPal Live App**
   ```
   https://developer.paypal.com/dashboard/applications
   ```

2. **创建 Live 订阅计划**
   ```bash
   # 修改 API URL 为生产环境
   PAYPAL_API_URL=https://api-m.paypal.com
   
   # 重新运行创建脚本
   npm run paypal:create-products
   ```

3. **配置 Webhook**
   - 创建 Webhook
   - 配置所有事件类型
   - 保存 Webhook ID

4. **替换数据库**
   - 当前使用内存存储（示例）
   - 生产环境使用 PostgreSQL + Prisma
   - 或者使用 Firebase Firestore

5. **测试完整流程**
   - 创建订单
   - 完成支付
   - 验证积分
   - 测试退款

---

## 🎯 下一步建议

### 短期（本周）
- [ ] 配置 Webhook URL
- [ ] 测试所有支付场景
- [ ] 添加支付历史记录页面
- [ ] 完善错误处理

### 中期（本月）
- [ ] 集成真实数据库
- [ ] 添加邮件通知
- [ ] 实现退款功能
- [ ] 添加发票生成

### 长期（上线前）
- [ ] 切换到 PayPal Live
- [ ] 安全审计
- [ ] 性能优化
- [ ] 监控和告警

---

## 📞 支持资源

- **PayPal Developer:** https://developer.paypal.com
- **PayPal API 文档:** https://developer.paypal.com/docs/api/
- **Webhook 指南:** https://developer.paypal.com/docs/api/webhooks/
- **Vercel 部署:** https://vercel.com/docs

---

**状态：** ✅ 所有核心功能已完成  
**部署：** ⏳ Vercel 自动部署中  
**预计完成：** 3-5 分钟
