const router = require('express').Router();
const Supplier = require('./supplier.controller');

module.exports = router;

/*******供应商接口*******/

// 供应商
router.post('/supplierUpdate', Supplier.supplierUpdate);                 // 创建/更新
router.post('/supplierQuery', Supplier.supplierQuery);                   // 查询
router.post('/batchSupplier', Supplier.batchSupplier);                   // 删除

router.post('/supplierUpdateSubject', Supplier.supplierUpdateSubject);

// 供应商组
router.post('/supplierGroupUpdate', Supplier.supplierGroupUpdate);                 // 创建/更新
router.post('/supplierGroupQuery', Supplier.supplierGroupQuery);                   // 查询
router.delete('/supplierGroupDelete', Supplier.supplierGroupDelete);               // 删除
