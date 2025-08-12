import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Dubbo Invoke Generator is now active!');

    // 注册原有的生成命令（显示WebView面板）
    let disposable = vscode.commands.registerCommand('dubbo-invoke.generateInvokeCommand', async () => {
        const editor = vscode.window.activeTextEditor;
        
        // 检查是否有活动编辑器
        if (!editor) {
            vscode.window.showErrorMessage('❌ 请先打开一个文件');
            return;
        }

        const document = editor.document;
        
        // 检查文件类型是否为Java
        if (document.languageId !== 'java' && !document.fileName.endsWith('.java')) {
            vscode.window.showErrorMessage('❌ 请先打开一个Java文件');
            return;
        }
        
        // 检查文件是否已保存
        if (document.isUntitled) {
            vscode.window.showErrorMessage('❌ 请先保存Java文件');
            return;
        }

        const selection = editor.selection;
        const position = selection.active;
        
        try {
            // 解析Java接口方法
            const methodInfo = await parseJavaMethod(document, position);
            
            if (methodInfo) {
                const invokeCommand = await generateDubboInvokeCommand(methodInfo);
                
                // 创建并显示WebView面板
                showDubboInvokePanel(context, methodInfo, invokeCommand);
            } else {
                // 提供更具体的错误信息
                const currentLine = document.lineAt(position.line).text.trim();
                let errorMessage = '❌ 请将光标放在Java方法上';
                
                if (currentLine === '') {
                    errorMessage = '❌ 请将光标放在Java方法定义行上（当前行为空）';
                } else if (currentLine.includes('class ') || currentLine.includes('interface ')) {
                    errorMessage = '❌ 请将光标放在方法上，而不是类或接口声明上';
                } else if (currentLine.includes('import ') || currentLine.includes('package ')) {
                    errorMessage = '❌ 请将光标放在方法上，而不是import或package语句上';
                } else if (currentLine.startsWith('//') || currentLine.startsWith('/*')) {
                    errorMessage = '❌ 请将光标放在方法上，而不是注释行上';
                }
                
                vscode.window.showErrorMessage(errorMessage);
            }
        } catch (error) {
            console.error('解析Java方法时出错:', error);
            vscode.window.showErrorMessage('❌ 解析Java方法时出错，请检查文件格式');
        }
    });

    // 注册新的快速生成到剪切板命令
    let quickGenerateDisposable = vscode.commands.registerCommand('dubbo-invoke.quickGenerateToClipboard', async () => {
        const editor = vscode.window.activeTextEditor;
        
        // 检查是否有活动编辑器
        if (!editor) {
            vscode.window.showErrorMessage('❌ 请先打开一个文件');
            return;
        }

        const document = editor.document;
        
        // 检查文件类型是否为Java
        if (document.languageId !== 'java' && !document.fileName.endsWith('.java')) {
            vscode.window.showErrorMessage('❌ 请先打开一个Java文件');
            return;
        }
        
        // 检查文件是否已保存
        if (document.isUntitled) {
            vscode.window.showErrorMessage('❌ 请先保存Java文件');
            return;
        }

        const selection = editor.selection;
        const position = selection.active;
        
        try {
            // 解析Java接口方法
            const methodInfo = await parseJavaMethod(document, position);
            
            if (methodInfo) {
                const invokeCommand = await generateDubboInvokeCommand(methodInfo);
                
                // 直接复制到剪切板
                await vscode.env.clipboard.writeText(invokeCommand);
                vscode.window.showInformationMessage(`✅ Dubbo invoke命令已复制到剪切板: ${methodInfo.methodName}()`);
            } else {
                // 提供更具体的错误信息
                const currentLine = document.lineAt(position.line).text.trim();
                let errorMessage = '❌ 请将光标放在Java方法上';
                
                if (currentLine === '') {
                    errorMessage = '❌ 请将光标放在Java方法定义行上（当前行为空）';
                } else if (currentLine.includes('class ') || currentLine.includes('interface ')) {
                    errorMessage = '❌ 请将光标放在方法上，而不是类或接口声明上';
                } else if (currentLine.includes('import ') || currentLine.includes('package ')) {
                    errorMessage = '❌ 请将光标放在方法上，而不是import或package语句上';
                } else if (currentLine.startsWith('//') || currentLine.startsWith('/*')) {
                    errorMessage = '❌ 请将光标放在方法上，而不是注释行上';
                }
                
                vscode.window.showErrorMessage(errorMessage);
            }
        } catch (error) {
            console.error('解析Java方法时出错:', error);
            vscode.window.showErrorMessage('❌ 解析Java方法时出错，请检查文件格式');
        }
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(quickGenerateDisposable);
}

let currentPanel: vscode.WebviewPanel | undefined;

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function showDubboInvokePanel(context: vscode.ExtensionContext, methodInfo: MethodInfo, invokeCommand: string) {
    // 检查是否已有面板打开，如果有则关闭
    if (currentPanel) {
        currentPanel.dispose();
    }



    // 创建WebView面板
    const panel = vscode.window.createWebviewPanel(
        'dubboInvoke',
        '🚀 Dubbo Invoke Command',
        vscode.ViewColumn.Beside,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
        }
    );

    // 保存当前面板引用
    currentPanel = panel;

    // 设置WebView内容
    panel.webview.html = getWebviewContent(methodInfo, invokeCommand);

    // 处理面板关闭事件
    panel.onDidDispose(() => {
        currentPanel = undefined;
    }, null, context.subscriptions);

    // 处理来自WebView的消息
    panel.webview.onDidReceiveMessage(
        async message => {
            switch (message.command) {
                case 'copy':
                    try {
                        console.log('收到复制请求，文本内容:', message.text);
                        
                        if (!message.text || message.text.trim() === '') {
                            vscode.window.showErrorMessage('❌ 复制失败: 命令内容为空');
                            return;
                        }
                        
                        // 使用从WebView传递过来的文本
                        await vscode.env.clipboard.writeText(message.text);
                        console.log('复制成功');
                        vscode.window.showInformationMessage('✅ Dubbo invoke命令已复制到剪贴板');
                        
                        // 发送确认消息回WebView
                        panel.webview.postMessage({
                            type: 'copySuccess',
                            message: '复制成功'
                        });
                    } catch (error) {
                        console.error('复制失败:', error);
                        vscode.window.showErrorMessage('❌ 复制失败: ' + error);
                        
                        // 发送错误消息回WebView
                        panel.webview.postMessage({
                            type: 'copyError',
                            message: '复制失败: ' + error
                        });
                    }
                    break;
                case 'close':
                    panel.dispose();
                    break;
                case 'refresh':
                    // 重新生成命令 - 智能查找Java编辑器并自动恢复焦点
                    let editor = vscode.window.activeTextEditor;
                    
                    // 如果当前没有活动编辑器（可能焦点在WebView上），尝试从可见编辑器中找到Java文件
                    if (!editor) {
                        const visibleEditors = vscode.window.visibleTextEditors;
                        editor = visibleEditors.find(e => 
                            e.document.languageId === 'java' || e.document.fileName.endsWith('.java')
                        );
                        
                        // 如果找到Java编辑器，自动将焦点切换到该编辑器
                        if (editor) {
                            await vscode.window.showTextDocument(editor.document, {
                                viewColumn: editor.viewColumn,
                                preserveFocus: false,
                                selection: editor.selection
                            });
                            // 重新获取活动编辑器（现在应该是Java编辑器）
                            editor = vscode.window.activeTextEditor;
                        }
                    }
                    
                    // 检查是否有编辑器
                    if (!editor) {
                        panel.webview.postMessage({
                            type: 'refreshError',
                            message: '请先打开一个Java文件'
                        });
                        break;
                    }
                    
                    // 检查文件类型是否为Java
                    const document = editor.document;
                    if (document.languageId !== 'java' && !document.fileName.endsWith('.java')) {
                        panel.webview.postMessage({
                            type: 'refreshError',
                            message: '请先打开一个Java文件'
                        });
                        break;
                    }
                    
                    // 检查文件是否已保存（避免处理未保存的临时文件）
                    if (document.isUntitled) {
                        panel.webview.postMessage({
                            type: 'refreshError',
                            message: '请先保存Java文件'
                        });
                        break;
                    }
                    
                    // 尝试解析Java方法
                    try {
                        const newMethodInfo = await parseJavaMethod(document, editor.selection.active);
                        if (newMethodInfo) {
                            const newCommand = await generateDubboInvokeCommand(newMethodInfo);
                            // 只更新命令内容，不重新生成整个页面
                            panel.webview.postMessage({
                                type: 'updateCommand',
                                command: newCommand,
                                methodInfo: newMethodInfo
                            });
                            vscode.window.showInformationMessage('🔄 命令已刷新');
                        } else {
                            // 提供更具体的错误信息
                            const currentLine = document.lineAt(editor.selection.active.line).text.trim();
                            let errorMessage = '请将光标放在Java方法上';
                            
                            if (currentLine === '') {
                                errorMessage = '请将光标放在Java方法定义行上（当前行为空）';
                            } else if (currentLine.includes('class ') || currentLine.includes('interface ')) {
                                errorMessage = '请将光标放在方法上，而不是类或接口声明上';
                            } else if (currentLine.includes('import ') || currentLine.includes('package ')) {
                                errorMessage = '请将光标放在方法上，而不是import或package语句上';
                            } else if (currentLine.startsWith('//') || currentLine.startsWith('/*')) {
                                errorMessage = '请将光标放在方法上，而不是注释行上';
                            }
                            
                            panel.webview.postMessage({
                                type: 'refreshError',
                                message: errorMessage
                            });
                        }
                    } catch (error) {
                        console.error('解析Java方法时出错:', error);
                        panel.webview.postMessage({
                            type: 'refreshError',
                            message: '解析Java方法时出错，请检查文件格式'
                        });
                    }
                    break;
            }
        },
        undefined,
        context.subscriptions
    );
}

function getWebviewContent(methodInfo: MethodInfo, invokeCommand: string): string {
    const nonce = getNonce();
    
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}' 'unsafe-eval';">
    <title>Dubbo Invoke Command</title>
    <style>
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            font-weight: var(--vscode-font-weight);
            padding: 20px;
            margin: 0;
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
            line-height: 1.6;
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
        }
        
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid var(--vscode-panel-border);
            padding-bottom: 16px;
            margin-bottom: 24px;
        }
        
        .header h1 {
            margin: 0;
            color: var(--vscode-foreground);
            font-size: 20px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .status-badge {
            background-color: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 500;
            text-transform: uppercase;
        }
        
        .method-info {
            background-color: var(--vscode-textBlockQuote-background);
            border: 1px solid var(--vscode-textBlockQuote-border);
            border-left: 4px solid var(--vscode-textLink-foreground);
            padding: 16px;
            margin-bottom: 24px;
            border-radius: 6px;
        }
        
        .method-info h3 {
            margin: 0 0 12px 0;
            color: var(--vscode-textLink-foreground);
            font-size: 16px;
            font-weight: 600;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 8px 16px;
            align-items: baseline;
        }
        
        .info-label {
            font-weight: 600;
            color: var(--vscode-descriptionForeground);
            font-size: 13px;
        }
        
        .info-value {
            color: var(--vscode-foreground);
            font-family: var(--vscode-editor-font-family);
        }
        
        .command-section {
            background-color: var(--vscode-textCodeBlock-background);
            border: 1px solid var(--vscode-textCodeBlock-border, var(--vscode-panel-border));
            border-radius: 6px;
            padding: 20px;
            margin-bottom: 24px;
        }
        
        .command-section h3 {
            margin: 0 0 16px 0;
            color: var(--vscode-textLink-foreground);
            font-size: 16px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .command-box {
            background-color: var(--vscode-terminal-background);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            padding: 16px;
            font-family: var(--vscode-editor-font-family);
            font-size: 13px;
            line-height: 1.5;
            color: var(--vscode-terminal-foreground);
            word-break: break-all;
            white-space: pre-wrap;
            margin-bottom: 16px;
            position: relative;
            overflow-x: auto;
        }
        
        .button-group {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            flex-wrap: wrap;
        }
        
        .btn {
            padding: 8px 16px;
            border: 1px solid transparent;
            border-radius: 2px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 6px;
            min-width: 80px;
            justify-content: center;
        }
        
        .btn:focus {
            outline: 1px solid var(--vscode-focusBorder);
            outline-offset: 2px;
        }
        
        .btn-primary {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
        }
        
        .btn-primary:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        
        .btn-secondary {
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            border-color: var(--vscode-button-border);
        }
        
        .btn-secondary:hover {
            background-color: var(--vscode-button-secondaryHoverBackground);
        }
        
        .btn-refresh {
            background-color: transparent;
            color: var(--vscode-textLink-foreground);
            border-color: var(--vscode-textLink-foreground);
        }
        
        .btn-refresh:hover {
            background-color: var(--vscode-textLink-foreground);
            color: var(--vscode-button-foreground);
        }
        
        .parameters {
            margin-top: 12px;
        }
        
        .parameter {
            background-color: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 500;
            margin-right: 8px;
            margin-bottom: 4px;
            display: inline-block;
        }
        
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--vscode-notificationsInfoIcon-foreground);
            color: var(--vscode-notifications-foreground);
            padding: 12px 20px;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            z-index: 1000;
            font-size: 13px;
            font-weight: 500;
        }
        
        .toast.show {
            opacity: 1;
            transform: translateX(0);
        }
        
        .icon {
            width: 16px;
            height: 16px;
            display: inline-block;
        }
        
        @media (max-width: 600px) {
            body {
                padding: 16px;
            }
            
            .button-group {
                justify-content: stretch;
            }
            
            .btn {
                flex: 1;
            }
            
            .info-grid {
                grid-template-columns: 1fr;
                gap: 4px;
            }
            
            .info-label {
                font-weight: 600;
                margin-bottom: 2px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>
                <span class="icon">🚀</span>
                Dubbo Invoke Generator
            </h1>
            <span class="status-badge">Ready</span>
        </div>
        
        <div class="method-info">
            <h3>
                <span class="icon">📋</span>
                方法信息
            </h3>
            <div class="info-grid">
                <span class="info-label">类名:</span>
                <span class="info-value">${methodInfo.className}</span>
                
                <span class="info-label">方法名:</span>
                <span class="info-value">${methodInfo.methodName}</span>
                
                <span class="info-label">返回类型:</span>
                <span class="info-value">${methodInfo.returnType}</span>
                
                <span class="info-label">参数:</span>
                <div class="info-value">
                    <div class="parameters">
                        ${methodInfo.parameters.length > 0 
                            ? methodInfo.parameters.map(param => 
                                `<span class="parameter">${param.type} ${param.name}</span>`
                            ).join('')
                            : '<span class="parameter">无参数</span>'
                        }
                    </div>
                </div>
            </div>
        </div>
        
        <div class="command-section">
            <h3>
                <span class="icon">⚡</span>
                生成的Dubbo Invoke命令
            </h3>
            <div class="command-box" id="commandBox">${invokeCommand}</div>
            
            <div class="button-group">
                <button class="btn btn-refresh" id="refreshBtn" title="重新生成命令">
                    <span class="icon">🔄</span>
                    刷新
                </button>
                <button class="btn btn-secondary" id="closeBtn" title="关闭面板">
                    <span class="icon">✕</span>
                    关闭
                </button>
                <button class="btn btn-primary" id="copyBtn" title="复制到剪贴板">
                    <span class="icon">📋</span>
                    复制命令
                </button>
            </div>
        </div>
        
        <div class="method-info">
            <h3>
                <span class="icon">💡</span>
                使用说明
            </h3>
            <div class="info-grid">
                <span class="info-label">步骤 1:</span>
                <span class="info-value">点击"复制命令"按钮将命令复制到剪贴板</span>
                
                <span class="info-label">步骤 2:</span>
                <span class="info-value">在Dubbo控制台或命令行工具中粘贴并执行</span>
                
                <span class="info-label">步骤 3:</span>
                <span class="info-value">根据实际情况修改参数值</span>
                
                <span class="info-label">快捷键:</span>
                <span class="info-value">Ctrl/Cmd+C 复制命令，Esc 关闭面板</span>
            </div>
        </div>
    </div>
    
    <div class="toast" id="toast">命令已复制到剪贴板！</div>
    
    <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();
        
        function copyCommand() {
            console.log('copyCommand 函数被调用');
            
            const commandBox = document.getElementById('commandBox');
            if (!commandBox) {
                console.error('找不到 commandBox 元素');
                showToast('❌ 找不到命令框', 'error');
                return;
            }
            
            let commandText = commandBox.textContent || commandBox.innerText || '';
            console.log('获取到的命令文本:', commandText);
            console.log('命令文本长度:', commandText.length);
            
            // 确保命令文本不为空
            if (!commandText.trim()) {
                console.error('命令文本为空');
                showToast('❌ 命令为空，无法复制', 'error');
                return;
            }
            
            const trimmedText = commandText.trim();
            console.log('发送复制请求，文本:', trimmedText);
            
            vscode.postMessage({
                command: 'copy',
                text: trimmedText
            });
            
            showToast('🔄 正在复制命令...', 'info');
        }
        
        function closePanel() {
            vscode.postMessage({
                command: 'close'
            });
        }
        
        function refreshCommand() {
            vscode.postMessage({
                command: 'refresh'
            });
            
            showToast('🔄 正在重新生成命令...', 'info');
        }
        
        function showToast(message, type = 'info') {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.className = 'toast show';
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
        
        // 支持键盘快捷键
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                e.preventDefault();
                copyCommand();
            }
            if (e.key === 'Escape') {
                closePanel();
            }
            if (e.key === 'F5' || ((e.ctrlKey || e.metaKey) && e.key === 'r')) {
                e.preventDefault();
                refreshCommand();
            }
        });
        
        // 添加按钮点击动画效果
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 100);
            });
        });
        
        // 页面加载完成后的初始化
        document.addEventListener('DOMContentLoaded', function() {
            console.log('页面加载完成，开始绑定事件');
            
            // 绑定按钮事件
            const copyBtn = document.getElementById('copyBtn');
            const closeBtn = document.getElementById('closeBtn');
            const refreshBtn = document.getElementById('refreshBtn');
            
            if (copyBtn) {
                console.log('绑定复制按钮事件');
                copyBtn.addEventListener('click', function(e) {
                    console.log('复制按钮被点击');
                    e.preventDefault();
                    copyCommand();
                });
                copyBtn.focus();
            } else {
                console.error('找不到复制按钮');
            }
            
            if (closeBtn) {
                console.log('绑定关闭按钮事件');
                closeBtn.addEventListener('click', function(e) {
                    console.log('关闭按钮被点击');
                    e.preventDefault();
                    closePanel();
                });
            } else {
                console.error('找不到关闭按钮');
            }
            
            if (refreshBtn) {
                console.log('绑定刷新按钮事件');
                refreshBtn.addEventListener('click', function(e) {
                    console.log('刷新按钮被点击');
                    e.preventDefault();
                    refreshCommand();
                });
            } else {
                console.error('找不到刷新按钮');
            }
            
            // 显示欢迎消息
            setTimeout(() => {
                showToast('💡 使用 Ctrl/Cmd+C 快速复制命令', 'info');
            }, 1000);
        });
        
        // 监听来自扩展的消息
        window.addEventListener('message', event => {
            const message = event.data;
            console.log('收到来自扩展的消息:', message);
            
            switch (message.type) {
                case 'update':
                    // 更新命令内容
                    const commandBox = document.getElementById('commandBox');
                    if (commandBox && message.command) {
                        commandBox.textContent = message.command;
                        console.log('更新命令框内容:', message.command);
                        showToast('✅ 命令已更新', 'success');
                    }
                    break;
                case 'updateCommand':
                    // 刷新命令内容和方法信息
                    const commandBoxRefresh = document.getElementById('commandBox');
                    if (commandBoxRefresh && message.command) {
                        commandBoxRefresh.textContent = message.command;
                        console.log('刷新命令框内容:', message.command);
                        
                        // 更新方法信息显示
                        if (message.methodInfo) {
                            const classNameEl = document.querySelector('.info-value:nth-of-type(2)');
                            const methodNameEl = document.querySelector('.info-value:nth-of-type(4)');
                            const returnTypeEl = document.querySelector('.info-value:nth-of-type(6)');
                            const parametersEl = document.querySelector('.info-value:nth-of-type(8)');
                            
                            if (classNameEl) classNameEl.textContent = message.methodInfo.className;
                            if (methodNameEl) methodNameEl.textContent = message.methodInfo.methodName;
                            if (returnTypeEl) returnTypeEl.textContent = message.methodInfo.returnType;
                            if (parametersEl) {
                                if (message.methodInfo.parameters.length > 0) {
                                    parametersEl.textContent = message.methodInfo.parameters.map(p => p.type + ' ' + p.name).join(', ');
                                } else {
                                    parametersEl.textContent = 'void';
                                }
                            }
                        }
                        
                        showToast('✅ 命令已刷新', 'success');
                    }
                    break;
                case 'refreshError':
                    console.log('刷新失败:', message.message);
                    showToast('❌ ' + message.message, 'error');
                    break;
                case 'copySuccess':
                    console.log('复制成功反馈');
                    showToast('✅ 命令已复制到剪贴板！', 'success');
                    break;
                case 'copyError':
                    console.log('复制失败反馈:', message.message);
                    showToast('❌ ' + message.message, 'error');
                    break;
            }
        });
    </script>
</body>
</html>`;
}

interface MethodInfo {
    className: string;
    methodName: string;
    parameters: Parameter[];
    returnType: string;
}

interface Parameter {
    type: string;
    name: string;
}

// 智能分割参数，正确处理泛型中的逗号
function splitParameters(parametersText: string): string[] {
    const params: string[] = [];
    let current = '';
    let depth = 0;
    
    for (let i = 0; i < parametersText.length; i++) {
        const char = parametersText[i];
        
        if (char === '<') {
            depth++;
        } else if (char === '>') {
            depth--;
        } else if (char === ',' && depth === 0) {
            if (current.trim()) {
                params.push(current.trim());
            }
            current = '';
            continue;
        }
        
        current += char;
    }
    
    if (current.trim()) {
        params.push(current.trim());
    }
    
    return params;
}

interface MethodRange {
    startLine: number;
    endLine: number;
    commentStartLine: number;
    methodName: string;
}

// 找到文件中所有方法的位置和范围
function findAllMethods(lines: string[]): MethodRange[] {
    const methods: MethodRange[] = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // 检查是否是方法声明行
        if (line.includes('(') && 
            (line.includes('public') || line.includes('private') || line.includes('protected') || 
             line.match(/^\s*[\w<>,\s\[\]]+\s+\w+\s*\(/))) {
            
            // 确保不是类声明或其他非方法声明
            if (!line.includes('class ') && !line.includes('interface ') && 
                !line.includes('enum ') && !line.includes('import ') && 
                !line.includes('package ')) {
                
                // 找到方法结束行
                let endLine = i;
                for (let j = i; j < lines.length; j++) {
                    const endLineText = lines[j].trim();
                    if (endLineText.includes(';') || endLineText.includes('{')) {
                        endLine = j;
                        break;
                    }
                }
                
                // 向上查找注释开始行
                let commentStartLine = i;
                for (let j = i - 1; j >= 0; j--) {
                    const prevLine = lines[j].trim();
                    if (prevLine === '' || prevLine.startsWith('//') || 
                        prevLine.startsWith('/*') || prevLine.startsWith('*') || 
                        prevLine.endsWith('*/')) {
                        commentStartLine = j;
                        // 如果遇到注释开始，继续向上查找
                        if (prevLine.startsWith('/**')) {
                            commentStartLine = j;
                            break;
                        }
                    } else {
                        // 遇到非注释非空行，停止查找
                        commentStartLine = j + 1;
                        break;
                    }
                }
                
                // 提取方法名
                const methodMatch = line.match(/\s+(\w+)\s*\(/);
                const methodName = methodMatch ? methodMatch[1] : 'unknown';
                
                methods.push({
                    startLine: i,
                    endLine: endLine,
                    commentStartLine: commentStartLine,
                    methodName: methodName
                });
            }
        }
    }
    
    return methods;
}

// 根据光标位置找到对应的方法
function findMethodAtPosition(methods: MethodRange[], cursorLine: number): MethodRange | null {
    for (const method of methods) {
        // 检查光标是否在方法的注释区域或方法声明区域内
        if (cursorLine >= method.commentStartLine && cursorLine <= method.endLine) {
            return method;
        }
    }
    
    return null;
}

async function parseJavaMethod(document: vscode.TextDocument, position: vscode.Position): Promise<MethodInfo | null> {
    const text = document.getText();
    const lines = text.split('\n');
    
    // 使用新的方法定位逻辑
    const allMethods = findAllMethods(lines);
    const targetMethod = findMethodAtPosition(allMethods, position.line);
    
    if (!targetMethod) {
        return null;
    }
    
    // 使用找到的方法行进行解析
    let methodStartLine = targetMethod.startLine;
    let methodEndLine = targetMethod.endLine;
    
    // 提取方法文本，处理多行方法声明
    let methodText = lines.slice(methodStartLine, methodEndLine + 1).join(' ').trim();
    
    // 清理多余的空格和换行符
    methodText = methodText.replace(/\s+/g, ' ').trim();
    
    // 改进的方法签名解析，支持泛型返回类型
    // 匹配模式：[访问修饰符] [返回类型] 方法名(参数列表)
    const methodMatch = methodText.match(/(?:public|private|protected)?\s*([\w<>,\s\[\]]+)\s+(\w+)\s*\(([^)]*)\)/);
    if (!methodMatch) {
        return null;
    }
    
    const returnType = methodMatch[1].trim();
    const methodName = methodMatch[2];
    const parametersText = methodMatch[3];
    
    // 解析import语句
    const imports = new Map<string, string>();
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const importMatch = line.match(/import\s+([\w.]+\.(\w+));/);
        if (importMatch) {
            const fullPath = importMatch[1];
            const className = importMatch[2];
            imports.set(className, fullPath);
        }
    }
    
    // 查找包名和类名
    let packageName = '';
    let className = '';
    
    // 查找包名
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const packageMatch = line.match(/package\s+([\w.]+);/);
        if (packageMatch) {
            packageName = packageMatch[1];
            break;
        }
    }
    
    // 查找类名
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const classMatch = line.match(/(?:public\s+)?(?:interface|class)\s+(\w+)/);
        if (classMatch) {
            className = classMatch[1];
            break;
        }
    }
    
    // 解析参数并获取完整类型路径
    const parameters: Parameter[] = [];
    if (parametersText.trim()) {
        // 改进的参数分割逻辑，正确处理泛型中的逗号
        const paramParts = splitParameters(parametersText);
        for (const param of paramParts) {
            const paramMatch = param.trim().match(/^([\w<>,\s\[\]]+)\s+(\w+)$/);
            if (paramMatch) {
                let paramType = paramMatch[1].trim();
                const paramName = paramMatch[2];
                
                // 获取参数类型的完整路径
                const fullParamType = await resolveFullTypePath(paramType, imports, packageName, document.uri);
                
                parameters.push({
                    type: fullParamType,
                    name: paramName
                });
            }
        }
    }
    
    // 组合完整的类名（包名.类名）
    const fullClassName = packageName ? `${packageName}.${className}` : className;
    
    return {
        className: fullClassName,
        methodName,
        parameters,
        returnType
    };
}

async function resolveFullTypePath(typeName: string, imports: Map<string, string>, currentPackage: string, currentFileUri: vscode.Uri): Promise<string> {
    // 处理泛型类型，如 List<User> -> List, User
    const genericMatch = typeName.match(/^([^<]+)(<(.+)>)?/);
    if (!genericMatch) {
        return typeName;
    }
    
    const baseType = genericMatch[1].trim();
    const genericPart = genericMatch[2] || '';
    const genericTypes = genericMatch[3] || '';
    
    // 如果是基本类型，直接返回
    const primitiveTypes = ['int', 'long', 'double', 'float', 'boolean', 'byte', 'short', 'char', 'String', 'void'];
    if (primitiveTypes.includes(baseType)) {
        return typeName;
    }
    
    // 如果已经是完整路径（包含点），直接返回
    if (baseType.includes('.')) {
        return typeName;
    }
    
    // 解析基础类型的完整路径
    let resolvedBaseType = baseType;
    
    // 检查import中是否有该类型
    if (imports.has(baseType)) {
        resolvedBaseType = imports.get(baseType)!;
    } else {
        // 在项目中搜索该类型
        const foundPath = await searchTypeInProject(baseType, currentFileUri);
        if (foundPath) {
            resolvedBaseType = foundPath;
        } else {
            // 如果都找不到，使用当前包名
            resolvedBaseType = currentPackage ? `${currentPackage}.${baseType}` : baseType;
        }
    }
    
    // 如果有泛型参数，递归处理泛型类型
    if (genericTypes) {
        const genericParams = splitParameters(genericTypes);
        const resolvedGenericParams = await Promise.all(
            genericParams.map(param => resolveFullTypePath(param.trim(), imports, currentPackage, currentFileUri))
        );
        return `${resolvedBaseType}<${resolvedGenericParams.join(', ')}>`;
    }
    
    return resolvedBaseType;
}

async function searchTypeInProject(typeName: string, currentFileUri: vscode.Uri): Promise<string | null> {
    try {
        // 获取工作区文件夹
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(currentFileUri);
        if (!workspaceFolder) {
            return null;
        }
        
        // 搜索Java文件
        const pattern = new vscode.RelativePattern(workspaceFolder, `**/${typeName}.java`);
        const files = await vscode.workspace.findFiles(pattern, '**/node_modules/**', 10);
        
        if (files.length > 0) {
            // 读取第一个找到的文件，获取其包名
            const document = await vscode.workspace.openTextDocument(files[0]);
            const text = document.getText();
            const lines = text.split('\n');
            
            for (const line of lines) {
                const packageMatch = line.trim().match(/package\s+([\w.]+);/);
                if (packageMatch) {
                    return `${packageMatch[1]}.${typeName}`;
                }
            }
        }
        
        return null;
    } catch (error) {
        console.error('搜索类型时出错:', error);
        return null;
    }
}

// 生成参数的默认值
function generateDefaultValue(paramType: string): string {
    // 处理基本类型
    if (paramType === 'String') {
        return `"example"`;
    } else if (paramType === 'int' || paramType === 'Integer') {
        return '1';
    } else if (paramType === 'boolean' || paramType === 'Boolean') {
        return 'true';
    } else if (paramType === 'long' || paramType === 'Long') {
        return '1L';
    } else if (paramType === 'double' || paramType === 'Double') {
        return '1.0';
    } else if (paramType === 'float' || paramType === 'Float') {
        return '1.0f';
    } else if (paramType === 'byte' || paramType === 'Byte') {
        return '1';
    } else if (paramType === 'short' || paramType === 'Short') {
        return '1';
    } else if (paramType === 'char' || paramType === 'Character') {
        return "'a'";
    }
    
    // 处理泛型类型
    if (paramType.includes('<')) {
        const baseType = paramType.split('<')[0];
        
        // List类型
        if (baseType.endsWith('List') || baseType === 'java.util.List') {
            const genericType = paramType.match(/<(.+)>/)?.[1] || 'Object';
            const elementValue = generateDefaultValue(genericType.trim());
            return `[${elementValue}]`;
        }
        
        // Map类型
        if (baseType.endsWith('Map') || baseType === 'java.util.Map') {
            const genericTypes = paramType.match(/<(.+)>/)?.[1] || 'String, Object';
            const types = splitParameters(genericTypes);
            const keyValue = types.length > 0 ? generateDefaultValue(types[0].trim()) : '"key"';
            const valueValue = types.length > 1 ? generateDefaultValue(types[1].trim()) : '"value"';
            return `{"${keyValue}": ${valueValue}}`;
        }
        
        // Set类型
        if (baseType.endsWith('Set') || baseType === 'java.util.Set') {
            const genericType = paramType.match(/<(.+)>/)?.[1] || 'Object';
            const elementValue = generateDefaultValue(genericType.trim());
            return `[${elementValue}]`;
        }
        
        // 其他泛型类型，如SearchResult<User>
        return `{"class":"${paramType}", "example":"value"}`;
    }
    
    // 数组类型
    if (paramType.endsWith('[]')) {
        const elementType = paramType.slice(0, -2);
        const elementValue = generateDefaultValue(elementType);
        return `[${elementValue}]`;
    }
    
    // 对象类型，使用完整类路径生成Dubbo格式
    return `{"class":"${paramType}", "example":"value"}`;
}

async function generateDubboInvokeCommand(methodInfo: MethodInfo): Promise<string> {
    const { className, methodName, parameters } = methodInfo;
    
    // 构建参数字符串
    let paramStr = '';
    if (parameters.length > 0) {
        const paramParts = parameters.map(param => generateDefaultValue(param.type));
        paramStr = paramParts.join(', ');
    }
    
    // 按照用户要求，命令以invoke开头，格式为: invoke 完整类名 方法名(参数)
    return `invoke ${className} ${methodName}(${paramStr})`;
}

export function deactivate() {}