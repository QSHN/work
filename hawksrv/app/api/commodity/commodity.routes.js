const router = require('express').Router()
const Commodity = require('./commodity.controller.js');

module.exports = router;

// 商品类型
router.get('/type', Commodity.queryType);
router.put('/type', Commodity.createType);
router.post('/type', Commodity.updateType);

// 商品标签
router.get('/label', Commodity.queryLabel);
router.put('/label', Commodity.createLabel);
router.post('/label', Commodity.updateLabel);

// 商品单位
router.get('/unit', Commodity.queryUnit);
router.put('/unit', Commodity.createUnit);
router.post('/unit', Commodity.updateUnit);

// 商品品牌
router.get('/brand', Commodity.queryBrand);
router.put('/brand', Commodity.createBrand);
router.post('/brand', Commodity.updateBrand);

// 商品
router.get('/', Commodity.query);
router.get('/:id', Commodity.getById);
router.put('/', Commodity.create);
router.post('/', Commodity.update);
router.delete('/:id', Commodity.deleteCommodity);
