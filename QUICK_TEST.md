# 🚀 快捷键功能快速测试指南

## 新功能：Cmd+I(Mac) / Ctrl+I(Windows) 快速生成命令

### 测试步骤

1. **启动调试模式**
   ```bash
   # 在项目根目录执行
   npm run compile
   # 然后在VS Code中按 F5 启动调试
   ```

2. **打开测试文件**
   - 在Extension Development Host窗口中
   - 打开 `example/UserService.java`

3. **测试快捷键功能**
   - 将光标放在任意方法上（如 `getUserById` 方法）
   - 按下 `Cmd+I`(Mac) / `Ctrl+I`(Windows)
   - 应该看到成功提示：`✅ Dubbo invoke命令已复制到剪切板: getUserById()`

4. **验证剪切板内容**
   - 在任意文本编辑器中按 `Cmd+V` 粘贴
   - 应该看到类似：`invoke com.example.service.UserService getUserById("example", true)`

### 测试用例

| 方法名 | 预期输出 |
|--------|----------|
| `getUserById` | `invoke com.example.service.UserService getUserById("example", true)` |
| `getUsersByAge` | `invoke com.example.service.UserService getUsersByAge(1, 1)` |
| `updateUser` | `invoke com.example.service.UserService updateUser({})` |
| `getUserStats` | `invoke com.example.service.UserService getUserStats()` |

### 对比测试

**传统方式（右键菜单）**：
1. 右键点击方法
2. 选择 "Dubbo Invoke"
3. 等待面板加载
4. 点击"复制命令"按钮

**新快捷键方式**：
1. 光标定位到方法
2. 按 `Cmd+I`(Mac) / `Ctrl+I`(Windows)
3. 完成！

### 故障排除

如果快捷键不工作，检查：
- [ ] 是否在 Extension Development Host 窗口中
- [ ] 文件是否为 `.java` 扩展名
- [ ] 光标是否在方法定义行上
- [ ] 是否有编译错误

### 成功标志

✅ 按下快捷键后立即显示成功消息
✅ 剪切板中包含正确的invoke命令
✅ 命令格式符合Dubbo标准