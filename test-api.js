const axios = require('axios');

// 创建axios实例
const apiClient = axios.create({
  baseURL: 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 测试注册API
async function testRegister() {
  try {
    console.log('测试注册API...');
    const response = await apiClient.post('/auth/register', {
      username: 'testuser',
      password: 'password123'
    });
    console.log('注册成功:', response.data);
    return response.data;
  } catch (error) {
    console.error('注册失败:', error.message);
    if (error.response) {
      console.error('响应数据:', error.response.data);
      console.error('响应状态:', error.response.status);
    } else if (error.request) {
      console.error('请求已发送但没有收到响应:', error.request);
    }
  }
}

// 测试登录API
async function testLogin(username, password) {
  try {
    console.log('测试登录API...');
    const response = await apiClient.post('/auth/login', {
      username,
      password
    });
    console.log('登录成功:', response.data);
    return response.data;
  } catch (error) {
    console.error('登录失败:', error.message);
    if (error.response) {
      console.error('响应数据:', error.response.data);
      console.error('响应状态:', error.response.status);
    } else if (error.request) {
      console.error('请求已发送但没有收到响应:', error.request);
    }
  }
}

// 运行测试
async function runTests() {
  // 先测试注册
  const registerResult = await testRegister();
  
  if (registerResult) {
    // 注册成功后测试登录
    await testLogin('testuser', 'password123');
  }
}

runTests();
