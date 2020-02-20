const router = require('express').Router();
const CashFlow = require('./cashFlow.controller');

module.exports = router;

/*******现金流量接口*******/

// 现金流量
router.post('/update', CashFlow.cashUpdate);                 // 创建/更新
router.post('/query', CashFlow.cashQuery);                   // 查询
router.delete('/delete', CashFlow.cashDelete);               // 删除
