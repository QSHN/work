const router = require('express').Router()
const ImageAcquisition = require('./imageAcquisition.controller.js');

module.exports = router;

// 终端形象采集
router.post('/list', ImageAcquisition.query);
router.get('/id/:id', ImageAcquisition.getById);
router.put('/', ImageAcquisition.create);
router.post('/', ImageAcquisition.update);
router.delete('/:id', ImageAcquisition.deleteImageAcquisition);

// 终端图片类型
router.get('/typeList', ImageAcquisition.getType);
router.put('/typeList', ImageAcquisition.createType);
router.post('/typeList', ImageAcquisition.updateType);
