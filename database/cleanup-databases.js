const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// MongoDB连接字符串
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';

// 定义需要删除的数据库
const databasesToDelete = ['accounting-app', 'accounting_app'];
const currentProjectDatabase = 'acconuter';

// 异步函数来删除数据库
async function deleteDatabase(client, databaseName) {
  try {
    // 获取数据库
    const db = client.db(databaseName);
    
    // 删除数据库
    await db.dropDatabase();
    console.log(`✅ 已成功删除数据库: ${databaseName}`);
    return true;
  } catch (error) {
    console.error(`❌ 删除数据库 ${databaseName} 失败:`, error.message);
    return false;
  }
}

// 主函数
async function main() {
  const client = new MongoClient(uri);

  try {
    // 连接到MongoDB
    await client.connect();
    console.log('MongoDB Connected');
    
    // 获取所有数据库
    const databasesList = await client.db().admin().listDatabases();
    console.log('当前所有数据库:', databasesList.databases.map(db => db.name));
    
    // 遍历并删除无用的数据库
    for (const databaseName of databasesToDelete) {
      await deleteDatabase(client, databaseName);
    }
    
    // 断开连接
    await client.close();
    console.log('\n✅ 数据库清理完成！');
    console.log(`✅ 保留的数据库: ${[currentProjectDatabase, 'admin', 'config', 'local'].join(', ')}`);
  } catch (error) {
    console.error('❌ 数据库操作失败:', error.message);
    await client.close();
  }
}

// 运行主函数
main();
