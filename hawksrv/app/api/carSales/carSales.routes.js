const router = require('express').Router()
const cxCarManage = require('./cxCarManage.controller.js');
const cxBill = require('./cxBill.controller.js');
const cxTruck = require('./cxTruck.controller');
const cxInventory = require('./cxInventory.controller');
const cxOrder = require('./cxOrder.controller');
const cxRefundable = require('./cxRefundable.controller');
const cxInventoryCheck = require('./cxInventoryCheck.controller');
const cxBack = require('./cxBack.controller');
module.exports = router;

// 车辆管理
router.post('/car/list', cxCarManage.query);
router.get('/car/id/:id', cxCarManage.getById);
router.put('/car', cxCarManage.create);
router.post('/car', cxCarManage.update);
router.delete('/car/:id', cxCarManage.deleteCar);

// 提货申请
router.post('/bill/list', cxBill.query);
router.get('/bill/id/:id', cxBill.getById);
router.put('/bill', cxBill.create);
router.post('/bill', cxBill.update);
router.delete('/bill/:id', cxBill.deleteBill);

// 装车拍照
router.post('/truck/list', cxTruck.query);
router.get('/truck/id/:id', cxTruck.getById);
router.put('/truck', cxTruck.create);
router.post('/truck', cxTruck.update);
router.delete('/truck/:id', cxTruck.deleteTruck);

// 车载库存查询
router.post('/inventory/list', cxInventory.query);
router.get('/inventory/id/:id', cxInventory.getById);
router.put('/inventory', cxInventory.create);
router.post('/inventory', cxInventory.update);

// 车销单
router.post('/order/list', cxOrder.query);
router.get('/order/id/:id', cxOrder.getById);
router.put('/order', cxOrder.create);
router.post('/order', cxOrder.update);
router.delete('/order/:id', cxOrder.deleteOrder);

// 退换货在售
router.post('/refundable/list', cxRefundable.query);
router.get('/refundable/id/:id', cxRefundable.getById);
router.put('/refundable', cxRefundable.create);
router.post('/refundable', cxRefundable.update);
router.delete('/refundable/:id', cxRefundable.deleteRefundable);

// 车载盘点
router.post('/inventoryCheck/list', cxInventoryCheck.query);
router.get('/inventoryCheck/id/:id', cxInventoryCheck.getById);
router.put('/inventoryCheck', cxInventoryCheck.create);
router.post('/inventoryCheck', cxInventoryCheck.update);
router.delete('/inventoryCheck/:id', cxInventoryCheck.deleteInventoryCheck);

// 回库申请
router.post('/back/list', cxBack.query);
router.get('/back/id/:id', cxBack.getById);
router.put('/back', cxBack.create);
router.post('/back', cxBack.update);
router.delete('/back/:id', cxBack.deleteBack);

// 到店在售
