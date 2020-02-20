const router = require('express').Router();
const Cost = require('./cost.controller');

module.exports = router;

/*******费用接口*******/

// 费用
router.post('/update', Cost.costUpdate);                 // 创建/更新
router.post('/query', Cost.costQuery);                   // 查询
router.delete('/delete', Cost.costDelete);               // 删除
