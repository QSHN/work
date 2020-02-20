const router = require('express').Router();
const WarehouseIn = require('./warehouseIn.controller');

module.exports = router;

/*******采购订单接口*******/
router.post('/updateWarehouseIn', WarehouseIn.updateWarehouseIn);            // 创建/更新
router.post('/queryWarehouseIn', WarehouseIn.queryWarehouseIn);              // 查询
router.post('/batchWarehouseIn', WarehouseIn.batchWarehouseIn);              // 批量
router.post('/parameterWarehouseIn', WarehouseIn.parameterWarehouseIn);      // 参数
