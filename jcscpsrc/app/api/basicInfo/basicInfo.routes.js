const router = require('express').Router();
const BasicInfo = require('./basicInfo.controller');

module.exports = router;

/*******基础资料接口*******/
router.post('/updateBasicInfo', BasicInfo.updateBasicInfo);   // 更新基础资料
router.post('/queryBasicInfo', BasicInfo.queryBasicInfo);     // 获取基础资料

router.post('/updateBasicInfoGroup', BasicInfo.updateBasicInfoGroup);   // 更新基础资料组
router.post('/queryBasicInfoGroup', BasicInfo.queryBasicInfoGroup);     // 获取基础资料组