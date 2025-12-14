const http = require('http');

// 发送POST请求的函数
function sendPostRequest(path, data, callback) {
  const postData = JSON.stringify(data);
  
  const options = {
    hostname: 'localhost',
    port: 5001,
    path: `/api${path}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let body = '';
    
    res.on('data', (chunk) => {
      body += chunk;
    });
    
    res.on('end', () => {
      callback(null, {
        statusCode: res.statusCode,
        data: JSON.parse(body)
      });
    });
  });
  
  req.on('error', (e) => {
    callback(e);
  });
  
  req.write(postData);
  req.end();
}

// 测试注册API
function testRegister() {
  console.log('测试注册API...');
  
  sendPostRequest('/auth/register', {
    username: 'testuser',
    password: 'password123'
  }, (error, response) => {
    if (error) {
      console.error('注册失败:', error.message);
      return;
    }
    
    console.log(`注册响应状态码: ${response.statusCode}`);
    console.log('注册响应数据:', response.data);
    
    if (response.statusCode === 201) {
      // 注册成功后测试登录
      testLogin();
    }
  });
}

// 测试登录API
function testLogin() {
  console.log('测试登录API...');
  
  sendPostRequest('/auth/login', {
    username: 'testuser',
    password: 'password123'
  }, (error, response) => {
    if (error) {
      console.error('登录失败:', error.message);
      return;
    }
    
    console.log(`登录响应状态码: ${response.statusCode}`);
    console.log('登录响应数据:', response.data);
  });
}

// 运行测试
testRegister();
