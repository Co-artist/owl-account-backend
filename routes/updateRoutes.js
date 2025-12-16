import { Router } from 'express';
const router = Router();

// 获取最新版本信息
// 客户端插件会自动请求这个接口
router.get('/check', (req, res) => {
  res.json({
    // 当前最新版本号 (当您想发布更新时，修改这个版本号，例如 '1.0.1')
    version: '0.0.6',
    
    // 更新包下载地址 (将 dist-xxx.zip 上传到云存储或服务器后的直链)
    // 使用 Render 的 URL
    url: 'https://owl-account-backend.onrender.com/updates/dist-0.0.6.zip',
    
    // 可选：更新说明
    note: 'Added smooth slide transitions for tab navigation'
  });
});

export default router;
