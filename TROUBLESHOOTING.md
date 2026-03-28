# 🔍 PayPal 故障排查指南

**服务器地址：** http://localhost:3001

---

## 📋 诊断步骤

### 步骤 1：访问调试页面

打开浏览器访问：
```
http://localhost:3001/debug-paypal
```

**检查：**
- Client ID 是否显示 ✅
- 所有 Plan IDs 是否显示
- Live Logs 中的输出

### 步骤 2：检查 API 端点

在终端运行：
```bash
curl http://localhost:3001/api/paypal/config
```

**预期输出：**
```json
{
  "clientId": "AevvA8o2Kppx2FwFBom4...",
  "plans": {
    "proMonthly": "P-1AK67303R1503452TNHDOITQ",
    ...
  }
}
```

### 步骤 3：检查浏览器控制台

按 F12 打开开发者工具，查看 Console：

**应该看到的日志：**
```
[PayPalOneTimePayment] Fetching config...
[PayPalOneTimePayment] Config response status: 200
[PayPalOneTimePayment] Config data: {clientId: "AevvA8o2Kppx2FwFBom4...", ...}
[PayPalOneTimePayment] Client ID found, setting state
[PayPalOneTimePayment] SDK load effect - clientId: SET
[PayPalOneTimePayment] Loading PayPal SDK...
```

**如果看到错误：**
- "PayPal Client ID not configured" - 配置问题
- Network error - 网络问题
- Failed to load PayPal SDK - SDK 加载问题

---

## 🐛 常见问题

### 问题 1：显示 "PayPal Client ID not configured"

**原因：** 组件无法获取 Client ID

**解决方法：**

1. **检查 API 端点**
   ```bash
   curl http://localhost:3001/api/paypal/config
   ```
   
   如果返回空或错误，检查服务器日志。

2. **检查 .env.local**
   ```bash
   cat .env.local | grep NEXT_PUBLIC_PAYPAL_CLIENT_ID
   ```
   
   应该输出完整的 Client ID。

3. **重启服务器**
   ```bash
   # Ctrl+C 停止
   npm run dev
   ```

4. **清除浏览器缓存**
   - 硬刷新：Ctrl+Shift+R
   - 或使用无痕模式

### 问题 2：API 端点返回空值

**可能原因：** 环境变量未加载

**解决方法：**

1. **检查 .env.local 位置**
   ```bash
   ls -la .env.local
   ```
   应该在项目根目录。

2. **检查 .env.local 内容**
   ```bash
   cat .env.local
   ```
   确保没有拼写错误。

3. **检查服务器启动日志**
   启动时应该显示：
   ```
   - Environments: .env.local
   ```

### 问题 3：PayPal SDK 加载失败

**可能原因：** 网络问题或 Client ID 无效

**解决方法：**

1. **检查网络连接**
   ```bash
   curl -I https://www.paypal.com/sdk/js
   ```

2. **验证 Client ID**
   访问 PayPal Developer Dashboard 确认 Client ID 正确。

3. **检查防火墙**
   确保可以访问 paypal.com。

---

## 🔧 调试技巧

### 1. 使用调试页面

访问 `http://localhost:3001/debug-paypal`

这个页面会显示：
- 实时配置状态
- 详细的日志输出
- 所有 Plan IDs

### 2. 查看组件日志

在浏览器 Console 中搜索 `[PayPalOneTimePayment]`：

```javascript
// 应该看到完整的日志流
[PayPalOneTimePayment] Fetching config...
[PayPalOneTimePayment] Config response status: 200
[PayPalOneTimePayment] Config data: {...}
[PayPalOneTimePayment] Client ID found, setting state
[PayPalOneTimePayment] SDK load effect - clientId: SET
[PayPalOneTimePayment] Loading PayPal SDK...
[PayPalOneTimePayment] PayPal SDK loaded successfully
```

### 3. 测试组件

访问 `http://localhost:3001/credits`

打开 Console，应该看到详细的日志输出。

---

## ✅ 验证清单

完成以下检查：

- [ ] API 端点返回正确的 Client ID
- [ ] 调试页面显示 ✅ Client ID
- [ ] Console 中没有 "Client ID not configured" 错误
- [ ] PayPal SDK 成功加载
- [ ] PayPal 按钮显示在页面上
- [ ] 可以点击 PayPal 按钮

---

## 📞 快速测试命令

```bash
# 1. 测试 API 端点
curl http://localhost:3001/api/paypal/config | python3 -m json.tool

# 2. 检查环境变量
cat .env.local | grep PAYPAL

# 3. 运行 PayPal API 测试
npm run paypal:test-api

# 4. 查看服务器日志
# 开发服务器会自动显示所有请求
```

---

## 🎯 当前配置状态

**服务器：** http://localhost:3001  
**环境：** Sandbox（沙箱）  
**Client ID：** AevvA8o2Kppx2FwFBom4... ✅  
**API URL：** https://api-m.sandbox.paypal.com ✅  
**Plan IDs：** 4 个都已配置 ✅  

---

## 📝 如果问题依然存在

1. **访问调试页面**
   ```
   http://localhost:3001/debug-paypal
   ```

2. **截图错误信息**
   - 调试页面的输出
   - 浏览器 Console 的错误
   - 网络请求的响应

3. **检查服务器日志**
   查看开发服务器的输出。

4. **提供完整信息**
   包括：
   - 访问的页面 URL
   - 看到的错误信息
   - Console 中的日志
   - Network 标签中的请求响应

---

**最后更新：** 2026-03-28  
**服务器端口：** 3001
