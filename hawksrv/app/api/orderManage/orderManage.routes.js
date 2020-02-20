const router = require('express').Router()
const OrderManage = require('./orderManage.controller.js');

module.exports = router;

// 订单管理
router.post('/list', OrderManage.query);
