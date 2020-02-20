const router = require('express').Router()
const SalesIntegrated = require('./salesIntegrated.controller.js');

module.exports = router;

// 综合上报
router.post('/list', SalesIntegrated.query);
router.get('/id/:id', SalesIntegrated.getById);
router.put('/', SalesIntegrated.create);
router.post('/', SalesIntegrated.update);
router.delete('/:id', SalesIntegrated.deleteSalesIntegrated);
