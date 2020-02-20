const router = require('express').Router();
const Permission = require('./permission.controller');

module.exports = router;

/*******权限接口*******/
router.post('/updatePermission', Permission.updatePermission);   // 权限
router.post('/queryPermission', Permission.queryPermission);     // 权限