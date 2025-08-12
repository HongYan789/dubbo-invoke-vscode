# 🚀 Dubbo Invoke Generator

一个现代化的VS Code扩展，基于最佳实践构建，用于从Java接口方法生成Dubbo invoke命令。

## ✨ 功能特性

- 🚀 **智能命令生成**: 右键点击Java方法即可生成Dubbo invoke命令
- 📋 **一键复制**: 快速复制生成的命令到剪贴板
- 🎯 **智能解析**: 自动解析方法签名、参数和返回类型
- 💡 **类型支持**: 支持多种Java数据类型的示例值生成
- 🎨 **现代化UI**: 基于VS Code设计语言的美观界面
- ⌨️ **键盘快捷键**: 支持Ctrl/Cmd+C复制、Esc关闭等快捷操作
- 🔄 **实时刷新**: 可重新生成当前方法的命令
- 📱 **响应式设计**: 适配不同屏幕尺寸
- 🔒 **安全保障**: 实施内容安全策略，确保代码安全执行

## 🎯 使用方法

### 快速开始

1. **运行快速测试脚本**：
   ```bash
   ./test-plugin.sh
   ```

2. **手动安装步骤**：
   ```bash
   # 安装依赖
   npm install
   
   # 编译项目
   npm run compile
   
   # 在VS Code中按 F5 启动调试模式
   # 在Extension Development Host窗口中测试
   ```

### 操作步骤

1. 📂 在VS Code中打开包含Java接口的项目
2. 📝 打开Java接口文件（如 `example/UserService.java`）
3. 🖱️ 在方法名上右键点击
4. 🚀 选择 "Dubbo Invoke" 选项
5. 📋 在弹出的面板中点击"复制命令"按钮

### 生成的命令格式示例

基于 `example/UserService.java` 的实际输出：

```bash
# 有参数方法
invoke com.example.service.UserService getUserById("example", true)

# 多参数方法  
invoke com.example.service.UserService getUsersByAge(1, 1)

# 复杂参数方法
invoke com.example.service.UserService batchCreateUsers([], {})

# 无参数方法
invoke com.example.service.UserService getUserStats()
```

### ⌨️ 键盘快捷键

- `Ctrl/Cmd + C`: 复制命令到剪贴板
- `Esc`: 关闭面板
- `F5` 或 `Ctrl/Cmd + R`: 刷新命令

## 🆕 最新改进

### v2.0 - 基于VS Code扩展最佳实践的全面升级

- ✨ **全新UI设计**: 采用VS Code原生设计语言，完美融合编辑器主题
- 🔒 **安全性增强**: 实施内容安全策略(CSP)和nonce安全机制
- 📱 **响应式布局**: 支持不同屏幕尺寸，移动端友好
- 🎮 **交互优化**: 添加按钮动画、智能焦点管理和Toast通知
- 🔄 **新增功能**: 命令刷新、面板管理、键盘快捷键支持
- 🛡️ **错误处理**: 完善的错误提示和异常处理机制

详细改进内容包括UI设计、安全性增强、响应式布局、交互优化等多个方面

## 🔧 故障排除

### 常见问题

#### 1. 复制功能不工作
**症状**: 点击"复制命令"按钮后，剪贴板中没有内容或内容不正确
**解决方案**:
- 确保在Extension Development Host窗口中测试
- 检查VS Code开发者控制台是否有错误信息
- 重新编译项目：`npm run compile`

#### 2. 右键菜单没有"Dubbo Invoke"选项
**症状**: 在Java文件中右键点击方法时，没有看到菜单选项
**解决方案**:
- 确保文件扩展名为 `.java`
- 确保光标位置在方法名上
- 确保在Extension Development Host窗口中操作
- 重启调试会话（按F5重新启动）

#### 3. 按钮不响应
**症状**: 刷新或关闭按钮点击后没有反应
**解决方案**:
- 检查浏览器控制台是否有JavaScript错误
- 确保WebView正常加载
- 尝试使用键盘快捷键：`Esc`关闭，`F5`刷新

#### 4. 生成的命令格式不正确
**症状**: 生成的Dubbo invoke命令无法执行
**解决方案**:
- 检查Java方法签名是否标准
- 确保类名和方法名解析正确
- 手动调整参数值以匹配实际需求

### 调试步骤

1. **检查编译状态**:
   ```bash
   npm run compile
   ```

2. **运行测试脚本**:
   ```bash
   ./test-plugin.sh
   ```

3. **查看详细日志**:
   - 打开VS Code开发者工具：`Help > Toggle Developer Tools`
   - 查看Console标签页的错误信息

4. **重置环境**:
   ```bash
   # 清理并重新安装
   rm -rf node_modules out
   npm install
   npm run compile
   ```

## 支持的参数类型

插件会根据方法参数类型自动生成合适的示例值：

- `String` → `"example"`
- `int/Integer` → `1`
- `long/Long` → `1L`
- `double/Double` → `1.0`
- `float/Float` → `1.0f`
- `boolean/Boolean` → `true`
- `List/ArrayList` → `[]`
- `Map/HashMap` → `{}`
- 自定义对象 → `{}`

## 示例

对于以下Java接口方法：

```java
public interface UserService {
    User getUserById(String userId, boolean includeDetails);
    List<User> getUsersByAge(int minAge, int maxAge);
    void updateUser(User user);
}
```

生成的Dubbo invoke命令示例：

```bash
invoke com.example.service.UserService getUserById("example", true)
invoke com.example.service.UserService getUsersByAge(1, 1)
invoke com.example.service.UserService updateUser({})
```

## 安装

### 快速开始（推荐）

1. **运行自动测试脚本：**
   ```bash
   cd /Users/hongyan/Downloads/dubbo-invoke
   ./test-plugin.sh
   ```

2. **手动安装步骤：**
   ```bash
   # 安装依赖
   npm install
   
   # 编译插件
   npm run compile
   
   # 打开VSCode
   code .
   
   # 按F5启动调试模式
   ```

### 重要提示

⚠️ **如果右键菜单中看不到"Generate Dubbo Invoke Command"，请检查：**

1. **确保在Extension Development Host窗口中测试**
   - 按F5启动调试后会打开新的VSCode窗口
   - 必须在这个新窗口中测试插件功能

2. **确保文件类型正确**
   - 文件必须是 `.java` 扩展名
   - VSCode状态栏显示语言为"Java"

3. **确保光标位置正确**
   - 光标必须在Java方法定义上
   - 支持接口方法和类方法

### 详细故障排除

如果遇到问题，请查看：<mcfile name="INSTALLATION.md" path="/Users/hongyan/Downloads/dubbo-invoke/INSTALLATION.md"></mcfile>

## 开发

### 环境要求

- Node.js 16+
- VSCode 1.74.0+
- TypeScript 4.9+

### 开发命令

```bash
# 安装依赖
npm install

# 编译
npm run compile

# 监听模式编译
npm run watch
```

### 调试

1. 在VSCode中打开项目
2. 按 `F5` 启动Extension Development Host
3. 在新窗口中测试插件功能

## 贡献

欢迎提交Issue和Pull Request来改进这个插件！

## 许可证

MIT License