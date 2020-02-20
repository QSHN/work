const router = require('express').Router();
const SalesOrder = require('./salesOrder.controller');

module.exports = router;

/*******采购订单接口*******/
router.post('/updateSalesOrder', SalesOrder.updateSalesOrder);            // 创建/更新
router.post('/querySalesOrder', SalesOrder.querySalesOrder);              // 查询
router.post('/batchSalesOrder', SalesOrder.batchSalesOrder);              // 批量
router.post('/parameterSalesOrder', SalesOrder.parameterSalesOrder);          // 参数
