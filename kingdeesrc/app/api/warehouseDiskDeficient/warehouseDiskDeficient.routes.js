const router = require('express').Router();
const WarehouseDiskDeficient = require('./warehouseDiskDeficient.controller');

module.exports = router;

/*******采购订单接口*******/
router.post('/updateWarehouseDiskDeficient', WarehouseDiskDeficient.updateWarehouseDiskDeficient);            // 创建/更新
router.post('/queryWarehouseDiskDeficient', WarehouseDiskDeficient.queryWarehouseDiskDeficient);              // 查询
router.post('/batchWarehouseDiskDeficient', WarehouseDiskDeficient.batchWarehouseDiskDeficient);              // 批量
router.post('/parameterWarehouseDiskDeficient', WarehouseDiskDeficient.parameterWarehouseDiskDeficient);      // 参数
