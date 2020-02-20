const router = require('express').Router();
const Abstract = require('./abstract.controller');

module.exports = router;

/*******摘要库*******/
router.post('/update', Abstract.update);            // 创建/更新
router.post('/query', Abstract.query);              // 查询摘要库
router.delete('/delete', Abstract.deleteAbstract);      // 删除摘要库
