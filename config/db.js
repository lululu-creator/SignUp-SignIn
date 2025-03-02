const { MongoClient } = require('mongodb');

// MongoDB连接URI (增加了更好的错误处理和重试逻辑)
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,  // 超时时间
  retryWrites: true                // 自动重试写操作
});

// 数据库和集合名称
const dbName = "userAuth";
const usersCollection = "users";

// 连接到MongoDB
async function connectDB() {
  try {
    await client.connect();
    console.log("成功连接到MongoDB");
    
    // 测试数据库连接
    const db = client.db(dbName);
    // 确保用户集合存在
    if (!(await db.listCollections({name: usersCollection}).hasNext())) {
      await db.createCollection(usersCollection);
      console.log(`创建集合: ${usersCollection}`);
      
      // 给用户名和邮箱创建唯一索引
      await db.collection(usersCollection).createIndex(
        { username: 1 }, { unique: true }
      );
      await db.collection(usersCollection).createIndex(
        { email: 1 }, { unique: true }
      );
      console.log("创建唯一索引: username, email");
    }
    
    return db;
  } catch (error) {
    console.error("MongoDB连接失败:", error);
    throw error;  // 让调用者处理错误
  }
}

module.exports = {
  connectDB,
  usersCollection
};
