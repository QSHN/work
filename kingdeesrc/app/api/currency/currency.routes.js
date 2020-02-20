const router = require('express').Router();
const Currency = require('./currency.controller');

module.exports = router;

/*******币别接口*******/
router.post('/currencyUpdate', Currency.currencyUpdate);            // 创建/更新币别
router.post('/currencyQuery', Currency.currencyQuery);              // 查询
router.delete('/batchCurrency', Currency.batchCurrency);            // 删除
