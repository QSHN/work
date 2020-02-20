const router = require('express').Router();
const Home = require('./home.controller');

module.exports = router;

router.post('/queryAllList', Home.queryAllList);