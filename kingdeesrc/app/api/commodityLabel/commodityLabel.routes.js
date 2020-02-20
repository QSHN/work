const router = require('express').Router();
const CommodityLabel = require('./commodityLabel.controller');

module.exports = router;

/*******商品标签接口*******/

// 商品标签
router.post('/updateCommodityLabel', CommodityLabel.labelUpdate);                 // 创建/更新
router.post('/queryCommodityLabel', CommodityLabel.labelQuery);                   // 查询
router.delete('/batchCommodityLabel', CommodityLabel.labelBatch);               // 删除

// 商品标签组
router.post('/updateCommodityLabelGroup', CommodityLabel.groupUpdate);               // 创建/更新
router.post('/queryCommodityLabelGroup', CommodityLabel.groupQuery);                 // 查询
router.delete('/deleteCommodityLabelGroup', CommodityLabel.groupDelete);             // 删除
