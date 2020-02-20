const router = require('express').Router();
const ReceivablePayments = require('./receivablePayments.controller');

module.exports = router;

/*******采购订单接口*******/
router.post('/updateReceivablePayments', ReceivablePayments.updateReceivablePayments);            // 创建/更新
router.post('/queryReceivablePayments', ReceivablePayments.queryReceivablePayments);              // 查询
router.post('/batchReceivablePayments', ReceivablePayments.batchReceivablePayments);              // 批量
router.post('/parameterReceivablePayments', ReceivablePayments.parameterReceivablePayments);      // 参数
