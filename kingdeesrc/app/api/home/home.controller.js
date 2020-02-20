const errors = require('@lib/errors');
const L = require('debug')('app:api');
const pushMsg = require('../message/message.controller').pushMsg;

const PurchaseOrder = require('../purchaseOrder/purchaseOrder.model');
const PurchaseWarehouse = require('../purchaseWarehouse/purchaseWarehouse.model');
const PurchaseReturn = require('../purchaseReturn/purchaseReturn.model');

const SalesOrder = require('../salesOrder/salesOrder.model');
const SalesWarehouse = require('../salesWarehouse/salesWarehouse.model');
const SalesReturn = require('../salesReturn/salesReturn.model');

const WarehouseIn = require('../warehouseIn/warehouseIn.model');
const WarehouseOut = require('../warehouseOut/warehouseOut.model');
const WarehouseAllocatingIn = require('../warehouseAllocatingIn/warehouseAllocatingIn.model');
const WarehouseAllocatingOut = require('../warehouseAllocatingOut/warehouseAllocatingOut.model');

module.exports = {
    queryAllList
};

async function queryAllList(req, res, next) {
    L('Calling API Home.queryAllList', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else {
            let result = []
            let a = await PurchaseOrder.find({
                accountSetId: data.accountSetId,
                storage: {$ne: '全部入库'},
                audit: '已审核',
                close: '未关闭'
            }).countDocuments()
            result.push({
                title: '订单在途',
                name: '采购订单',
                number: a,
                routerName: 'purchaseOrderList',
                storage: '!全部入库',
                audit: '已审核',
                close: '未关闭'
            })

            let b = await PurchaseOrder.find({
                accountSetId: data.accountSetId,
                audit: '未审核'
            }).countDocuments()
            result.push({
                title: '采购订单/未审核',
                name: '采购订单',
                number: b,
                routerName: 'purchaseOrderList',
                audit: '未审核'
            })

            let c = await PurchaseWarehouse.find({
                accountSetId: data.accountSetId,
                audit: '未审核'
            }).countDocuments()
            result.push({
                title: '采购入库单/未审核',
                name: '采购入库单',
                number: c,
                routerName: 'purchaseWarehouseList',
                audit: '未审核'
            })

            let d = await PurchaseReturn.find({
                accountSetId: data.accountSetId,
                audit: '未审核'
            }).countDocuments()
            result.push({
                title: '采购退货单/未审核',
                name: '采购退货单',
                number: d,
                routerName: 'purchaseReturnList',
                audit: '未审核'
            })

            let e = await SalesOrder.find({
                accountSetId: data.accountSetId,
                storage: {$ne: '全部出库'},
                audit: '已审核',
                close: '未关闭'
            }).countDocuments()
            result.push({
                title: '待出库',
                name: '销售订单',
                number: e,
                routerName: 'salesOrderList',
                storage: '!全部入库',
                audit: '已审核',
                close: '未关闭'
            })

            let f = await SalesOrder.find({
                accountSetId: data.accountSetId,
                audit: '未审核'
            }).countDocuments()
            result.push({
                title: '销售订单/未审核',
                name: '销售订单',
                number: f,
                routerName: 'salesOrderList',
                audit: '未审核'
            })

            let g = await SalesWarehouse.find({
                accountSetId: data.accountSetId,
                audit: '未审核'
            }).countDocuments()
            result.push({
                title: '销售出库单/未审核',
                name: '销售出库单',
                number: g,
                routerName: 'salesWarehouseList',
                audit: '未审核'
            })

            let h = await SalesReturn.find({
                accountSetId: data.accountSetId,
                audit: '未审核'
            }).countDocuments()
            result.push({
                title: '销售退货单/未审核',
                name: '销售退货单',
                number: h,
                routerName: 'salesReturnList',
                audit: '未审核'
            })

            let i = await WarehouseAllocatingOut.find({
                accountSetId: data.accountSetId,
                audit: '未审核'
            }).countDocuments()
            result.push({
                title: '调拨出库单/未审核',
                name: '调拨出库单',
                number: i,
                routerName: 'warehouseAllocatingOutList',
                audit: '未审核'
            })

            let j = await WarehouseAllocatingIn.find({
                accountSetId: data.accountSetId,
                audit: '未审核'
            }).countDocuments()
            result.push({
                title: '调拨入库单/未审核',
                name: '调拨入库单',
                number: j,
                routerName: 'warehouseAllocatingInList',
                audit: '未审核'
            })

            let k = await WarehouseOut.find({
                accountSetId: data.accountSetId,
                audit: '未审核'
            }).countDocuments()
            result.push({
                title: '其他出库单/未审核',
                name: '其他出库单',
                number: k,
                routerName: 'warehouseOutList',
                audit: '未审核'
            })

            let l = await WarehouseIn.find({
                accountSetId: data.accountSetId,
                audit: '未审核'
            }).countDocuments()
            result.push({
                title: '其他入库单/未审核',
                name: '其他入库单',
                number: l,
                routerName: 'warehouseInList',
                audit: '未审核'
            })

            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
