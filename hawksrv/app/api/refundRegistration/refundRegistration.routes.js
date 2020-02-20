const router = require('express').Router()
const RefundRegistration = require('./refundRegistration.controller.js');

module.exports = router;

// 收款登记
router.post('/list', RefundRegistration.query);
router.get('/id/:id', RefundRegistration.getById);
router.put('/', RefundRegistration.create);
router.post('/', RefundRegistration.update);
router.delete('/:id', RefundRegistration.deleteRefundRegistration);
