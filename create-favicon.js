const fs = require('fs');
const path = require('path');

// 创建一个简单的1x1像素透明ICO文件
// 这是一个最小的有效ICO文件，包含一个1x1透明像素
const minimalIcoContent = Buffer.from([
  0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x01, 
  0x00, 0x00, 0x01, 0x00, 0x18, 0x00, 0x0A, 0x00, 
  0x00, 0x00, 0x16, 0x00, 0x00, 0x00, 0x28, 0x00, 
  0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 
  0x00, 0x00, 0x01, 0x00, 0x18, 0x00, 0x00, 0x00, 
  0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00
]);

const faviconPath = path.join(__dirname, 'favicon.ico');

// 写入文件
fs.writeFile(faviconPath, minimalIcoContent, (err) => {
  if (err) {
    console.error('创建favicon.ico失败:', err);
  } else {
    console.log(`成功创建favicon.ico文件: ${faviconPath}`);
  }
});
