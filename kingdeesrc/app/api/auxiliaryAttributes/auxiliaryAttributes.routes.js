const router = require('express').Router();
const AuxiliaryAttributes = require('./auxiliaryAttributes.controller');

module.exports = router;

/*******辅助属性接口*******/

// 辅助属性
router.post('/updateAuxiliaryAttributes', AuxiliaryAttributes.auxiliaryUpdate);                 // 创建/更新
router.post('/queryAuxiliaryAttributes', AuxiliaryAttributes.auxiliaryQuery);                   // 查询
router.delete('/batchAuxiliaryAttributes', AuxiliaryAttributes.auxiliaryBatch);               // 删除

// 辅助属性组
router.post('/updateAuxiliaryAttributesGroup', AuxiliaryAttributes.groupUpdate);               // 创建/更新
router.post('/queryAuxiliaryAttributesGroup', AuxiliaryAttributes.groupQuery);                 // 查询
router.delete('/deleteAuxiliaryAttributesGroup', AuxiliaryAttributes.groupDelete);             // 删除
