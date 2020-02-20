const router = require('express').Router();
const WarehouseReport = require('./warehouseReport.controller');

module.exports = router;

router.post('/availableWarehouseReport', WarehouseReport.availableWarehouseReport);
router.post('/queryWarehouseReport', WarehouseReport.queryWarehouseReport);
router.post('/detailWarehouseReport', WarehouseReport.detailWarehouseReport);
router.post('/summaryWarehouseReport', WarehouseReport.summaryWarehouseReport);
// router.post('/stateWarehouseReport', WarehouseReport.stateWarehouseReport);
// router.post('/trackingWarehouseReport', WarehouseReport.trackingWarehouseReport);
