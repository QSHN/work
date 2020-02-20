const router = require('express').Router();
const CashFlowTable = require('./cashFlowTable.controller');

module.exports = router;

/*******现金流量表接口*******/

// 现金流量表
router.post('/update', CashFlowTable.cashUpdate);                 // 创建/更新
router.post('/query', CashFlowTable.cashQuery);                   // 查询
