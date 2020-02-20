const router = require('express').Router();
const SalesWarehouse = require('./salesWarehouse.controller');

module.exports = router;

/*******采购订单接口*******/
router.post('/updateSalesWarehouse', SalesWarehouse.updateSalesWarehouse);            // 创建/更新
router.post('/querySalesWarehouse', SalesWarehouse.querySalesWarehouse);              // 查询
router.post('/batchSalesWarehouse', SalesWarehouse.batchSalesWarehouse);              // 批量
router.post('/parameterSalesWarehouse', SalesWarehouse.parameterSalesWarehouse);      // 参数
