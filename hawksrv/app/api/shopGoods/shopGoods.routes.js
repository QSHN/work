const router = require('express').Router()
const ShopGoods = require('./shopGoods.controller.js');

module.exports = router;

// 铺货上报
router.post('/list', ShopGoods.query);
router.get('/id/:id', ShopGoods.getById);
router.put('/', ShopGoods.create);
router.post('/', ShopGoods.update);
router.delete('/:id', ShopGoods.deleteShopGoods);
