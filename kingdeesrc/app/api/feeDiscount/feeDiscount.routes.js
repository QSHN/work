const router = require('express').Router();
const FeeDiscount = require('./feeDiscount.controller');

module.exports = router;

/*******采购订单接口*******/
router.post('/updateFeeDiscount', FeeDiscount.updateFeeDiscount);            // 创建/更新
router.post('/queryFeeDiscount', FeeDiscount.queryFeeDiscount);              // 查询
