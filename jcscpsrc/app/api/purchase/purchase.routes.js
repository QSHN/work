const router = require('express').Router();
const Purchase = require('./purchase.controller');

module.exports = router;

/*******采购接口*******/
router.post('/updatePurchaseTemp', Purchase.updatePurchaseTemp);            // 更新模板
router.post('/updatePurchaseContract', Purchase.updatePurchaseContract);    // 更新合同
router.post('/updatePurchaseOrder', Purchase.updatePurchaseOrder);          // 更新订单
router.post('/queryPurchaseTemp', Purchase.queryPurchaseTemp);              // 获取模板
router.post('/queryPurchaseContract', Purchase.queryPurchaseContract);      // 获取合同
router.post('/queryPurchaseOrder', Purchase.queryPurchaseOrder);            // 获取订单

router.post('/queryContractOrOrder', Purchase.queryContractOrOrder);            // 获取采购列表

router.delete('/deletePurchaseContract', Purchase.deletePurchaseContract);      // 删除合同
router.delete('/deletePurchaseOrder', Purchase.deletePurchaseOrder);            // 删除订单

router.post('/summarySheet', Purchase.summarySheet);        // 汇总表
router.post('/updatePurchaseSelfTemp', Purchase.updatePurchaseSelfTemp);          // 更新自己采购列表模板
router.post('/queryPurchaseSelfTemp', Purchase.queryPurchaseSelfTemp);              // 获取自己采购列表模板

router.post('/exportData', Purchase.exportData);              // 导出

