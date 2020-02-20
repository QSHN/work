const router = require('express').Router();
const Utils = require('./utils.controller');

module.exports = router;

// 其他
router.get('/getOssRole', Utils.getOssRole);
