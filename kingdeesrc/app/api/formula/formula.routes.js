const router = require('express').Router();
const Formula = require('./formula.controller');

module.exports = router;

/*******公式*******/
router.post('/formulaUpdate', Formula.formulaUpdate);            // 创建/更新
router.post('/formulaQuery', Formula.formulaQuery);              // 查询
router.post('/formulaDelete', Formula.formulaDelete);              // 查询
