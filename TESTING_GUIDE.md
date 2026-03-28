# 🧪 PayPal 沙盒测试指南

**服务器状态：** ✅ 已启动  
**访问地址：** http://localhost:3000/pricing

---

## 📋 测试步骤

### 步骤 1：访问定价页面

打开浏览器访问：
```
http://localhost:3000/pricing
```

### 步骤 2：准备沙盒测试账号

#### 如果没有沙盒账号，先创建：

1. 访问 https://developer.paypal.com/dashboard/accounts
2. 点击 **Create account**
3. 选择 **Buyer** 类型（个人买家账号）
4. 记录生成的邮箱和密码

**示例沙盒账号：**
- 邮箱：sb-buyer@personal.example.com
- 密码：（在 PayPal Dashboard 查看）

### 步骤 3：测试订阅支付

#### 测试 Pro 月度订阅：

1. 在定价页面选择 **Pro** 套餐
2. 确保选择 **Monthly**（$9.99/月）
3. 点击 **Subscribe with PayPal**
4. PayPal 弹窗会出现

#### 在 PayPal 弹窗中：

1. **登录** - 使用沙盒买家账号
   - 邮箱：你的沙盒买家邮箱
   - 密码：沙盒账号密码

2. **同意订阅** - 查看订阅详情
   - 金额：$9.99 USD
   - 周期：每月
   - 商家：Zuhio

3. **确认支付** - 点击同意并订阅

4. **支付成功** - 应该跳转到 Dashboard
   - URL: `http://localhost:3000/dashboard?subscription=success`

### 步骤 4：验证支付结果

#### 在 PayPal Dashboard 查看：

1. 访问 https://developer.paypal.com/dashboard/transactions
2. 应该看到一笔 $9.99 的交易记录
3. 状态应该是 **Completed**

#### 在浏览器控制台查看：

按 F12 打开开发者工具，查看 Console：
- 应该看到 `✅ Subscription activated:` 日志
- 包含订阅 ID、计划类型等信息

---

## 🎯 测试场景清单

### ✅ 场景 1：Pro 月度订阅
- [ ] 选择 Pro Monthly ($9.99)
- [ ] 完成支付
- [ ] 验证跳转成功
- [ ] 查看交易记录

### ✅ 场景 2：Pro 年度订阅
- [ ] 切换到 Yearly
- [ ] 选择 Pro Yearly ($99)
- [ ] 完成支付
- [ ] 验证年付价格

### ✅ 场景 3：Business 月度订阅
- [ ] 选择 Business Monthly ($29.99)
- [ ] 完成支付
- [ ] 验证高级功能

### ✅ 场景 4：Business 年度订阅
- [ ] 选择 Business Yearly ($299)
- [ ] 完成支付
- [ ] 验证最大优惠

---

## 🐛 常见问题排查

### 问题 1：PayPal 按钮不显示

**可能原因：**
- Client ID 配置错误
- 网络无法访问 PayPal

**解决方法：**
```bash
# 检查环境变量
cat .env.local | grep PAYPAL

# 应该看到：
# NEXT_PUBLIC_PAYPAL_CLIENT_ID=AevvA8o2Kppx2FwFBom4Q6ZzPCTdxCKkeRI2ZBVgerfRZqcvDUWLKYvrLTWK_SBoabipvGH5wBa_1iGw
```

### 问题 2：支付后未跳转

**可能原因：**
- API 端点返回错误
- 网络问题

**解决方法：**
1. 打开浏览器 Console (F12)
2. 查看 Network 标签
3. 找到 `activate-subscription` 请求
4. 查看响应内容

### 问题 3：订阅计划 ID 无效

**可能原因：**
- 环境变量未加载
- 计划 ID 错误

**解决方法：**
```bash
# 重启开发服务器
# Ctrl+C 停止
npm run dev
```

### 问题 4：沙盒账号登录失败

**可能原因：**
- 使用了真实 PayPal 账号
- 沙盒账号密码错误

**解决方法：**
1. 确认在沙盒环境（URL 包含 sandbox.paypal.com）
2. 在 https://developer.paypal.com/dashboard/accounts 重置密码
3. 使用沙盒买家账号，不要用商家账号

---

## 📊 测试检查清单

完成测试后确认：

- [ ] PayPal 按钮正常显示
- [ ] 沙盒账号可以登录
- [ ] Pro Monthly 支付成功
- [ ] Pro Yearly 支付成功
- [ ] Business Monthly 支付成功
- [ ] Business Yearly 支付成功
- [ ] 支付后正确跳转
- [ ] Console 无错误日志
- [ ] PayPal Dashboard 显示交易记录

---

## 🔍 调试技巧

### 1. 查看 API 日志

开发服务器会显示所有 API 调用：
```
✓ POST /api/paypal/activate-subscription 200
```

### 2. 查看浏览器 Console

```javascript
// 应该看到类似输出：
✅ Subscription activated: {
  subscriptionId: "I-XXXXXXXXXX",
  planId: "P-1AK67303R1503452TNHDOITQ",
  planType: "pro",
  status: "ACTIVE"
}
```

### 3. 手动测试 API

```bash
# 测试创建订单（一次性支付）
curl -X POST http://localhost:3000/api/paypal/create-order \
  -H "Content-Type: application/json" \
  -d '{"credits": 100, "price": "9.99"}'
```

---

## 🎉 测试成功后

1. **截图保存** - 保存支付成功页面
2. **记录交易 ID** - 用于后续对账
3. **继续测试积分页面** - http://localhost:3000/credits

---

## 📞 PayPal 沙盒资源

- **测试账号管理：** https://developer.paypal.com/dashboard/accounts
- **交易记录：** https://developer.paypal.com/dashboard/transactions
- **沙盒通知：** https://developer.paypal.com/dashboard/notifications

---

**💡 提示：** 沙盒测试不会产生真实费用，可以放心测试！
