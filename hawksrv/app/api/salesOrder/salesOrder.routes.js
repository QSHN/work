const router = require('express').Router()
const SalesOrder = require('./salesOrder.controller.js');

module.exports = router;

// 销售订单
router.post('/list', SalesOrder.query);
router.get('/id/:id', SalesOrder.getById);
router.put('/', SalesOrder.create);
router.post('/', SalesOrder.update);
router.delete('/:id', SalesOrder.deleteSalesOrder);
