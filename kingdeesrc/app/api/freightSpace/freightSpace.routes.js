const router = require('express').Router();
const FreightSpace = require('./freightSpace.controller');

module.exports = router;

/*******仓位接口*******/

// 仓位
router.post('/space/update', FreightSpace.spaceUpdate);                 // 创建/更新
router.post('/space/query', FreightSpace.spaceQuery);                   // 查询

// 仓位组
router.post('/group/update', FreightSpace.groupUpdate);               // 创建/更新
router.post('/group/query', FreightSpace.groupQuery);                 // 查询
router.delete('/group/delete', FreightSpace.groupDelete);             // 删除
