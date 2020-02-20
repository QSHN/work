const router = require('express').Router();
const PayableRefund = require('./payableRefund.controller');

module.exports = router;

/*******采购订单接口*******/
router.post('/updatePayableRefund', PayableRefund.updatePayableRefund);            // 创建/更新
router.post('/queryPayableRefund', PayableRefund.queryPayableRefund);              // 查询
router.post('/batchPayableRefund', PayableRefund.batchPayableRefund);              // 批量
router.post('/parameterPayableRefund', PayableRefund.parameterPayableRefund);      // 参数
