const User = require('../models/User');

// 处理用户注册请求
async function register(req, res) {
  try {
    console.log("收到注册请求:", req.body);
    const { username, email, password } = req.body;
    
    // 简单的输入验证
    if (!username || !email || !password) {
      console.log("注册验证失败: 缺少必填字段");
      return res.status(400).json({ error: '所有字段都是必填的' });
    }
    
    // 创建新用户
    const userId = await User.create(username, email, password);
    console.log("用户创建成功:", userId);
    
    // 注册成功
    res.status(201).json({ message: '用户注册成功' });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(400).json({ error: error.message || '注册失败' });
  }
}

// 处理用户登录请求
async function login(req, res) {
  try {
    console.log("收到登录请求:", req.body);
    const { username, password } = req.body;
    
    // 简单的输入验证
    if (!username || !password) {
      console.log("登录验证失败: 缺少必填字段");
      return res.status(400).json({ error: '用户名和密码都是必填的' });
    }
    
    // 检查用户是否存在
    const user = await User.findByUsername(username);
    if (!user) {
      console.log("登录失败: 用户不存在");
      return res.status(401).json({ error: '用户名或密码不正确' });
    }
    
    // 验证密码
    const isValid = await User.validatePassword(username, password);
    console.log("密码验证结果:", isValid);
    
    if (!isValid) {
      console.log("登录失败: 密码不正确");
      return res.status(401).json({ error: '用户名或密码不正确' });
    }
    
    // 登录成功
    console.log("登录成功:", username);
    res.status(200).json({ message: '登录成功', username });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(400).json({ error: '登录失败' });
  }
}

module.exports = {
  register,
  login
};
