const router = require('express').Router();
const ExchangeRate = require('./exchangeRate.controller');

module.exports = router;

/*******汇率体系接口*******/

// 汇率体系
router.post('/rate/update', ExchangeRate.rateUpdate);                 // 创建/更新
router.post('/rate/query', ExchangeRate.rateQuery);                   // 查询
router.delete('/rate/delete', ExchangeRate.rateDelete);               // 删除

// 汇率类型
router.post('/type/update', ExchangeRate.typeUpdate);                 // 创建/更新
router.post('/type/query', ExchangeRate.typeQuery);                   // 查询
router.delete('/type/delete', ExchangeRate.typeDelete);               // 删除
