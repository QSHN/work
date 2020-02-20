const router = require('express').Router()
const CommodityNotification = require('./commodityNotification.controller.js');

module.exports = router;

// 商品过期通知人员设置
router.post('/list', CommodityNotification.query);
router.put('/', CommodityNotification.create);
router.post('/', CommodityNotification.update);
