const router = require('express').Router();
const CredentialsCache = require('./credentialsCache.controller');

module.exports = router;

// 费用
router.post('/updateCredentialsCache', CredentialsCache.updateCredentialsCache);                 // 创建/更新
router.post('/editCredentialsCache', CredentialsCache.editCredentialsCache);
router.post('/queryCredentialsCache', CredentialsCache.queryCredentialsCache);                   // 查询
router.delete('/batchCredentialsCache', CredentialsCache.batchCredentialsCache);
