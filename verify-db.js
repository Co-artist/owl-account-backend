const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// 加载环境变量
dotenv.config();

// 连接数据库
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/acconuter')
  .then(async () => {
    console.log('MongoDB Connected');
    
    // 查询所有用户
    const users = await User.find({});
    console.log('当前数据库中的用户:', users.length);
    
    if (users.length > 0) {
      users.forEach(user => {
        console.log('\n用户信息:');
        console.log('ID:', user._id);
        console.log('用户名:', user.username);
        console.log('密码:', user.password); // 应该是加密后的密码
        console.log('创建时间:', user.createdAt);
      });
    } else {
      console.log('数据库中没有用户数据');
    }
    
    // 断开数据库连接
    mongoose.disconnect();
    console.log('\n数据库连接已断开');
  })
  .catch(error => {
    console.error('数据库连接失败:', error);
    mongoose.disconnect();
  });
