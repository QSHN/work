const router = require('express').Router();
const ReceivableReport = require('./receivableReport.controller');

module.exports = router;

router.post('/queryReceivableReport', ReceivableReport.queryReceivableReport);              // 查询
router.post('/queryAllReceivableReport', ReceivableReport.queryAllReceivableReport);              // 查询