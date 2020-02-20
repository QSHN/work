const router = require('express').Router()
const CompetingGoods = require('./competingGoods.controller.js');

module.exports = router;

// 竞品上报
router.post('/list', CompetingGoods.query);
router.get('/id/:id', CompetingGoods.getById);
router.put('/', CompetingGoods.create);
router.post('/', CompetingGoods.update);
router.delete('/:id', CompetingGoods.deleteCompetingGoods);
