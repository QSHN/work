const router = require('express').Router();
const Message = require('./message.controller');

module.exports = router;

/*******消息接口*******/
router.post('/update', Message.update);                   // 添加/更新消息
router.post('/query', Message.query);                     // 查询消息列表
router.delete('/delete', Message.deleteFun);              // 删除消息 单：id = ''， 多idList = [], 全部：isAll = true

