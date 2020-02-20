const router = require('express').Router();
const CommodityPrices = require('./commodityPrices.controller');

module.exports = router;

/*******价格接口*******/

// 商品价格
router.post('/commodityPricesUpdate', CommodityPrices.commodityPricesUpdate);                 // 创建/更新
router.post('/commodityPricesQuery', CommodityPrices.commodityPricesQuery);                   // 查询

// 客户价格
router.post('/customerPricesUpdate', CommodityPrices.customerPricesUpdate);                 // 创建/更新
router.post('/customerPricesQuery', CommodityPrices.customerPricesQuery);                   // 查询
router.post('/batchCustomerPrices', CommodityPrices.batchCustomerPrices);

// 策略价格
router.post('/strategyPricesUpdate', CommodityPrices.strategyPricesUpdate);                 // 创建/更新
router.post('/strategyPricesQuery', CommodityPrices.strategyPricesQuery);                   // 查询

// 历史价格信息
router.post('/commodityPricesHistory', CommodityPrices.commodityPricesHistory);                   // 查询