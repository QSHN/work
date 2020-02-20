const router = require('express').Router()
const CustomerReceivable = require('./customerReceivable.controller.js');

module.exports = router;

// 客户应收
router.post('/list', CustomerReceivable.query);
