const router = require('express').Router();
const Backstage = require('./backstage.controller');

module.exports = router;

/*******后台接口*******/
router.post('/registerAdmin', Backstage.register);        // 注册
router.post('/loginAdmin', Backstage.login);              // 登录
router.get('/currentAdmin', Backstage.getCurrent);        // 获取当前用户
router.post('/updateAdmin', Backstage.updateAdmin);       // 更新当前用户

router.post('/queryAdmin', Backstage.queryAdmin);         // 获取用户列表

router.post('/queryClerk', Backstage.queryClerk);         // 职位
router.post('/updateClerk', Backstage.updateClerk);       // 创建/更新职位
router.post('/deleteClerk', Backstage.deleteClerk);       // 删除职位

router.post('/queryClerk', Backstage.queryClerk);         // 职位
router.post('/updateClerk', Backstage.updateClerk);       // 创建/更新职位
router.post('/deleteClerk', Backstage.deleteClerk);       // 删除职位

router.post('/queryApp', Backstage.queryApp);             // App版本
router.post('/updateApp', Backstage.updateApp);           // 创建/更新App版本
router.post('/deleteApp', Backstage.deleteApp);           // 删除App版本
router.get('/latestAppVersion', Backstage.latestAppVersion);    // App最新版本

router.post('/queryClient', Backstage.queryClient);             // 客户
router.post('/updateClient', Backstage.updateClient);           // 创建/更新客户
router.post('/updateRecords', Backstage.updateRecords);         // 跟进记录
router.post('/functionManage', Backstage.functionManage);       // 功能管理
router.post('/filesManage', Backstage.filesManage);             // 附件管理
// router.post('/userManage', Backstage.userManage);               // 用户管理
