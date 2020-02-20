const router = require('express').Router()
const SalesVolume = require('./salesVolume.controller.js');

module.exports = router;

// 销量上报
router.post('/list', SalesVolume.query);
router.get('/id/:id', SalesVolume.getById);
router.put('/', SalesVolume.create);
router.post('/', SalesVolume.update);
router.delete('/:id', SalesVolume.deleteSalesVolume);
