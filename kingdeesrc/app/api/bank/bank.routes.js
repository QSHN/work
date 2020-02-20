const router = require('express').Router();
const Bank = require('./bank.controller');

module.exports = router;

/*******银行联行号接口*******/
router.post('/update', Bank.update);            // 创建/更新
router.post('/query', Bank.query);              // 查询账套
router.delete('/delete', Bank.deleteBank);      // 查询账套
