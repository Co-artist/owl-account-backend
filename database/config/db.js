const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // 连接MongoDB数据库，移除已废弃的选项，添加默认连接字符串
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/acconuter');
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
