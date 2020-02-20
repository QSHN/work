const router = require('express').Router();
const WarehouseDiskSurplus = require('./warehouseDiskSurplus.controller');

module.exports = router;

/*******采购订单接口*******/
router.post('/updateWarehouseDiskSurplus', WarehouseDiskSurplus.updateWarehouseDiskSurplus);            // 创建/更新
router.post('/queryWarehouseDiskSurplus', WarehouseDiskSurplus.queryWarehouseDiskSurplus);              // 查询
router.post('/batchWarehouseDiskSurplus', WarehouseDiskSurplus.batchWarehouseDiskSurplus);              // 批量
router.post('/parameterWarehouseDiskSurplus', WarehouseDiskSurplus.parameterWarehouseDiskSurplus);      // 参数
