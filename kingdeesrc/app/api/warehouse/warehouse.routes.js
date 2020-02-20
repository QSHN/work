const router = require('express').Router();
const Warehouse = require('./warehouse.controller');

module.exports = router;

/*******供应商接口*******/

// 供应商
router.post('/warehouseUpdate', Warehouse.warehouseUpdate);                 // 创建/更新
router.post('/warehouseQuery', Warehouse.warehouseQuery);                   // 查询
router.post('/batchWarehouse', Warehouse.batchWarehouse);                   // 删除

// 供应商组
router.post('/warehouseGroupUpdate', Warehouse.warehouseGroupUpdate);                 // 创建/更新
router.post('/warehouseGroupQuery', Warehouse.warehouseGroupQuery);                   // 查询
router.delete('/warehouseGroupDelete', Warehouse.warehouseGroupDelete);               // 删除
