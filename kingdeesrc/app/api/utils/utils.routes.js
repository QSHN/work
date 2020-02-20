const router = require('express').Router();
const L = require('debug')('app:api');
const Utils = require('./utils.controller');

module.exports = router;
router.post('/vericode', Utils.sendCode);
router.get('/ossrole', Utils.getOssRole);
router.get('/preview/:filename', Utils.getPreviewFile);
