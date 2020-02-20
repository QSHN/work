const router = require('express').Router()
const clientNotification = require('./clientNotification.controller.js');

module.exports = router;

// 客户欠费通知人员设置
router.post('/list', clientNotification.query);
router.put('/', clientNotification.create);
router.post('/', clientNotification.update);
