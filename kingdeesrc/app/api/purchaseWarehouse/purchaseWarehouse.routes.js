const router = require('express').Router();
const PurchaseWarehouse = require('./purchaseWarehouse.controller');

module.exports = router;

/*******采购订单接口*******/
router.post('/updatePurchaseWarehouse', PurchaseWarehouse.updatePurchaseWarehouse);            // 创建/更新
router.post('/queryPurchaseWarehouse', PurchaseWarehouse.queryPurchaseWarehouse);              // 查询
router.post('/batchPurchaseWarehouse', PurchaseWarehouse.batchPurchaseWarehouse);              // 批量
router.post('/parameterPurchaseWarehouse', PurchaseWarehouse.parameterPurchaseWarehouse);      // 参数
