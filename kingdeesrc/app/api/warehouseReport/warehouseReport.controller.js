const errors = require('@lib/errors');
const L = require('debug')('app:api');
const pushMsg = require('../message/message.controller').pushMsg;
const NP = require('number-precision');
const moment = require('moment');

const Warehouse = require('../warehouse/warehouse.model');
const WarehouseIn = require('../warehouseIn/warehouseIn.model');
const WarehouseOut = require('../warehouseOut/warehouseOut.model');
const WarehouseAllocatingIn = require('../warehouseAllocatingIn/warehouseAllocatingIn.model');
const WarehouseAllocatingOut = require('../warehouseAllocatingOut/warehouseAllocatingOut.model');
const WarehouseDiskDeficient = require('../warehouseDiskDeficient/warehouseDiskDeficient.model');
const WarehouseDiskSurplus = require('../warehouseDiskSurplus/warehouseDiskSurplus.model');
const WarehouseReceipt = require('../warehouseReceipt/warehouseReceipt.model');
const SalesOrder = require('../salesOrder/salesOrder.model');
const SalesWarehouse = require('../salesWarehouse/salesWarehouse.model');
const SalesReturn = require('../salesReturn/salesReturn.model');
const PurchaseOrder = require('../purchaseOrder/purchaseOrder.model');
const PurchaseWarehouse = require('../purchaseWarehouse/purchaseWarehouse.model');
const PurchaseReturn = require('../purchaseReturn/purchaseReturn.model');
const CommodityInfo = require('../commodityInfo/commodityInfo.model');

module.exports = {
    queryWarehouseReport,
    availableWarehouseReport,
    detailWarehouseReport,
    summaryWarehouseReport,
    // stateWarehouseReport,
    // trackingWarehouseReport
};

async function queryWarehouseReport(req, res, next) {
    L('Calling API WarehouseReport.queryWarehouseReport', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else {
            let wList = await Warehouse.find(data)
            let wAOList = await WarehouseAllocatingOut.find(Object.assign({resultStatus: '未处理'}, data))
            let cIds = []
            let add = (addData, type) => {
                addData.forEach(f => {
                    cIds = cIds.concat(f[type].map(m => m.commodityId))
                })
            }
            add(wList, 'inventoryList')
            add(wAOList, 'list')
            let cList = await CommodityInfo.find({_id: {$in: Array.from(new Set(cIds)) }})
            res.status(200).json({
                wList,
                wAOList,
                cList
            })
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function availableWarehouseReport(req, res, next) {
    L('Calling API WarehouseReport.availableWarehouseReport', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else {
            let wList = await Warehouse.find(data)
            let wAOList = await WarehouseAllocatingOut.find(Object.assign({resultStatus: '未处理'}, data))
            let sList = await SalesOrder.find(Object.assign({storage: { $ne: '全部出库'}}, data))
            let pList = await PurchaseOrder.find(Object.assign({storage: { $ne: '全部入库'}}, data))
            let cIds = []
            let add = (addData, type) => {
                addData.forEach(f => {
                    cIds = cIds.concat(f[type].map(m => m.commodityId))
                })
            }
            add(wList, 'inventoryList')
            add(wAOList, 'list')
            add(sList, 'list')
            add(sList, 'list')
            let cList = await CommodityInfo.find({_id: {$in: Array.from(new Set(cIds)) }})
            res.status(200).json({
                wList,
                wAOList,
                sList,
                pList,
                cList
            })
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function detailWarehouseReport(req, res, next) {
    L('Calling API WarehouseReport.detailWarehouseReport', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else {
            let type = data.type
            delete data.type
            let wIList = type.length === 0 || type.includes('其他入库') ? await WarehouseIn.find(data) : []
            let wOList = type.length === 0 || type.includes('其他出库') ? await WarehouseOut.find(data) : []
            let wAIList = type.length === 0 || type.includes('调拨入库') ? await WarehouseAllocatingIn.find(data) : []
            let wAOList = type.length === 0 || type.includes('调拨出库') ? await WarehouseAllocatingOut.find(data) : []
            let wDDList = type.length === 0 || type.includes('盘亏单') ? await WarehouseDiskDeficient.find(data) : []
            let wDSList = type.length === 0 || type.includes('盘盈单') ? await WarehouseDiskSurplus.find(data) : []
            let wRList = type.length === 0 || type.includes('移仓单') ? await WarehouseReceipt.find(data) : []
            let sWList = type.length === 0 || type.includes('销售出库') ? await SalesWarehouse.find(data) : []
            let sRList = type.length === 0 || type.includes('销售退货') ? await SalesReturn.find(data) : []
            let pWList = type.length === 0 || type.includes('采购入库') ? await PurchaseWarehouse.find(data) : []
            let pRList = type.length === 0 || type.includes('采购退货') ? await PurchaseReturn.find(data) : []
            let result = []
            let add = (orderData, type, isIN, number, routerName, wId = null) => {
                orderData.forEach(order => {
                    result = result.concat(order.list.map(m => {
                        return {
                            orderId: order._id,
                            orderType: type,
                            orderCode: order.code,
                            dateTime: order.dateTime,
                            audit: order.audit,
                            commodityId: m.commodityId,
                            code: m.code,
                            name: m.name,
                            groupId: m.groupId,
                            auxiliary: m.auxiliary,
                            unit: m.unit,
                            equation: m.unitList.find(v => v.name === m.unit).equation,
                            unitDefault: m.unitList[0].name,
                            warehouseId: wId ? m[wId] : m.warehouseId,
                            number: m[number],
                            price: m.unitDelivery || 0,
                            total: m.deliveryCost || 0,
                            isIN,
                            routerName,
                        }
                    }))
                })
            }
            add(wIList, '其他入库', true, 'number', 'warehouseIn')
            add(wOList, '其他出库', false, 'number', 'warehouseOut')
            add(wAIList, '调拨入库', true, 'number', 'warehouseAllocatingIn')
            add(wAOList, '调拨出库', false, 'number', 'warehouseAllocatingOut')
            add(wDDList, '盘亏单', false, 'number', 'warehouseDiskDeficient')
            add(wDSList, '盘盈单', true, 'number', 'warehouseDiskSurplus')
            add(wRList, '移仓单', true, 'number', 'warehouseReceipt', 'warehouseIdIn')
            add(wRList, '移仓单', false, 'number', 'warehouseReceipt', 'warehouseIdOut')
            add(sWList, '销售出库', false, 'outStorage', 'salesWarehouse')
            add(sRList, '销售退货', true, 'reStorage', 'salesReturn')
            add(pWList, '采购入库', true, 'inStorage', 'purchaseWarehouse')
            add(pRList, '采购退货', false, 'reStorage', 'purchaseReturn')
            res.status(200).json(result)
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function summaryWarehouseReport(req, res, next) {
    L('Calling API WarehouseReport.summaryWarehouseReport', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else {
            let wIList = await WarehouseIn.find(data)
            let wOList = await WarehouseOut.find(data)
            let wAIList = await WarehouseAllocatingIn.find(data)
            let wAOList = await WarehouseAllocatingOut.find(data)
            let wDDList = await WarehouseDiskDeficient.find(data)
            let wDSList = await WarehouseDiskSurplus.find(data)
            let wRList = await WarehouseReceipt.find(data)
            let sWList = await SalesWarehouse.find(data)
            let sRList = await SalesReturn.find(data)
            let pWList = await PurchaseWarehouse.find(data)
            let pRList = await PurchaseReturn.find(data)
            let result = []
            let add = (orderData, type, isIN, number, routerName, wId = null) => {
                orderData.forEach(order => {
                    result = result.concat(order.list.map(m => {
                        return {
                            orderId: order._id,
                            orderType: type,
                            orderCode: order.code,
                            dateTime: order.dateTime,
                            audit: order.audit,
                            commodityId: m.commodityId,
                            code: m.code,
                            name: m.name,
                            groupId: m.groupId,
                            auxiliary: m.auxiliary,
                            unit: m.unit,
                            unitDefault: m.unitList[0].name,
                            equation: m.unitList.find(v => v.name === m.unit).equation,
                            warehouseId: wId ? m[wId] : m.warehouseId,
                            number: m[number],
                            price: m.unitDelivery || 0,
                            total: m.deliveryCost || 0,
                            isIN,
                            routerName,
                        }
                    }))
                })
            }
            add(wIList, '其他入库', true, 'number', 'warehouseIn')
            add(wOList, '其他出库', false, 'number', 'warehouseOut')
            add(wAIList, '调拨入库', true, 'number', 'warehouseAllocatingIn')
            add(wAOList, '调拨出库', false, 'number', 'warehouseAllocatingOut')
            add(wDDList, '盘亏单', false, 'number', 'warehouseDiskDeficient')
            add(wDSList, '盘盈单', true, 'number', 'warehouseDiskSurplus')
            add(wRList, '移仓单', true, 'number', 'warehouseReceipt', 'warehouseIdIn')
            add(wRList, '移仓单', false, 'number', 'warehouseReceipt', 'warehouseIdOut')
            add(sWList, '销售出库', false, 'outStorage', 'salesWarehouse')
            add(sRList, '销售退货', true, 'reStorage', 'salesReturn')
            add(pWList, '采购入库', true, 'inStorage', 'purchaseWarehouse')
            add(pRList, '采购退货', false, 'reStorage', 'purchaseReturn')
            res.status(200).json(result)
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}