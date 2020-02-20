const router = require('express').Router();
const ReceivableOther = require('./receivableOther.controller');

module.exports = router;

/*******采购订单接口*******/
router.post('/updateReceivableOther', ReceivableOther.updateReceivableOther);            // 创建/更新
router.post('/queryReceivableOther', ReceivableOther.queryReceivableOther);              // 查询
router.post('/batchReceivableOther', ReceivableOther.batchReceivableOther);              // 批量
router.post('/parameterReceivableOther', ReceivableOther.parameterReceivableOther);      // 参数
