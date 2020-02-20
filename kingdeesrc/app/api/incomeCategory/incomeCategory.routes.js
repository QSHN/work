const router = require('express').Router();
const IncomeCategory = require('./incomeCategory.controller');

module.exports = router;

/*******收入类别接口*******/

// 收入类别
router.post('/incomeCategoryUpdate', IncomeCategory.incomeCategoryUpdate);                 // 创建/更新
router.post('/incomeCategoryQuery', IncomeCategory.incomeCategoryQuery);                   // 查询
router.delete('/deleteIncomeCategory', IncomeCategory.deleteIncomeCategory);                   // 删除
router.post('/batchIncomeCategory', IncomeCategory.batchIncomeCategory);

router.post('/incomeCategoryUpdateSubject', IncomeCategory.incomeCategoryUpdateSubject);