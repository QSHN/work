const router = require('express').Router();
const Department = require('./department.controller');

module.exports = router;

/*******部门接口*******/

// 部门
router.post('/departmentUpdate', Department.departmentUpdate);                 // 创建/更新
router.post('/departmentQuery', Department.departmentQuery);                   // 查询
router.delete('/deleteDepartment', Department.deleteDepartment);                   // 删除
router.post('/batchDepartment', Department.batchDepartment);

router.post('/departmentUpdateSubject', Department.departmentUpdateSubject);