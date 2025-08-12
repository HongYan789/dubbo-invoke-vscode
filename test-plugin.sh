#!/bin/bash

echo "🚀 Dubbo Invoke Generator 插件测试脚本"
echo "========================================"

# 检查当前目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

echo "📁 当前目录：$(pwd)"

# 检查Node.js和npm
echo "🔍 检查环境..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

echo "✅ Node.js 版本：$(node --version)"
echo "✅ npm 版本：$(npm --version)"

# 检查VSCode
if ! command -v code &> /dev/null; then
    echo "⚠️  警告：VSCode命令行工具未安装，请手动打开VSCode"
else
    echo "✅ VSCode 命令行工具已安装"
fi

# 安装依赖
echo "📦 安装依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装成功"

# 编译项目
echo "🔨 编译项目..."
npm run compile

if [ $? -ne 0 ]; then
    echo "❌ 编译失败"
    exit 1
fi

echo "✅ 编译成功"

# 检查输出文件
if [ -f "out/extension.js" ]; then
    echo "✅ 插件文件生成成功：out/extension.js"
else
    echo "❌ 插件文件生成失败"
    exit 1
fi

# 检查测试文件
if [ -f "example/UserService.java" ]; then
    echo "✅ 测试文件存在：example/UserService.java"
else
    echo "❌ 测试文件不存在"
    exit 1
fi

echo ""
echo "🎉 插件准备完成！"
echo ""
echo "📋 下一步操作："
echo "1. 在VSCode中打开此项目文件夹："
echo "   code ."
echo ""
echo "2. 按 F5 启动调试模式"
echo ""
echo "3. 在新打开的窗口中："
echo "   - 打开 example/UserService.java"
echo "   - 在任意方法上右键"
echo "   - 选择 'Generate Dubbo Invoke Command'"
echo ""
echo "4. 如果看不到右键菜单，请检查："
echo "   - 文件扩展名是否为 .java"
echo "   - 是否在 Extension Development Host 窗口中"
echo "   - 控制台是否有错误信息"
echo ""
echo "🔧 故障排除："
echo "   查看详细说明：cat INSTALLATION.md"

# 自动打开VSCode（如果可用）
if command -v code &> /dev/null; then
    echo ""
    read -p "是否自动打开VSCode？(y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🚀 正在打开VSCode..."
        code .
        echo "✅ VSCode已打开，请按F5启动调试"
    fi
fi

echo ""
echo "✨ 测试完成！"