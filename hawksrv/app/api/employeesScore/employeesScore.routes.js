const router = require('express').Router()
const EmployeesScore = require('./employeesScore.controller.js');

module.exports = router;

// 员工评分登记
router.get('/type', EmployeesScore.queryType);
router.put('/type', EmployeesScore.createType);
router.post('/type', EmployeesScore.updateType);

// 员工评分
router.get('/', EmployeesScore.query);
router.put('/', EmployeesScore.create);
router.post('/', EmployeesScore.update);
