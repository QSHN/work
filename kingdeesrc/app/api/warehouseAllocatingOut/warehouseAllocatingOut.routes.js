const router = require('express').Router();
const WarehouseAllocatingOut = require('./warehouseAllocatingOut.controller');

module.exports = router;

/*******采购订单接口*******/
router.post('/updateWarehouseAllocatingOut', WarehouseAllocatingOut.updateWarehouseAllocatingOut);            // 创建/更新
router.post('/queryWarehouseAllocatingOut', WarehouseAllocatingOut.queryWarehouseAllocatingOut);              // 查询
router.post('/batchWarehouseAllocatingOut', WarehouseAllocatingOut.batchWarehouseAllocatingOut);              // 批量
router.post('/parameterWarehouseAllocatingOut', WarehouseAllocatingOut.parameterWarehouseAllocatingOut);      // 参数

router.post('/warehouseAllocatingDiff', WarehouseAllocatingOut.warehouseAllocatingDiff);
