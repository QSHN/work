const router = require('express').Router();
const PurchaseReturn = require('./purchaseReturn.controller');

module.exports = router;

/*******采购订单接口*******/
router.post('/updatePurchaseReturn', PurchaseReturn.updatePurchaseReturn);            // 创建/更新
router.post('/queryPurchaseReturn', PurchaseReturn.queryPurchaseReturn);              // 查询
router.post('/batchPurchaseReturn', PurchaseReturn.batchPurchaseReturn);              // 批量
router.post('/parameterPurchaseReturn', PurchaseReturn.parameterPurchaseReturn);      // 参数
