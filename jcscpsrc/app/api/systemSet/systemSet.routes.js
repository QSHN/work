const router = require('express').Router();
const SystemSet = require('./systemSet.controller');

module.exports = router;

/*******系统参数接口*******/
router.post('/updateSystemSet', SystemSet.updateSystemSet);   // 更新系统参数
router.post('/querySystemSet', SystemSet.querySystemSet);     // 获取系统参数