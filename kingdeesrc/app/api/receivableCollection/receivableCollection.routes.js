const router = require('express').Router();
const ReceivableCollection = require('./receivableCollection.controller');

module.exports = router;

/*******采购订单接口*******/
router.post('/updateReceivableCollection', ReceivableCollection.updateReceivableCollection);            // 创建/更新
router.post('/queryReceivableCollection', ReceivableCollection.queryReceivableCollection);              // 查询
router.post('/batchReceivableCollection', ReceivableCollection.batchReceivableCollection);              // 批量
router.post('/parameterReceivableCollection', ReceivableCollection.parameterReceivableCollection);      // 参数
