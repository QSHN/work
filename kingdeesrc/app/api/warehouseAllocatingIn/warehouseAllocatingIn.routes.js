const router = require('express').Router();
const WarehouseAllocatingIn = require('./warehouseAllocatingIn.controller');

module.exports = router;

/*******采购订单接口*******/
router.post('/updateWarehouseAllocatingIn', WarehouseAllocatingIn.updateWarehouseAllocatingIn);            // 创建/更新
router.post('/queryWarehouseAllocatingIn', WarehouseAllocatingIn.queryWarehouseAllocatingIn);              // 查询
router.post('/batchWarehouseAllocatingIn', WarehouseAllocatingIn.batchWarehouseAllocatingIn);              // 批量
router.post('/parameterWarehouseAllocatingIn', WarehouseAllocatingIn.parameterWarehouseAllocatingIn);      // 参数
