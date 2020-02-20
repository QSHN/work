const router = require('express').Router()
const InternalContact = require('./internalContact.controller.js');

module.exports = router;

// 内部联络类型
router.get('/type', InternalContact.queryType);
router.put('/type', InternalContact.createType);
router.post('/type', InternalContact.updateType);

// 内部联络
router.get('/', InternalContact.query);
router.put('/', InternalContact.create);
router.post('/', InternalContact.update);
router.delete('/', InternalContact.deleteFun);
