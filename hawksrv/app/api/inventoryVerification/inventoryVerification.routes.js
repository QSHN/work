const router = require('express').Router()
const InventoryVerification = require('./inventoryVerification.controller.js');

module.exports = router;

// 库存盘点
router.post('/list', InventoryVerification.query);
router.get('/id/:id', InventoryVerification.getById);
router.put('/', InventoryVerification.create);
router.post('/', InventoryVerification.update);
router.delete('/:id', InventoryVerification.deleteInventoryVerification);
