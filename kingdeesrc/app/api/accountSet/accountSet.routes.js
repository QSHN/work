const router = require('express').Router();
const AccountSet = require('./accountSet.controller');

module.exports = router;

/*******账套接口*******/
router.post('/update', AccountSet.update);            // 创建/更新/启用/停用账套
router.post('/query', AccountSet.query);              // 查询账套

