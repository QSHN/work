const router = require('express').Router();
const WarehouseDiskPoint = require('./warehouseDiskPoint.controller');

module.exports = router;

/*******采购订单接口*******/
router.post('/updateWarehouseDiskPoint', WarehouseDiskPoint.updateWarehouseDiskPoint);            // 创建/更新
router.post('/queryWarehouseDiskPoint', WarehouseDiskPoint.queryWarehouseDiskPoint);              // 查询
router.post('/batchWarehouseDiskPoint', WarehouseDiskPoint.batchWarehouseDiskPoint);              // 批量
router.post('/parameterWarehouseDiskPoint', WarehouseDiskPoint.parameterWarehouseDiskPoint);      // 参数
