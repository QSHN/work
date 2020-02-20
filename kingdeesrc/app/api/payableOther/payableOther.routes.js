const router = require('express').Router();
const PayableOther = require('./payableOther.controller');

module.exports = router;

/*******采购订单接口*******/
router.post('/updatePayableOther', PayableOther.updatePayableOther);            // 创建/更新
router.post('/queryPayableOther', PayableOther.queryPayableOther);              // 查询
router.post('/batchPayableOther', PayableOther.batchPayableOther);              // 批量
router.post('/parameterPayableOther', PayableOther.parameterPayableOther);      // 参数
