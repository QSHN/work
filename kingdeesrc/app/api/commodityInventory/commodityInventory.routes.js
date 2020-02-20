const router = require('express').Router();
const CommodityInventory = require('./commodityInventory.controller');

module.exports = router;

/*******商品期初接口*******/

// 商品期初
router.post('/updateCommodityInventory', CommodityInventory.updateCommodityInventory);                 // 创建/更新
router.post('/queryCommodityInventory', CommodityInventory.queryCommodityInventory);                   // 查询
router.post('/batchCommodityInventory', CommodityInventory.batchCommodityInventory);                 // 删除
