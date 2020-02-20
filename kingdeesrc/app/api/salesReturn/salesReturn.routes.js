const router = require('express').Router();
const SalesReturn = require('./salesReturn.controller');

module.exports = router;

/*******采购订单接口*******/
router.post('/updateSalesReturn', SalesReturn.updateSalesReturn);            // 创建/更新
router.post('/querySalesReturn', SalesReturn.querySalesReturn);              // 查询
router.post('/batchSalesReturn', SalesReturn.batchSalesReturn);              // 批量
router.post('/parameterSalesReturn', SalesReturn.parameterSalesReturn);      // 参数
