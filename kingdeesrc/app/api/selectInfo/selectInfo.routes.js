const router = require('express').Router();
const SelectInfo = require('./selectInfo.controller');

module.exports = router;

/*******选择资料接口*******/
router.post('/update', SelectInfo.update);                   // 创建/更新
router.post('/query', SelectInfo.query);                     // 查询
router.delete('/delete', SelectInfo.deleteSelectInfo);       // 删除
