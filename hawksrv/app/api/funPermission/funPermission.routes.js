const router = require('express').Router();
const FunPermission = require('./funPermission.controller');

module.exports = router;

/*******功能权限接口*******/

// 功能权限
router.post('/funPermissionUpdate', FunPermission.funPermissionUpdate);                 // 创建/更新
router.post('/funPermissionQuery', FunPermission.funPermissionQuery);                   // 查询
