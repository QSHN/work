const router = require('express').Router();
const UserManage = require('./userManage.controller');

module.exports = router;

/*******用户管理接口*******/

// 权限
router.post('/updateUserPermission', UserManage.updatePermission);                 // 创建/更新
router.post('/queryUserPermission', UserManage.queryPermission);                   // 查询

// 用户组
router.post('/updateUserGroup', UserManage.updateGroup);               // 创建/更新
router.post('/queryUserGroup', UserManage.queryGroup);                 // 查询
router.delete('/deleteUserGroup', UserManage.deleteGroup);             // 删除

