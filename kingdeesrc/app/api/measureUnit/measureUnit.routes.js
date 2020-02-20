const router = require('express').Router();
const MeasureUnit = require('./measureUnit.controller');

module.exports = router;

/*******计量单位接口*******/

// 计量单位
router.post('/updateUnit', MeasureUnit.unitUpdate);                 // 创建/更新
router.post('/queryUnit', MeasureUnit.unitQuery);                   // 查询
router.delete('/deleteUnit', MeasureUnit.unitDelete);               // 删除

// 计量单位组
router.post('/updateUnitGroup', MeasureUnit.groupUpdate);               // 创建/更新
router.post('/queryUnitGroup', MeasureUnit.groupQuery);                 // 查询
router.delete('/deleteUnitGroup', MeasureUnit.groupDelete);             // 删除
