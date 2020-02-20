const router = require('express').Router();
const Clerk = require('./clerk.controller');

module.exports = router;

/*******职员接口*******/

// 职员
router.post('/clerkUpdate', Clerk.clerkUpdate);                 // 创建/更新
router.post('/clerkQuery', Clerk.clerkQuery);                   // 查询
router.post('/batchClerk', Clerk.batchClerk);
