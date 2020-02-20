const router = require('express').Router();
const CommodityBrand = require('./commodityBrand.controller');

module.exports = router;

/*******商品品牌接口*******/

// 商品品牌
router.post('/updateCommodityBrand', CommodityBrand.brandUpdate);                 // 创建/更新
router.post('/queryCommodityBrand', CommodityBrand.brandQuery);                   // 查询
router.delete('/batchCommodityBrand', CommodityBrand.brandBatch);               // 删除

// 商品品牌组
router.post('/updateCommodityBrandGroup', CommodityBrand.groupUpdate);               // 创建/更新
router.post('/queryCommodityBrandGroup', CommodityBrand.groupQuery);                 // 查询
router.delete('/deleteCommodityBrandGroup', CommodityBrand.groupDelete);             // 删除
