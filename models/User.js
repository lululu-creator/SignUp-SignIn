const bcrypt = require('bcryptjs');
const { connectDB, usersCollection } = require('../config/db');

class User {
  // 查找用户
  static async findByUsername(username) {
    try {
      const db = await connectDB();
      const user = await db.collection(usersCollection).findOne({ username });
      console.log(`查找用户 ${username}: ${user ? '找到' : '未找到'}`);
      return user;
    } catch (error) {
      console.error(`查找用户 ${username} 时出错:`, error);
      throw error;
    }
  }

  // 创建新用户
  static async create(username, email, password) {
    try {
      const db = await connectDB();
      
      // 检查用户名是否已存在
      const existingUser = await this.findByUsername(username);
      if (existingUser) {
        console.log(`用户名 ${username} 已存在`);
        throw new Error('用户名已存在');
      }
      
      // 检查邮箱是否已存在
      const existingEmail = await db.collection(usersCollection).findOne({ email });
      if (existingEmail) {
        console.log(`邮箱 ${email} 已存在`);
        throw new Error('邮箱已被使用');
      }
      
      // 对密码进行哈希处理
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(`密码哈希处理完成`);
      
      // 创建用户文档
      const result = await db.collection(usersCollection).insertOne({
        username,
        email,
        password: hashedPassword,
        createdAt: new Date()
      });
      
      console.log(`用户创建成功, ID: ${result.insertedId}`);
      return result.insertedId;
    } catch (error) {
      console.error('创建用户时出错:', error);
      throw error;
    }
  }

  // 验证用户密码
  static async validatePassword(username, password) {
    try {
      const user = await this.findByUsername(username);
      if (!user) {
        console.log(`验证密码: 用户 ${username} 不存在`);
        return false;
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(`密码验证结果: ${isMatch ? '成功' : '失败'}`);
      return isMatch;
    } catch (error) {
      console.error(`验证密码时出错:`, error);
      throw error;
    }
  }
}

module.exports = User;
