const router = require('express').Router()
const TransfersDocuments = require('./transfersDocuments.controller.js');

module.exports = router;

// 调拨单据
router.post('/list', TransfersDocuments.query);
router.get('/id/:id', TransfersDocuments.getById);
router.put('/', TransfersDocuments.create);
router.post('/', TransfersDocuments.update);
router.delete('/:id', TransfersDocuments.deleteTransfersDocuments);
