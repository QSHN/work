const router = require('express').Router()
const SalesReturn = require('./salesReturn.controller.js');

module.exports = router;

// 销售退货单
router.post('/list', SalesReturn.query);
router.get('/id/:id', SalesReturn.getById);
router.put('/', SalesReturn.create);
router.post('/', SalesReturn.update);
router.delete('/:id', SalesReturn.deleteSalesReturn);
