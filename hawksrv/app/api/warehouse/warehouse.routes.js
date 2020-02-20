const router = require('express').Router()
const Warehouse = require('./warehouse.controller.js');

module.exports = router;

// 仓库
router.get('/', Warehouse.query);
router.put('/', Warehouse.create);
router.post('/', Warehouse.update);
router.delete('/:id', Warehouse.deleteWarehouse);
