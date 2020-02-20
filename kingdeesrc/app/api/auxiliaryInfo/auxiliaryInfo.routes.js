const router = require('express').Router();
const AuxiliaryInfo = require('./auxiliaryInfo.controller');

module.exports = router;

/*******辅助属性接口*******/

// 辅助属性
router.post('/updateAuxiliaryInfo', AuxiliaryInfo.auxiliaryUpdate);                 // 创建/更新
router.post('/queryAuxiliaryInfo', AuxiliaryInfo.auxiliaryQuery);                   // 查询
router.delete('/batchAuxiliaryInfo', AuxiliaryInfo.auxiliaryBatch);               // 删除

// 辅助属性组
router.post('/updateAuxiliaryInfoGroup', AuxiliaryInfo.groupUpdate);               // 创建/更新
router.post('/queryAuxiliaryInfoGroup', AuxiliaryInfo.groupQuery);                 // 查询
router.delete('/deleteAuxiliaryInfoGroup', AuxiliaryInfo.groupDelete);             // 删除
