const router = require('express').Router();
const CommodityInfo = require('./commodityInfo.controller');

module.exports = router;

/*******商品资料接口*******/

// 商品资料
router.post('/commodityInfoUpdate', CommodityInfo.commodityInfoUpdate);                 // 创建/更新
router.post('/commodityInfoQuery', CommodityInfo.commodityInfoQuery);                   // 查询
router.post('/batchCommodityInfo', CommodityInfo.batchCommodityInfo);
router.post('/queryCommodityInfoAndDetail', CommodityInfo.queryCommodityInfoAndDetail);

// 商品资料组
router.post('/commodityInfoGroupUpdate', CommodityInfo.commodityInfoGroupUpdate);       // 创建/更新
router.post('/commodityInfoGroupQuery', CommodityInfo.commodityInfoGroupQuery);         // 查询
router.delete('/commodityInfoGroupDelete', CommodityInfo.commodityInfoGroupDelete);     // 删除

router.post('/commodityInfoUpdateSubject', CommodityInfo.commodityInfoUpdateSubject);