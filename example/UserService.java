package com.example.service;

import java.util.List;
import java.util.Map;

/**
 * 用户服务接口 - 用于测试Dubbo Invoke Generator插件
 */
public interface UserService {
    
    /**
     * 根据用户ID获取用户信息
     * @param userId 用户ID
     * @param includeDetails 是否包含详细信息
     * @return 用户对象
     */
    User getUserById(String userId, boolean includeDetails);
    
    /**
     * 根据年龄范围获取用户列表
     * @param minAge 最小年龄
     * @param maxAge 最大年龄
     * @return 用户列表
     */
    List<User> getUsersByAge(int minAge, int maxAge);
    
    /**
     * 更新用户信息
     * @param user 用户对象
     */
    void updateUser(User user);
    
    /**
     * 批量创建用户
     * @param users 用户列表
     * @param options 创建选项
     * @return 创建结果
     */
    Map<String, Object> batchCreateUsers(List<User> users, Map<String, String> options);
    
    /**
     * 删除用户
     * @param userId 用户ID
     * @return 是否删除成功
     */
    boolean deleteUser(String userId);
    
    /**
     * 获取用户统计信息
     * @return 统计数据
     */
    UserStats getUserStats();
    
    /**
     * 搜索用户
     * @param keyword 关键词
     * @param pageSize 页面大小
     * @param pageNum 页码
     * @return 搜索结果
     */
    SearchResult<User> searchUsers(String keyword, int pageSize, int pageNum);
}

/**
 * 用户实体类
 */
class User {
    private String id;
    private String name;
    private int age;
    private String email;
    
    // getters and setters...
}

/**
 * 用户统计信息
 */
class UserStats {
    private long totalUsers;
    private double averageAge;
    private Map<String, Integer> ageDistribution;
    
    // getters and setters...
}

/**
 * 搜索结果
 */
class SearchResult<T> {
    private List<T> data;
    private long total;
    private int pageSize;
    private int pageNum;
    
    // getters and setters...
}