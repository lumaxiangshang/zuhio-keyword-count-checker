# 🅿️ PayPal 支付集成指南

---

## 📋 步骤 1：创建 PayPal Business 账号

1. **访问** https://www.paypal.com/business
2. **注册 Business 账号**
   - 选择"Business Account"
   - 填写公司信息
   - 完成邮箱验证
3. **升级到 Business**（如果是个人账号）
   - Settings → Account Settings
   - Upgrade to Business

---

## 🔑 步骤 2：创建 PayPal App

1. **访问 PayPal Developer Dashboard**
   ```
   https://developer.paypal.com/dashboard/applications
   ```

2. **登录**（使用 Business 账号）

3. **创建 App**
   - 点击 **Create App**
   - App Name: `Zuhio Keyword Checker`
   - App Type: **Merchant**
   - 点击 **Create App**

4. **获取凭证**
   - **Client ID**（复制保存）
   - **Secret**（点击 Show 复制保存）

---

## 📦 步骤 3：创建订阅计划（Billing Plans）

### 方法一：通过 PayPal Dashboard 创建

1. **访问** https://developer.paypal.com/dashboard/products
2. **启用订阅功能**
   - 找到 **Subscriptions** 产品
   - 点击 **Enable**
3. **创建计划**
   - 点击 **Create Plan**
   - 填写计划信息：

**Pro Monthly Plan:**
```
Product: Zuhio Pro
Name: Pro Monthly
Description: Monthly subscription for Zuhio Pro
Billing Cycle:
  - Frequency: Month
  - Tenure: 1
  - Cycles: 0 (infinite)
  - Pricing: $9.99 USD
```

**Pro Yearly Plan:**
```
Product: Zuhio Pro
Name: Pro Yearly
Description: Yearly subscription for Zuhio Pro
Billing Cycle:
  - Frequency: Year
  - Tenure: 1
  - Cycles: 0 (infinite)
  - Pricing: $99 USD
```

**Business Monthly Plan:**
```
Product: Zuhio Business
Name: Business Monthly
Description: Monthly subscription for Zuhio Business
Billing Cycle:
  - Frequency: Month
  - Tenure: 1
  - Cycles: 0 (infinite)
  - Pricing: $29.99 USD
```

**Business Yearly Plan:**
```
Product: Zuhio Business
Name: Business Yearly
Description: Yearly subscription for Zuhio Business
Billing Cycle:
  - Frequency: Year
  - Tenure: 1
  - Cycles: 0 (infinite)
  - Pricing: $299 USD
```

4. **获取 Plan ID**
   - 创建后复制 Plan ID（格式：`P-XXXXXXXXXXXXXX`）
   - 保存 4 个 Plan ID

---

### 方法二：通过 API 创建（高级）

```bash
# 获取 Access Token
curl -X POST https://api-m.sandbox.paypal.com/v1/oauth2/token \
  -H "Accept: application/json" \
  -H "Accept-Language: en_US" \
  -u "CLIENT_ID:SECRET" \
  -d "grant_type=client_credentials"

# 创建订阅计划
curl -X POST https://api-m.sandbox.paypal.com/v1/billing/plans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d '{
    "product_id": "PROD-XXXXXXXX",
    "name": "Pro Monthly",
    "description": "Monthly subscription for Zuhio Pro",
    "status": "ACTIVE",
    "billing_cycles": [{
      "frequency": {
        "interval_unit": "MONTH",
        "interval_count": 1
      },
      "tenure_type": "REGULAR",
      "sequence": 1,
      "total_cycles": 0,
      "pricing_scheme": {
        "fixed_price": {
          "value": "9.99",
          "currency_code": "USD"
        }
      }
    }],
    "payment_preferences": {
      "auto_bill_outstanding": true,
      "setup_fee": {
        "value": "0",
        "currency_code": "USD"
      },
      "cancel_method": "IMMEDIATE",
      "payment_failure_threshold": 3
    }
  }'
```

---

## ⚙️ 步骤 4：配置环境变量

**在项目根目录创建 `.env.local` 文件：**

```bash
# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_SECRET=your_paypal_secret_here

# PayPal Plan IDs
PAYPAL_PLAN_PRO_MONTHLY=P-XXXXXXXXXXXXXX
PAYPAL_PLAN_PRO_YEARLY=P-XXXXXXXXXXXXXX
PAYPAL_PLAN_BUSINESS_MONTHLY=P-XXXXXXXXXXXXXX
PAYPAL_PLAN_BUSINESS_YEARLY=P-XXXXXXXXXXXXXX
```

**Cloudflare Pages 环境变量配置：**

1. 访问 https://dash.cloudflare.com/?to=/:account/pages
2. 选择项目 → Settings → Environment variables
3. 添加以下变量：

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | `your_client_id` |
| `PAYPAL_SECRET` | `your_secret` |
| `PAYPAL_PLAN_PRO_MONTHLY` | `P-XXX` |
| `PAYPAL_PLAN_PRO_YEARLY` | `P-XXX` |
| `PAYPAL_PLAN_BUSINESS_MONTHLY` | `P-XXX` |
| `PAYPAL_PLAN_BUSINESS_YEARLY` | `P-XXX` |

---

## 🧪 步骤 5：测试支付

### Sandbox 测试流程

1. **创建 Sandbox 测试账号**
   - 访问 https://developer.paypal.com/dashboard/accounts
   - 创建 2 个测试账号：
     - **Buyer**（用于测试支付）
     - **Business**（用于接收支付）

2. **测试订阅流程**
   - 访问定价页面
   - 点击 "Subscribe with PayPal"
   - 使用 Sandbox Buyer 账号登录
   - 完成支付流程
   - 检查是否跳转到 Dashboard

3. **查看交易记录**
   - 访问 https://developer.paypal.com/dashboard/transactions
   - 查看测试交易

---

## 🚀 步骤 6：上线到 Production

### 切换到 Live 模式

1. **创建 Live App**
   - 在 PayPal Developer Dashboard
   - 切换到 **Live** 标签
   - 创建新的 App
   - 获取 Live Client ID 和 Secret

2. **创建 Live 订阅计划**
   - 使用 Live 模式创建 4 个订阅计划
   - 获取 Live Plan IDs

3. **更新环境变量**
   ```bash
   # 替换为 Live 凭证
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=live_client_id
   PAYPAL_SECRET=live_secret
   PAYPAL_PLAN_PRO_MONTHLY=live_plan_id
   ...
   ```

4. **重新部署**
   ```bash
   git push
   # 或在 Cloudflare 控制台重新部署
   ```

---

## 📊 步骤 7：管理订阅

### 查看订阅

**PayPal Dashboard:**
```
https://www.paypal.com/business/profile/subscriptions
```

### 取消订阅

**用户取消：**
1. 登录 PayPal 账号
2. Settings → Payments
3. Manage automatic payments
4. 找到 Zuhio
5. 点击 Cancel

**管理员取消：**
```bash
curl -X POST https://api-m.paypal.com/v1/billing/subscriptions/SUBSCRIPTION_ID/cancel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d '{
    "reason": "Customer requested cancellation"
  }'
```

---

## 🔔 步骤 8：Webhook 配置（可选）

### 创建 Webhook

1. **访问** https://developer.paypal.com/dashboard/applications
2. **选择你的 App**
3. **添加 Webhook**
   - URL: `https://your-domain.com/api/paypal/webhook`
   - Events:
     - `BILLING.SUBSCRIPTION.CREATED`
     - `BILLING.SUBSCRIPTION.ACTIVATED`
     - `BILLING.SUBSCRIPTION.CANCELLED`
     - `BILLING.SUBSCRIPTION.SUSPENDED`
     - `PAYMENT.SALE.COMPLETED`
     - `PAYMENT.SALE.REFUNDED`

### 处理 Webhook

```typescript
// app/api/paypal/webhook/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  const eventType = body.event_type;

  switch (eventType) {
    case 'BILLING.SUBSCRIPTION.ACTIVATED':
      // 激活用户订阅
      await activateSubscription(body.resource);
      break;
    case 'BILLING.SUBSCRIPTION.CANCELLED':
      // 取消用户订阅
      await cancelSubscription(body.resource);
      break;
    // ... 处理其他事件
  }

  return NextResponse.json({ received: true });
}
```

---

## 💡 最佳实践

### 1. 错误处理
- 捕获所有 PayPal API 错误
- 显示友好的错误消息
- 提供备选支付方式

### 2. 安全性
- 验证 Webhook 签名
- 使用 HTTPS
- 不在前端暴露 Secret

### 3. 用户体验
- 显示清晰的定价
- 提供退款政策
- 显示信任标识

### 4. 合规性
- 显示 Terms of Service
- 显示 Privacy Policy
- 提供取消订阅的入口

---

## 📞 技术支持

### PayPal 文档
- Developer Docs: https://developer.paypal.com/docs/
- Subscriptions Guide: https://developer.paypal.com/docs/subscriptions/
- API Reference: https://developer.paypal.com/docs/api/

### 社区支持
- Stack Overflow: https://stackoverflow.com/questions/tagged/paypal
- PayPal Developer Forum: https://www.paypal-community.com/

---

## ✅ 检查清单

上线前确认：

- [ ] PayPal Business 账号已创建
- [ ] App 已创建（Sandbox + Live）
- [ ] 4 个订阅计划已创建
- [ ] 环境变量已配置
- [ ] 测试支付流程完成
- [ ] Webhook 已配置（可选）
- [ ] 退款政策已添加
- [ ] Terms of Service 已添加
- [ ] 联系邮箱已设置

---

**配置完成后，删除此文件！** 🚀
