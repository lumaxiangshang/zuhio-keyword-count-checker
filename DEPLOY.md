# 🚀 Zuhio - 部署文档

## 📋 版本信息

**版本：** v2.0.0 - 纯订阅制版  
**发布日期：** 2026-03-30  
**核心变更：** 移除积分系统，专注 Pro 订阅计划

---

## ✅ 部署前检查清单

### 1. 环境变量确认

确保 `.env.local` 包含以下必需变量：

```bash
# 数据库
DATABASE_URL="postgresql://..."

# PayPal（沙箱环境）
NEXT_PUBLIC_PAYPAL_CLIENT_ID="AevvA8o2Kppx2FwFBom4Q6ZzPCTdxCKkeRI2ZBVgerfRZqcvDUWLKYvrLTWK_SBoabipvGH5wBa_1iGw"
PAYPAL_SECRET="ELoML4ZUrSqaR9O5nNtXjq3Oc1MgO0L60riU1Kx_Z2ixa2Iz3KEl2VqyTKpMetexKBKLzfnIVqSKDswG"
PAYPAL_API_URL="https://api-m.sandbox.paypal.com"

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyBgP_Oy5KTYfsEyNiXrtXwSAp1tztOuDyM"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="zuhio-keyword-count-checker.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="zuhio-keyword-count-checker"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="zuhio-keyword-count-checker.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="289541466359"
NEXT_PUBLIC_FIREBASE_APP_ID="1:289541466359:web:e6105f849bd6a5df90cbf2"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-CTZEVL2EWZ"

# 应用配置
NEXT_PUBLIC_BASE_URL="https://zuhio-keyword-count-checker.vercel.app"
```

### 2. 数据库迁移

```bash
cd /root/.openclaw/workspace/zuhio-keyword-count-checker

# 生成 Prisma 客户端
npx prisma generate

# 执行数据库迁移
npx prisma migrate deploy
```

### 3. 创建订阅计划配置（可选）

在数据库中插入订阅计划配置记录：

```sql
INSERT INTO "SubscriptionPlanConfig" ("planName", "billingCycle", "price", "currency", "paypalPlanId", "dailyLimit", "features", "isActive", "isPopular")
VALUES 
  ('PRO', 'MONTHLY', 9.99, 'USD', 'P-1AK67303R1503452TNHDOITQ', 999999, '["无限次关键词分析","导出 PDF/CSV","30 天历史记录","高级关键词密度报告","邮件支持"]', true, true),
  ('PRO', 'YEARLY', 99, 'USD', 'P-9BF18630VW4069643NHDOITY', 999999, '["无限次关键词分析","导出 PDF/CSV","30 天历史记录","高级关键词密度报告","邮件支持","节省 17%"]', true, false);
```

---

## 🚀 部署到 Vercel

### 方式 1：Git 自动部署（推荐）

```bash
cd /root/.openclaw/workspace/zuhio-keyword-count-checker

# 提交更改
git add .
git commit -m "feat: 纯订阅制重构 - 专注 Pro 计划 v2.0.0"
git push origin main
```

Vercel 会自动检测并部署。

### 方式 2：Vercel CLI

```bash
# 安装 Vercel CLI（如果未安装）
npm install -g vercel

# 登录 Vercel
vercel login

# 部署（预览）
vercel

# 部署到生产环境
vercel --prod
```

### 方式 3：Cloudflare Pages（备用）

```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署到 Cloudflare Pages
npx @cloudflare/next-on-pages
wrangler pages deploy .vercel/output/static --project-name zuhio-keyword-count-checker
```

---

## 🔧 Vercel 环境变量配置

在 Vercel Dashboard 中设置以下环境变量：

**Production:**
- `DATABASE_URL` - 生产数据库连接
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` - PayPal Client ID
- `PAYPAL_SECRET` - PayPal Secret
- `PAYPAL_API_URL` - `https://api-m.paypal.com` (生产环境)
- Firebase 系列变量
- `NEXT_PUBLIC_BASE_URL` - `https://zuhio-keyword-count-checker.vercel.app`

**Preview:**
- 使用沙箱环境配置

---

## 🧪 部署后测试

### 1. 基础功能测试
- [ ] 首页关键词分析功能正常
- [ ] 免费用户每日 3 次限制生效
- [ ] 达到限制后显示升级弹窗

### 2. 订阅流程测试
- [ ] 定价页面显示正确（Free + Pro）
- [ ] Pro Monthly ($9.99) 支付流程
- [ ] Pro Yearly ($99) 支付流程
- [ ] PayPal 支付成功回调
- [ ] Dashboard 订阅状态更新

### 3. Dashboard 测试
- [ ] 订阅用户显示"∞"无限使用
- [ ] 免费用户显示剩余次数
- [ ] 订阅详情显示正确

### 4. Webhook 测试（沙箱）

```bash
# 使用 PayPal Webhook 模拟器测试以下事件：
- BILLING.SUBSCRIPTION.ACTIVATED
- BILLING.SUBSCRIPTION.CANCELLED
- BILLING.SUBSCRIPTION.EXPIRED
- PAYMENT.CAPTURE.COMPLETED
```

---

## 📊 上线后监控

### 关键指标
- 每日活跃用户数
- 免费→Pro 转化率
- 订阅取消率
- 月收入 (MRR)

### 日志监控
```bash
# Vercel 实时日志
vercel logs --follow

# 查看错误日志
vercel logs --level=error
```

---

## ⚠️ 生产环境注意事项

### PayPal 配置
1. **创建 Live App** - 在 PayPal Developer Dashboard
2. **获取 Live Credentials** - Client ID + Secret
3. **创建 Live 订阅计划** - 使用真实价格
4. **配置 Webhook** - 指向生产 URL

### 数据库备份
```bash
# 定期备份数据库
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### 安全加固
1. 启用 Vercel 防火墙
2. 配置 CSP 头
3. 启用速率限制
4. 监控异常流量

---

## 🔄 回滚方案

如果部署后发现问题：

```bash
# Vercel 回滚到上一个版本
vercel rollback

# 或回滚到特定部署
vercel rollback [deployment-url]
```

---

## 📞 支持

遇到问题时：
1. 检查 Vercel 部署日志
2. 查看数据库连接状态
3. 验证 PayPal 配置
4. 联系技术支持

---

**最后更新：** 2026-03-30  
**维护者：** 小璐 💼
