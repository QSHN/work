const router = require('express').Router();
const PurchaseOrder = require('./purchaseOrder.controller');

module.exports = router;

/*******采购订单接口*******/
router.post('/updatePurchaseOrder', PurchaseOrder.updatePurchaseOrder);            // 创建/更新
router.post('/queryPurchaseOrder', PurchaseOrder.queryPurchaseOrder);              // 查询
router.post('/batchPurchaseOrder', PurchaseOrder.batchPurchaseOrder);              // 批量
router.post('/parameterPurchaseOrder', PurchaseOrder.parameterPurchaseOrder);          // 参数
