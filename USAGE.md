# Dubbo Invoke Generator 使用指南

## 快速开始

### 1. 安装插件

#### 方法一：从源码安装（推荐）

1. 下载或克隆此项目到本地
2. 在项目根目录打开终端，执行以下命令：

```bash
# 安装依赖
npm install

# 编译插件
npm run compile
```

3. 在VSCode中按 `Ctrl+Shift+P`（Mac: `Cmd+Shift+P`）打开命令面板
4. 输入 "Extensions: Install from VSIX..."
5. 如果需要打包，先安装vsce：

```bash
npm install -g vsce
vsce package
```

然后选择生成的 `.vsix` 文件进行安装

#### 方法二：开发模式测试

1. 在VSCode中打开此项目文件夹
2. 按 `F5` 启动Extension Development Host
3. 在新打开的VSCode窗口中测试插件功能

### 2. 使用插件

#### 步骤1：打开Java文件
在VSCode中打开包含Dubbo接口的Java文件（如项目中的 `example/UserService.java`）

#### 步骤2：定位方法
将光标定位到要生成invoke命令的方法上，可以是：
- 方法名上
- 方法参数上
- 方法的任意位置

#### 步骤3：生成命令
右键点击，在上下文菜单中选择 "Generate Dubbo Invoke Command"

#### 步骤4：获取结果
插件会：
1. 弹出提示框显示命令已生成
2. 询问是否复制到剪贴板
3. 在"Dubbo Invoke"输出面板中显示完整命令

## 功能演示

### 示例1：简单方法

对于以下方法：
```java
User getUserById(String userId, boolean includeDetails);
```

生成的命令：
```bash
dubbo invoke UserService getUserById("example_userId", true)
```

### 示例2：复杂参数

对于以下方法：
```java
Map<String, Object> batchCreateUsers(List<User> users, Map<String, String> options);
```

生成的命令：
```bash
dubbo invoke UserService batchCreateUsers([], {})
```

### 示例3：自定义对象参数

对于以下方法：
```java
void updateUser(User user);
```

生成的命令：
```bash
dubbo invoke UserService updateUser({"example": "user"})
```

## 支持的数据类型

| Java类型 | 生成的示例值 |
|---------|-------------|
| String | `"example_paramName"` |
| int/Integer | `0` |
| long/Long | `0L` |
| double/Double | `0.0` |
| float/Float | `0.0f` |
| boolean/Boolean | `true` |
| List/ArrayList | `[]` |
| Map/HashMap | `{}` |
| 自定义对象 | `{"example": "paramName"}` |
| List<T> | `[]` |
| Map<K,V> | `{}` |

## 故障排除

### 问题1：右键菜单没有显示插件选项

**解决方案：**
- 确保当前文件是 `.java` 文件
- 确保插件已正确安装并激活
- 重启VSCode

### 问题2：无法解析方法

**解决方案：**
- 确保光标位置在方法定义上
- 检查方法语法是否正确
- 方法必须有明确的返回类型和方法名

### 问题3：生成的参数不正确

**解决方案：**
- 检查方法参数声明是否规范
- 对于复杂类型，可以手动修改生成的命令
- 确保参数类型和名称之间有空格

## 开发和调试

### 启用调试模式

1. 在项目根目录打开VSCode
2. 按 `F5` 启动调试
3. 在Extension Development Host中测试功能
4. 查看Debug Console中的日志输出

### 修改和重新编译

```bash
# 监听模式编译（自动重新编译）
npm run watch

# 手动编译
npm run compile
```

### 查看日志

在VSCode中：
1. 打开 "View" → "Output"
2. 在下拉菜单中选择 "Dubbo Invoke"
3. 查看插件生成的命令和调试信息

## 自定义配置

目前插件使用默认配置，未来版本可能会支持：
- 自定义参数示例值
- 配置输出格式
- 支持更多Dubbo命令选项

## 贡献代码

欢迎提交Issue和Pull Request！

1. Fork此项目
2. 创建功能分支
3. 提交更改
4. 创建Pull Request

## 许可证

MIT License - 详见LICENSE文件