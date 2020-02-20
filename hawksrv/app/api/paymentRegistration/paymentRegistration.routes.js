const router = require('express').Router()
const PaymentRegistration = require('./paymentRegistration.controller.js');

module.exports = router;

// 收款登记
router.post('/list', PaymentRegistration.query);
router.get('/id/:id', PaymentRegistration.getById);
router.put('/', PaymentRegistration.create);
router.post('/', PaymentRegistration.update);
router.delete('/:id', PaymentRegistration.deletePaymentRegistration);
