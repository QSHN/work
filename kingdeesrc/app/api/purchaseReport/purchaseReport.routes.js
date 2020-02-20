const router = require('express').Router();
const PurchaseReport = require('./purchaseReport.controller');

module.exports = router;

/*******采购订单接口*******/
router.post('/detailPurchaseReport', PurchaseReport.detailPurchaseReport);
router.post('/summaryPurchaseReport', PurchaseReport.summaryPurchaseReport);
router.post('/trackingPurchaseReport', PurchaseReport.trackingPurchaseReport);
