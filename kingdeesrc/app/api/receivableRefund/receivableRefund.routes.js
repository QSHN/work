const router = require('express').Router();
const ReceivableRefund = require('./receivableRefund.controller');

module.exports = router;

/*******采购订单接口*******/
router.post('/updateReceivableRefund', ReceivableRefund.updateReceivableRefund);            // 创建/更新
router.post('/queryReceivableRefund', ReceivableRefund.queryReceivableRefund);              // 查询
router.post('/batchReceivableRefund', ReceivableRefund.batchReceivableRefund);              // 批量
router.post('/parameterReceivableRefund', ReceivableRefund.parameterReceivableRefund);      // 参数
