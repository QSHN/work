const router = require('express').Router()
const TerminalVisit = require('./terminalVisit.controller.js');
const TerminalPlan = require('./terminalPlan.controller.js');
const TerminalCircuit = require('./terminalCircuit.controller.js');
module.exports = router;

// 终端拜访
router.post('/visit/list', TerminalVisit.query);
router.get('/visit/id/:id', TerminalVisit.getById);
router.put('/visit', TerminalVisit.create);
router.post('/visit', TerminalVisit.update);
router.delete('/visit/:id', TerminalVisit.deleteTerminalVisit);

// 终端拜访计划
router.post('/plan/list', TerminalPlan.query);
router.get('/plan/id/:id', TerminalPlan.getById);
router.put('/plan', TerminalPlan.create);
router.post('/plan', TerminalPlan.update);
router.delete('/plan/:id', TerminalPlan.deleteTerminalPlan);

// 终端拜访线路
router.post('/circuit/list', TerminalCircuit.query);
router.get('/circuit/id/:id', TerminalCircuit.getById);
router.put('/circuit', TerminalCircuit.create);
router.post('/circuit', TerminalCircuit.update);
router.delete('/circuit/:id', TerminalCircuit.deleteTerminalCircuit);
