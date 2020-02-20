const router = require('express').Router();
const SpendingCategory = require('./spendingCategory.controller');

module.exports = router;

/*******支出类别接口*******/

// 支出类别
router.post('/spendingCategoryUpdate', SpendingCategory.spendingCategoryUpdate);                 // 创建/更新
router.post('/spendingCategoryQuery', SpendingCategory.spendingCategoryQuery);                   // 查询
router.delete('/deleteSpendingCategory', SpendingCategory.deleteSpendingCategory);                   // 删除
router.post('/batchSpendingCategory', SpendingCategory.batchSpendingCategory);

router.post('/spendingCategoryUpdateSubject', SpendingCategory.spendingCategoryUpdateSubject);
