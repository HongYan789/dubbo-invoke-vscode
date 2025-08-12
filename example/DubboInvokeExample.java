package com.example.service;

import org.apache.dubbo.config.ApplicationConfig;
import org.apache.dubbo.config.ReferenceConfig;
import org.apache.dubbo.config.RegistryConfig;
import org.apache.dubbo.config.utils.ReferenceConfigCache;

/**
 * Dubbo服务调用示例
 * 调用: com.example.service.UserService.getUserById("example", true)
 */
public class DubboInvokeExample {
    
    public static void main(String[] args) {
        try {
            // 配置应用信息
            ApplicationConfig application = new ApplicationConfig();
            application.setName("dubbo-invoke-consumer");
            
            // 配置注册中心
            RegistryConfig registry = new RegistryConfig();
            registry.setAddress("zookeeper://127.0.0.1:2181"); // 根据实际情况修改
            
            // 配置服务引用
            ReferenceConfig<UserService> reference = new ReferenceConfig<>();
            reference.setApplication(application);
            reference.setRegistry(registry);
            reference.setInterface(UserService.class);
            reference.setVersion("1.0.0"); // 根据实际版本修改
            reference.setGroup("default"); // 根据实际分组修改
            
            // 获取服务代理
            ReferenceConfigCache cache = ReferenceConfigCache.getCache();
            UserService userService = cache.get(reference);
            
            // 调用服务方法
            System.out.println("正在调用: UserService.getUserById(\"example\", true)");
            User user = userService.getUserById("example", true);
            
            // 输出结果
            if (user != null) {
                System.out.println("调用成功!");
                System.out.println("用户信息: " + user.toString());
            } else {
                System.out.println("调用成功，但返回结果为null");
            }
            
        } catch (Exception e) {
            System.err.println("调用失败: " + e.getMessage());
            e.printStackTrace();
        }
    }
}