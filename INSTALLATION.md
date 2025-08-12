# Dubbo Invoke Generator 详细安装和使用指南

## 问题诊断：为什么右键菜单中没有"Generate Dubbo Invoke Command"？

### 常见原因和解决方案

#### 1. 插件未正确安装或激活

**检查方法：**
- 打开VSCode，按 `Ctrl+Shift+X`（Mac: `Cmd+Shift+X`）打开扩展面板
- 搜索 "Dubbo Invoke Generator" 查看是否已安装

**解决方案：**

##### 方法A：开发模式安装（推荐用于测试）

1. **打开项目**
   ```bash
   cd /Users/hongyan/Downloads/dubbo-invoke
   code .
   ```

2. **启动开发模式**
   - 在VSCode中按 `F5`
   - 或者按 `Ctrl+Shift+P`（Mac: `Cmd+Shift+P`），输入 "Debug: Start Debugging"
   - 会自动打开一个新的VSCode窗口（Extension Development Host）

3. **在新窗口中测试**
   - 在Extension Development Host窗口中打开Java文件
   - 右键应该能看到菜单项

##### 方法B：打包安装（推荐用于正式使用）

1. **安装vsce工具**
   ```bash
   npm install -g vsce
   ```

2. **打包插件**
   ```bash
   cd /Users/hongyan/Downloads/dubbo-invoke
   vsce package
   ```

3. **安装插件**
   ```bash
   code --install-extension dubbo-invoke-generator-0.0.1.vsix
   ```

#### 2. 文件类型不正确

**问题：** 插件只在 `.java` 文件中激活

**检查方法：**
- 确保当前文件扩展名是 `.java`
- 检查VSCode状态栏右下角显示的语言模式是否为 "Java"

**解决方案：**
- 将文件保存为 `.java` 扩展名
- 或者手动设置语言模式：按 `Ctrl+Shift+P`，输入 "Change Language Mode"，选择 "Java"

#### 3. 插件激活条件未满足

**检查激活状态：**
1. 按 `Ctrl+Shift+P`（Mac: `Cmd+Shift+P`）
2. 输入 "Developer: Reload Window" 重新加载窗口
3. 打开Java文件，插件应该自动激活

#### 4. VSCode版本兼容性

**要求：** VSCode 1.74.0 或更高版本

**检查版本：**
- 帮助 → 关于，查看VSCode版本
- 如果版本过低，请更新VSCode

## 详细使用步骤

### 步骤1：确认插件已激活

1. **开发模式测试：**
   ```bash
   cd /Users/hongyan/Downloads/dubbo-invoke
   code .
   # 在VSCode中按F5启动调试
   ```

2. **检查控制台输出：**
   - 在Extension Development Host中按 `Ctrl+Shift+I`（Mac: `Cmd+Option+I`）
   - 在Console中应该看到："Dubbo Invoke Generator is now active!"

### 步骤2：打开测试文件

在Extension Development Host窗口中：
1. 打开 `example/UserService.java` 文件
2. 或者创建任意 `.java` 文件

### 步骤3：定位到方法

将光标放在以下任意位置：
- 方法名上：`getUserById`
- 参数列表中：`(String userId, boolean includeDetails)`
- 方法声明的任意位置

### 步骤4：右键生成命令

1. **右键点击** → 应该看到 "Generate Dubbo Invoke Command"
2. **点击菜单项**
3. **查看结果：**
   - 弹出提示框
   - 选择 "Copy to Clipboard" 复制命令
   - 查看 "Dubbo Invoke" 输出面板

## 故障排除清单

### ✅ 检查清单

- [ ] VSCode版本 ≥ 1.74.0
- [ ] 当前文件是 `.java` 文件
- [ ] 插件已正确编译（存在 `out/extension.js` 文件）
- [ ] 在Extension Development Host窗口中测试
- [ ] 光标位于Java方法定义上
- [ ] 控制台显示插件激活消息

### 🔧 常见问题解决

#### 问题1：右键菜单完全没有插件选项

**解决方案：**
```bash
# 1. 重新编译
npm run compile

# 2. 重启调试
# 在VSCode中按Shift+F5停止调试，然后按F5重新开始

# 3. 检查package.json语法
# 确保when条件正确：resourceExtname == '.java'
```

#### 问题2：插件激活但无法解析方法

**解决方案：**
- 确保方法语法正确
- 方法必须有明确的返回类型和参数列表
- 示例正确格式：
  ```java
  public User getUserById(String userId, boolean includeDetails);
  ```

#### 问题3：生成的命令不正确

**解决方案：**
- 检查方法参数格式：`类型 参数名`
- 确保参数之间用逗号分隔
- 复杂类型会生成通用示例，可手动修改

### 📝 调试日志

如果仍有问题，请检查以下日志：

1. **VSCode开发者工具：**
   - `Ctrl+Shift+I`（Mac: `Cmd+Option+I`）
   - 查看Console标签页的错误信息

2. **输出面板：**
   - 查看 → 输出
   - 选择 "Dubbo Invoke" 频道

3. **命令面板测试：**
   - `Ctrl+Shift+P`
   - 输入 "Generate Dubbo Invoke Command"
   - 如果能找到命令说明插件已激活

## 完整测试流程

```bash
# 1. 进入项目目录
cd /Users/hongyan/Downloads/dubbo-invoke

# 2. 安装依赖
npm install

# 3. 编译项目
npm run compile

# 4. 用VSCode打开项目
code .

# 5. 启动调试（按F5）

# 6. 在新窗口中打开example/UserService.java

# 7. 在任意方法上右键测试
```

## 成功标志

当一切正常时，您应该看到：
1. 右键菜单中有 "Generate Dubbo Invoke Command" 选项
2. 点击后弹出成功提示
3. 输出面板显示生成的命令
4. 可以复制命令到剪贴板

如果按照以上步骤仍有问题，请检查控制台错误信息或重新下载项目文件。