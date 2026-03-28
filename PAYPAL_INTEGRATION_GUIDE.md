# 🅿️ PayPal 集成完成指南

---

## ✅ 已完成的工作

### 1. 环境配置
- ✅ 创建 `.env.local` 文件，包含沙箱凭证
- ✅ 配置 PayPal API URL（沙箱环境）

### 2. API 端点
- ✅ `/api/paypal/create-order` - 创建一次性支付订单
- ✅ `/api/paypal/capture-order` - 捕获支付
- ✅ `/api/paypal/activate-subscription` - 激活订阅

### 3. 前端组件
- ✅ `PayPalCheckout.tsx` - 订阅支付组件（已存在）
- ✅ `PayPalOneTimePayment.tsx` - 一次性支付组件（新增）

### 4. 工具脚本
- ✅ `scripts/create-paypal-products.ts` - 创建产品和订阅计划

---

## 🚀 下一步操作

### 步骤 1：安装依赖

```bash
cd /root/.openclaw/workspace/zuhio-keyword-count-checker
npm install -D ts-node
```

### 步骤 2：创建 PayPal 产品和订阅计划

运行脚本自动创建：

```bash
npx ts-node scripts/create-paypal-products.ts
```

**脚本会创建：**
- 2 个订阅产品（Pro、Business）
- 1 个一次性支付产品（Credits）
- 4 个订阅计划（Pro/Business × 月/年）

**输出示例：**
```
📋 请将以下内容添加到 .env.local 文件中：

# PayPal Product IDs
PAYPAL_PRODUCT_PRO=PROD-XXXXXXXXXX
PAYPAL_PRODUCT_BUSINESS=PROD-XXXXXXXXXX
PAYPAL_PRODUCT_CREDITS=PROD-XXXXXXXXXX

# PayPal Plan IDs
PAYPAL_PLAN_PRO_MONTHLY=P-XXXXXXXXXX
PAYPAL_PLAN_PRO_YEARLY=P-XXXXXXXXXX
PAYPAL_PLAN_BUSINESS_MONTHLY=P-XXXXXXXXXX
PAYPAL_PLAN_BUSINESS_YEARLY=P-XXXXXXXXXX
```

### 步骤 3：更新环境变量

将脚本输出的 ID 复制到 `.env.local`：

```bash
# 编辑 .env.local
nano .env.local
```

粘贴产品 ID 和计划 ID，保存。

### 步骤 4：重启开发服务器

```bash
npm run dev
```

---

## 🧪 测试支付

### 测试订阅支付

1. 访问定价页面：`http://localhost:3000/pricing`
2. 选择 Pro 或 Business 套餐
3. 点击 "Subscribe with PayPal"
4. 使用 PayPal 沙箱买家账号登录
5. 完成支付流程

### 测试一次性支付

在需要积分购买的页面添加：

```tsx
import PayPalOneTimePayment from '@/components/PayPalOneTimePayment';

<PayPalOneTimePayment
  credits={100}
  price={9.99}
  onSuccess={() => console.log('Payment successful!')}
/>
```

---

## 📦 积分包定价建议

在定价页面添加积分包选项：

```tsx
const creditPackages = [
  { credits: 50, price: 4.99, bestFor: 'Trying out' },
  { credits: 100, price: 9.99, bestFor: 'Most popular' },
  { credits: 250, price: 19.99, bestFor: 'Regular users' },
  { credits: 500, price: 34.99, bestFor: 'Power users' },
];
```

---

## 🔐 沙箱测试账号

### 创建沙箱买家账号

1. 访问 https://developer.paypal.com/dashboard/accounts
2. 点击 **Create account**
3. 选择 **Buyer** 类型
4. 记录生成的邮箱和密码

### 使用沙箱账号测试

在 PayPal 支付弹窗中：
- 使用沙箱买家账号登录
- 完成支付（不会扣真实费用）
- 查看交易记录：https://developer.paypal.com/dashboard/transactions

---

## 📊 上线到生产环境

### 切换到 Live 模式

1. **创建 Live App**
   - 在 PayPal Developer Dashboard 切换到 **Live**
   - 创建新的 App
   - 获取 Live Client ID 和 Secret

2. **创建 Live 产品和计划**
   ```bash
   # 修改 scripts/create-paypal-products.ts
   const PAYPAL_BASE_URL = 'https://api-m.paypal.com';
   
   # 重新运行脚本
   npx ts-node scripts/create-paypal-products.ts
   ```

3. **更新环境变量**
   ```bash
   # .env.local (生产环境)
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=live_client_id
   PAYPAL_SECRET=live_secret
   PAYPAL_API_URL=https://api-m.paypal.com
   ```

4. **重新部署**
   ```bash
   git add .
   git commit -m "feat: enable PayPal production mode"
   git push
   ```

---

## 🔔 Webhook 配置（可选）

### 创建 Webhook

1. 访问 https://developer.paypal.com/dashboard/applications
2. 选择你的 App
3. 点击 **Add webhook**
4. 配置：
   - **URL**: `https://your-domain.com/api/paypal/webhook`
   - **Events**:
     - `BILLING.SUBSCRIPTION.CREATED`
     - `BILLING.SUBSCRIPTION.ACTIVATED`
     - `BILLING.SUBSCRIPTION.CANCELLED`
     - `BILLING.SUBSCRIPTION.SUSPENDED`
     - `PAYMENT.CAPTURE.COMPLETED`
     - `PAYMENT.CAPTURE.REFUNDED`

### 创建 Webhook 处理端点

```bash
mkdir -p app/api/paypal/webhook
touch app/api/paypal/webhook/route.ts
```

---

## 🛠️ 故障排查

### 问题：PayPal SDK 加载失败

**检查：**
- Client ID 是否正确
- 网络是否可访问 paypal.com
- 浏览器控制台是否有错误

### 问题：订阅计划 ID 为空

**解决：**
- 确保运行了 `create-paypal-products.ts` 脚本
- 检查 `.env.local` 中的 Plan ID 是否正确

### 问题：支付成功但数据库未更新

**检查：**
- API 端点日志：`console.log` 输出
- 数据库连接配置
- 用户 ID 是否正确传递

---

## 📞 PayPal 资源

- **Developer Dashboard**: https://developer.paypal.com
- **API 文档**: https://developer.paypal.com/docs/api/
- **订阅指南**: https://developer.paypal.com/docs/subscriptions/
- **沙箱测试**: https://developer.paypal.com/dashboard/

---

## ✅ 检查清单

上线前确认：

- [ ] 沙箱测试通过
- [ ] 产品和计划 ID 已配置
- [ ] 一次性支付测试通过
- [ ] 订阅支付测试通过
- [ ] Webhook 已配置（可选）
- [ ] 生产环境凭证已创建
- [ ] 退款政策已添加
- [ ] Terms of Service 已添加

---

**🎉 配置完成后，准备上线！**
