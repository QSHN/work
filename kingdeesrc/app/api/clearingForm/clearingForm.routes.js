const router = require('express').Router();
const ClearingForm = require('./clearingForm.controller');

module.exports = router;

/*******结算方式接口*******/
router.post('/clearingFormUpdate', ClearingForm.update);            // 创建/更新
router.post('/clearingFormQuery', ClearingForm.query);              // 查询
router.delete('/clearingFormDelete', ClearingForm.clearDelete);      // 删除
