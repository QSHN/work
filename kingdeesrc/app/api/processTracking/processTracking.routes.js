const router = require('express').Router();
const ProcessTracking = require('./processTracking.controller');

module.exports = router;

/*******全流程跟踪*******/
router.post('/processTracking', ProcessTracking.processTracking);
