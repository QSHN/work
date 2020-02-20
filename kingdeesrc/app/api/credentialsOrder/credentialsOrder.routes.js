const router = require('express').Router();
const CredentialsOrder = require('./credentialsOrder.controller');

module.exports = router;

// 费用
router.post('/updateCredentialsOrder', CredentialsOrder.updateCredentialsOrder);                 // 创建/更新
router.post('/queryCredentialsOrder', CredentialsOrder.queryCredentialsOrder);                   // 查询
router.delete('/batchCredentialsOrder', CredentialsOrder.batchCredentialsOrder);
