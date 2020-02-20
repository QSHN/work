const router = require('express').Router();
const ReceivableVerification = require('./receivableVerification.controller');

module.exports = router;

/*******采购订单接口*******/
router.post('/updateReceivableVerification', ReceivableVerification.updateReceivableVerification);            // 创建/更新
router.post('/queryReceivableVerification', ReceivableVerification.queryReceivableVerification);              // 查询
router.post('/batchReceivableVerification', ReceivableVerification.batchReceivableVerification);              // 批量
router.post('/parameterReceivableVerification', ReceivableVerification.parameterReceivableVerification);      // 参数
