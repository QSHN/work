const router = require('express').Router();
const SalesReport = require('./salesReport.controller');

module.exports = router;


router.post('/detailSalesReport', SalesReport.detailSalesReport);
router.post('/trackingSalesReport', SalesReport.trackingSalesReport);
router.post('/PSummarySalesReport', SalesReport.PSummarySalesReport);              // 查询
router.post('/summarySalesReport', SalesReport.summarySalesReport);
router.post('/rankingSalesReport', SalesReport.rankingSalesReport);