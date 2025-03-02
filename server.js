const http = require('http');
const { connectDB } = require('./config/db');
const authController = require('./controllers/authController');
const fs = require('fs');
const path = require('path');

// 创建服务器
const server = http.createServer(async (req, res) => {
  // 添加自定义响应方法
  res.status = function(statusCode) {
    this.statusCode = statusCode;
    return this;
  };

  res.json = function(data) {
    this.setHeader('Content-Type', 'application/json');
    this.end(JSON.stringify(data));
  };
  
  // 设置CORS头，允许前端页面访问
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 处理favicon.ico请求
  if (req.method === 'GET' && req.url === '/favicon.ico') {
    // 检查favicon文件是否存在
    const faviconPath = path.join(__dirname, 'favicon.ico');
    fs.access(faviconPath, fs.constants.F_OK, (err) => {
      if (err) {
        // 如果文件不存在，返回404
        res.writeHead(404);
        res.end();
      } else {
        // 如果文件存在，返回favicon
        fs.readFile(faviconPath, (err, content) => {
          if (err) {
            res.writeHead(500);
            res.end('服务器错误');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'image/x-icon' });
          res.end(content);
        });
      }
    });
    return;
  }
  
  // 处理静态文件请求
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('服务器错误');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });
    return;
  }

  if (req.method === 'GET' && req.url === '/index.css') {
    const filePath = path.join(__dirname, 'index.css');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('服务器错误');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(content);
    });
    return;
  }

  if (req.method === 'GET' && req.url === '/index.js') {
    const filePath = path.join(__dirname, 'index.js');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('服务器错误');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      res.end(content);
    });
    return;
  }

  // 处理API路由
  if (req.method === 'POST') {
    const chunks = [];

    req.on('data', (chunk) => {
      chunks.push(chunk);
    });

    req.on('end', async () => {
      if (chunks.length > 0) {
        try {
          const data = Buffer.concat(chunks).toString();
          console.log("收到POST数据:", data);
          
          try {
            const body = JSON.parse(data);
            req.body = body;
            
            console.log("解析后的请求体:", body);

            // 处理注册请求
            if (req.url === '/api/register') {
              console.log("处理注册请求");
              await authController.register(req, res);
              return;
            }

            // 处理登录请求
            if (req.url === '/api/login') {
              console.log("处理登录请求");
              await authController.login(req, res);
              return;
            }

            // 未找到路由
            console.log("未找到路由:", req.url);
            res.writeHead(404);
            res.end(JSON.stringify({ error: '未找到路由' }));
          } catch (jsonError) {
            console.error("JSON解析错误:", jsonError);
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'JSON格式不正确: ' + jsonError.message }));
          }
        } catch (error) {
          console.error("请求处理错误:", error);
          res.writeHead(400);
          res.end(JSON.stringify({ error: '无效的请求数据' }));
        }
      } else {
        console.log("请求体为空");
        res.writeHead(400);
        res.end(JSON.stringify({ error: '请求体为空' }));
      }
    });
  } else {
    // 处理其他请求
    res.writeHead(404);
    res.end(JSON.stringify({ error: '未找到路由' }));
  }
});

const PORT = process.env.PORT || 3000;

// 连接数据库并启动服务器
async function startServer() {
  try {
    // 确保数据库连接成功
    await connectDB();
    
    // 启动服务器
    server.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('启动服务器失败:', error);
    process.exit(1);
  }
}

startServer();
