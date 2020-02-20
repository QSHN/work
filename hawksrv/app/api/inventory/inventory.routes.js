const router = require('express').Router()
const Inventory = require('./inventory.controller.js');

module.exports = router;

// 库存上报
router.post('/list', Inventory.query);
router.get('/id/:id', Inventory.getById);
router.put('/', Inventory.create);
router.post('/', Inventory.update);
router.delete('/:id', Inventory.deleteInventory);
