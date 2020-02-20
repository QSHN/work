const router = require('express').Router();
const Customer = require('./customer.controller');

module.exports = router;

/*******客户接口*******/

// 客户
router.post('/customerUpdate', Customer.customerUpdate);                 // 创建/更新
router.post('/customerQuery', Customer.customerQuery);                   // 查询
router.post('/batchCustomer', Customer.batchCustomer);               // 删除

// 客户组
router.post('/customerGroupUpdate', Customer.customerGroupUpdate);                 // 创建/更新
router.post('/customerGroupQuery', Customer.customerGroupQuery);                   // 查询
router.delete('/customerGroupDelete', Customer.customerGroupDelete);               // 删除

router.post('/customerUpdateSubject', Customer.customerUpdateSubject);