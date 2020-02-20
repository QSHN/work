const router = require('express').Router();
const PayableReport = require('./payableReport.controller');

module.exports = router;

router.post('/queryPayableReport', PayableReport.queryPayableReport);              // 查询
router.post('/queryAllPayableReport', PayableReport.queryAllPayableReport);              // 查询