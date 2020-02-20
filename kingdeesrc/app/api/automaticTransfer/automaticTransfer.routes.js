const router = require('express').Router();
const AutomaticTransfer = require('./automaticTransfer.controller');

module.exports = router;

/*******自动转账接口*******/
router.post('/updateTemplate', AutomaticTransfer.updateTemplate);            // 创建/更新
router.post('/queryTemplate', AutomaticTransfer.queryTemplate);              // 查询

