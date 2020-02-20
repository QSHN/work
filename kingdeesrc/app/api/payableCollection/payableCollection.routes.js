const router = require('express').Router();
const PayableCollection = require('./payableCollection.controller');

module.exports = router;

/*******采购订单接口*******/
router.post('/updatePayableCollection', PayableCollection.updatePayableCollection);            // 创建/更新
router.post('/queryPayableCollection', PayableCollection.queryPayableCollection);              // 查询
router.post('/batchPayableCollection', PayableCollection.batchPayableCollection);              // 批量
router.post('/parameterPayableCollection', PayableCollection.parameterPayableCollection);      // 参数
