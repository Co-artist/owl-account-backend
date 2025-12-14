const mongoose = require('mongoose');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 连接数据库
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/acconuter')
  .then(() => {
    console.log('MongoDB Connected');
    return cleanupDatabase();
  })
  .then(() => {
    console.log('Database cleanup completed');
    mongoose.disconnect();
  })
  .catch((error) => {
    console.error('Error:', error);
    mongoose.disconnect();
  });

// 清理数据库
async function cleanupDatabase() {
  try {
    // 获取所有集合
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    console.log('当前数据库中的集合:', collections.map(c => c.name));
    
    // 遍历所有集合
    for (const collection of collections) {
      const collectionName = collection.name;
      
      // 跳过系统集合
      if (collectionName.startsWith('system.')) {
        continue;
      }
      
      // 获取集合中的文档数量
      const count = await mongoose.connection.db.collection(collectionName).countDocuments();
      console.log(`${collectionName}: ${count} 个文档`);
      
      // 检查是否需要清理
      if (count > 0) {
        // 只清理用户集合中的测试数据，其他集合暂时保留
        if (collectionName === 'users') {
          console.log(`清理 ${collectionName} 集合中的测试数据`);
          // 删除所有用户数据（保留集合结构）
          await mongoose.connection.db.collection(collectionName).deleteMany({});
          console.log(`${collectionName} 集合已清理`);
        } else {
          console.log(`保留 ${collectionName} 集合中的数据`);
        }
      }
    }
    
    console.log('数据库清理完成');
  } catch (error) {
    console.error('清理数据库时出错:', error);
    throw error;
  }
}
