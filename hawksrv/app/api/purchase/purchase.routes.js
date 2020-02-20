const router = require('express').Router()
const Purchase = require('./purchase.controller.js');

module.exports = router;

// 进货单
router.post('/list', Purchase.query);
router.get('/id/:id', Purchase.getById);
router.put('/', Purchase.create);
router.post('/', Purchase.update);
router.delete('/:id', Purchase.deletePurchase);
