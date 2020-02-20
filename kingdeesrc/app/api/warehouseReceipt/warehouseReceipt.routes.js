const router = require('express').Router();
const WarehouseReceipt = require('./warehouseReceipt.controller');

module.exports = router;

/*******采购订单接口*******/
router.post('/updateWarehouseReceipt', WarehouseReceipt.updateWarehouseReceipt);            // 创建/更新
router.post('/queryWarehouseReceipt', WarehouseReceipt.queryWarehouseReceipt);              // 查询
router.post('/batchWarehouseReceipt', WarehouseReceipt.batchWarehouseReceipt);              // 批量
router.post('/parameterWarehouseReceipt', WarehouseReceipt.parameterWarehouseReceipt);      // 参数
