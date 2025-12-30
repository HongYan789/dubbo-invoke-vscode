
// 模拟 splitParameters 函数
function splitParameters(parametersText) {
    const params = [];
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

// 复制修改后的 generateDefaultValue 函数
function generateDefaultValue(paramType) {
    // 移除 java.lang. 前缀，简化匹配
    const simpleType = paramType.replace(/^java\.lang\./, '');

    // 处理基本类型
    if (simpleType === 'String') {
        return `"example"`;
    } else if (simpleType === 'int' || simpleType === 'Integer') {
        return '1';
    } else if (simpleType === 'boolean' || simpleType === 'Boolean') {
        return 'true';
    } else if (simpleType === 'long' || simpleType === 'Long') {
        return '1L';
    } else if (simpleType === 'double' || simpleType === 'Double') {
        return '1.0';
    } else if (simpleType === 'float' || simpleType === 'Float') {
        return '1.0f';
    } else if (simpleType === 'byte' || simpleType === 'Byte') {
        return '1';
    } else if (simpleType === 'short' || simpleType === 'Short') {
        return '1';
    } else if (simpleType === 'char' || simpleType === 'Character') {
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

// 测试用例
const testCases = [
    { input: 'Long', expected: '1L' },
    { input: 'java.lang.Long', expected: '1L' },
    { input: 'Integer', expected: '1' },
    { input: 'java.lang.Integer', expected: '1' },
    { input: 'List<Long>', expected: '[1L]' },
    { input: 'java.util.List<java.lang.Long>', expected: '[1L]' },
    { input: 'List<Integer>', expected: '[1]' },
    { input: 'String', expected: '"example"' },
    { input: 'com.example.User', expected: '{"class":"com.example.User", "example":"value"}' }
];

let failed = false;
console.log('Running tests...');
testCases.forEach(tc => {
    const result = generateDefaultValue(tc.input);
    if (result !== tc.expected) {
        console.error(`FAILED: Input "${tc.input}" => Expected "${tc.expected}", but got "${result}"`);
        failed = true;
    } else {
        console.log(`PASSED: Input "${tc.input}" => "${result}"`);
    }
});

if (failed) {
    process.exit(1);
} else {
    console.log('All tests passed!');
}
