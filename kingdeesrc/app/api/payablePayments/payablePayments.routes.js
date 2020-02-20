const router = require('express').Router();
const PayablePayments = require('./payablePayments.controller');

module.exports = router;

/*******采购订单接口*******/
router.post('/updatePayablePayments', PayablePayments.updatePayablePayments);            // 创建/更新
router.post('/queryPayablePayments', PayablePayments.queryPayablePayments);              // 查询
router.post('/batchPayablePayments', PayablePayments.batchPayablePayments);              // 批量
router.post('/parameterPayablePayments', PayablePayments.parameterPayablePayments);      // 参数
