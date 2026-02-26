const http = require('http');

// 测试注册功能
function testRegister() {
  console.log('测试注册功能...');
  
  const postData = JSON.stringify({
    name: '测试用户',
    email: 'test@example.com',
    password: '123456'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`状态码: ${res.statusCode}`);
    console.log(`响应头: ${JSON.stringify(res.headers)}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('注册响应:', data);
      testLogin();
    });
  });

  req.on('error', (e) => {
    console.error(`请求错误: ${e.message}`);
  });

  req.write(postData);
  req.end();
}

// 测试登录功能
function testLogin() {
  console.log('\n测试登录功能...');
  
  const postData = JSON.stringify({
    email: 'test@example.com',
    password: '123456'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`状态码: ${res.statusCode}`);
    console.log(`响应头: ${JSON.stringify(res.headers)}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('登录响应:', data);
    });
  });

  req.on('error', (e) => {
    console.error(`请求错误: ${e.message}`);
  });

  req.write(postData);
  req.end();
}

// 运行测试
testRegister();