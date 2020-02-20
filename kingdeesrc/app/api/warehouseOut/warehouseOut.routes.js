const router = require('express').Router();
const WarehouseOut = require('./warehouseOut.controller');

module.exports = router;

/*******采购订单接口*******/
router.post('/updateWarehouseOut', WarehouseOut.updateWarehouseOut);            // 创建/更新
router.post('/queryWarehouseOut', WarehouseOut.queryWarehouseOut);              // 查询
router.post('/batchWarehouseOut', WarehouseOut.batchWarehouseOut);              // 批量
router.post('/parameterWarehouseOut', WarehouseOut.parameterWarehouseOut);      // 参数
