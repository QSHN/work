const errors = require('@lib/errors');
const L = require('debug')('app:api');
const pushMsg = require('../message/message.controller').pushMsg;
const moment = require('moment');

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
const WarehouseDiskDeficient = require('../warehouseDiskDeficient/warehouseDiskDeficient.model');
const WarehouseDiskSurplus = require('../warehouseDiskSurplus/warehouseDiskSurplus.model');
const WarehouseDiskPoint = require('../warehouseDiskPoint/warehouseDiskPoint.model');

const ReceivableCollection = require('../receivableCollection/receivableCollection.model');
const ReceivablePayments = require('../receivablePayments/receivablePayments.model');
const ReceivableRefund = require('../receivableRefund/receivableRefund.model');
const ReceivableOther = require('../receivableOther/receivableOther.model');
const ReceivableVerification = require('../receivableVerification/receivableVerification.model');

const PayableCollection = require('../payableCollection/payableCollection.model');
const PayablePayments = require('../payablePayments/payablePayments.model');
const PayableRefund = require('../payableRefund/payableRefund.model');
const PayableOther = require('../payableOther/payableOther.model');

module.exports = {
    processTracking
};

async function processTracking(req, res, next) {
    L('Calling API ProcessTracking.processTracking', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('单据id必填'));
        } else if (!data.type) {
            next(new errors.BadRequest('单据类型必填'));
        } else {
            let result = []
            let getOrder = async (type, id) => {
                let order = null
                switch (type) {
                    case '采购订单':
                        order = await PurchaseOrder.findOne({_id: id})
                        break
                    case '采购入库单':
                        order = await PurchaseWarehouse.findOne({_id: id})
                        break
                    case '采购退货单':
                        order = await PurchaseReturn.findOne({_id: id})
                        break
                    case '销售订单':
                        order = await SalesOrder.findOne({_id: id})
                        break
                    case '销售出库单':
                        order = await SalesWarehouse.findOne({_id: id})
                        break
                    case '销售退货单':
                        order = await SalesReturn.findOne({_id: id})
                        break
                    case '盘点单':
                        order = await WarehouseDiskPoint.findOne({_id: id })
                        break
                    case '盘盈单':
                        order = await WarehouseDiskSurplus.findOne({_id: id })
                        break
                    case '盘亏单':
                        order = await WarehouseDiskDeficient.findOne({_id: id })
                        break
                    case '其他入库单':
                        order = await WarehouseIn.findOne({_id: id })
                        break
                    case '其他出库单':
                        order = await WarehouseOut.findOne({_id: id })
                        break
                    case '调拨入库单':
                        order = await WarehouseAllocatingIn.findOne({_id: id })
                        break
                    case '调拨出库单':
                        order = await WarehouseAllocatingOut.findOne({_id: id })
                        break
                    case '收款单':
                        order = await ReceivableCollection.findOne({_id: id })
                        break
                    case '付款单':
                        order = await PayableCollection.findOne({_id: id })
                        break
                    case '预收款单':
                        order = await ReceivablePayments.findOne({_id: id })
                        break
                    case '预付款单':
                        order = await PayablePayments.findOne({_id: id })
                        break
                    case '预收退款单':
                        order = await ReceivableRefund.findOne({_id: id })
                        break
                    case '预付退款单':
                        order = await PayableRefund.findOne({_id: id })
                        break
                    case '其他应收单':
                        order = await ReceivableOther.findOne({_id: id })
                        break
                    case '其他应付单':
                        order = await PayableOther.findOne({_id: id })
                        break
                    case '核销单':
                        order = await ReceivableVerification.findOne({_id: id })
                        break
                }
                return order
            }
            for (let i = 0; i < data.ids.length; i++) {
                let order = await getOrder(data.type, data.ids[i])
                let obj = {
                    type: data.type,
                    code: order.code,
                    child: [Object.assign({orderType: data.type}, order._doc)]
                }
                let getChild = async (order, type, lastType) => {
                    let ids= []
                    let po = null
                    let pw = null
                    let pr = null
                    let so = null
                    let sw = null
                    let sr = null
                    let wdp = null
                    let wdd = null
                    let wds = null
                    let wi = null
                    let wo = null
                    let wai = null
                    let wao  = null
                    let pac = null
                    let pap = null
                    let par = null
                    let pao = null
                    let pav = null
                    let rc = null
                    let rp = null
                    let rr = null
                    let ro = null
                    switch (type) {
                        case '采购订单':
                            if (lastType !== '预付款单') {
                                pap = await PayablePayments.find({orderId: order._id})
                                if (pap && pap.length) {
                                    pap.forEach(f => {
                                        if (!obj.child.find(fc => fc._id === f._id)) {
                                            obj.child.push(Object.assign({orderType: '预付款单'}, f._doc))
                                        }
                                    })
                                }
                            }
                            if (lastType !== '采购入库单') {
                                pw = await PurchaseWarehouse.find({list: { $elemMatch: { pId: order._id } }})
                                if (pw && pw.length) {
                                    for (let c = 0; c < pw.length; c++) {
                                        if (!obj.child.find(fc => fc._id === pw[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '采购入库单'}, pw[c]._doc))
                                            getChild(pw[c], '采购入库单', '采购订单')
                                        }
                                    }
                                }
                            }
                            break
                        case '采购入库单':
                            if (lastType !== '付款单') {
                                pac = await PayableCollection.find({'order.list': {$elemMatch: {orderId: order._id}}})
                                if (pac && pac.length) {
                                    pac.forEach(f => {
                                        if (!obj.child.find(fc => fc._id === f._id)) {
                                            obj.child.push(Object.assign({orderType: '付款单'}, f._doc))
                                        }
                                    })
                                }
                            }
                            if (lastType !== '预付款单') {
                                pap = await PayablePayments.find({'main.payList': {$elemMatch: {orderId: order._id}}})
                                if (pap && pap.length) {
                                    pap.forEach(f => {
                                        if (!obj.child.find(fc => fc._id === f._id)) {
                                            obj.child.push(Object.assign({orderType: '预付款单'}, f._doc))
                                        }
                                    })
                                }
                            }
                            if (lastType !== '采购退货单') {
                                pr = await PurchaseReturn.find({list: {$elemMatch: {pId: order._id}}})
                                if (pr && pr.length) {
                                    for (let c = 0; c < pr.length; c++) {
                                        obj.child.push(Object.assign({orderType: '采购退货单'}, pr[c]._doc))
                                        getChild(pr[c], '采购退货单', '采购入库单')
                                    }
                                }
                            }
                            if (lastType !== '采购订单') {
                                ids = Array.from(new Set(order.list.map(m => m.pId)))
                                po = await PurchaseOrder.find({_id: {$in: ids}})
                                if (po && po.length) {
                                    for (let c = 0; c < po.length; c++) {
                                        obj.child.push(Object.assign({orderType: '采购订单'}, po[c]._doc))
                                        getChild(po[c], '采购订单', '采购入库单')
                                    }
                                }
                            }
                            break
                        case '采购退货单':
                            if (lastType !== '付款单') {
                                pac = await PayableCollection.find({'order.list': {$elemMatch: {orderId: order._id}}})
                                if (pac && pac.length) {
                                    pac.forEach(f => {
                                        if (!obj.child.find(fc => fc._id === f._id)) {
                                            obj.child.push(Object.assign({orderType: '付款单'}, f._doc))
                                        }
                                    })
                                }
                            }
                            if (lastType !== '采购入库单') {
                                ids = Array.from(new Set(order.list.map(m => m.pId)))
                                pw = await PurchaseWarehouse.find({_id: {$in: ids}})
                                if (pw && pw.length) {
                                    for (let c = 0; c < pw.length; c++) {
                                        if (!obj.child.find(fc => fc._id === pw[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '采购入库单'}, pw[c]._doc))
                                            getChild(pw[c], '采购入库单', '采购退货单')
                                        }
                                    }
                                }
                            }
                            break
                        case '销售订单':
                            if (lastType !== '预收款单') {
                                rp = await ReceivablePayments.find({orderId: order._id})
                                if (rp && rp.length) {
                                    rp.forEach(f => {
                                        if (!obj.child.find(fc => fc._id === f._id)) {
                                            obj.child.push(Object.assign({orderType: '预收款单'}, f._doc))
                                        }
                                    })
                                }
                            }
                            if (lastType !== '销售出库单') {
                                sw = await SalesWarehouse.find({list: {$elemMatch: {pId: order._id}}})
                                if (sw && sw.length) {
                                    for (let c = 0; c < sw.length; c++) {
                                        if (!obj.child.find(fc => fc._id === sw[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '销售出库单'}, sw[c]._doc))
                                            getChild(sw[c], '销售出库单', '销售订单')
                                        }
                                    }
                                }
                            }
                            break
                        case '销售出库单':
                            if (lastType !== '收款单') {
                                rc = await ReceivableCollection.find({'order.list': {$elemMatch: {orderId: order._id}}})
                                if (rc && rc.length) {
                                    rc.forEach(f => {
                                        if (!obj.child.find(fc => fc._id === f._id)) {
                                            obj.child.push(Object.assign({orderType: '收款单'}, f._doc))
                                        }
                                    })
                                }
                            }
                            if (lastType !== '预收款单') {
                                rp = await ReceivablePayments.find({'main.payList': {$elemMatch: {orderId: order._id}}})
                                if (rp && rp.length) {
                                    rp.forEach(f => {
                                        if (!obj.child.find(fc => fc._id === f._id)) {
                                            obj.child.push(Object.assign({orderType: '预收款单'}, f._doc))
                                        }
                                    })
                                }
                            }
                            if (lastType !== '销售退货单') {
                                sr = await SalesReturn.find({list: {$elemMatch: {pId: order._id}}})
                                if (sr && sr.length) {
                                    for (let c = 0; c < sr.length; c++) {
                                        if (!obj.child.find(fc => fc._id === sr[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '销售退货单'}, sr[c]._doc))
                                            getChild(sr[c], '销售退货单', '销售出库单')
                                        }
                                    }
                                }
                            }
                            if (lastType !== '销售订单') {
                                ids = Array.from(new Set(order.list.map(m => m.pId)))
                                so = await SalesOrder.find({_id: {$in: ids}})
                                if (so && so.length) {
                                    for (let c = 0; c < so.length; c++) {
                                        obj.child.push(Object.assign({orderType: '销售订单'}, so[c]._doc))
                                        getChild(so[c], '销售订单', '销售出库单')
                                    }
                                }
                            }
                            break
                        case '销售退货单':
                            if (lastType !== '收款单') {
                                rc = await ReceivableCollection.find({'order.list': {$elemMatch: {orderId: order._id}}})
                                if (rc && rc.length) {
                                    rc.forEach(f => {
                                        if (!obj.child.find(fc => fc._id === f._id)) {
                                            obj.child.push(Object.assign({orderType: '收款单'}, f._doc))
                                        }
                                    })
                                }
                            }
                            if (lastType !== '销售出库单') {
                                ids = Array.from(new Set(order.list.map(m => m.pId)))
                                sw = await SalesWarehouse.find({_id: {$in: ids}})
                                if (sw && sw.length) {
                                    for (let c = 0; c < sw.length; c++) {
                                        if (!obj.child.find(fc => fc._id === sw[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '销售出库单'}, sw[c]._doc))
                                            getChild(sw[c], '销售出库单', '销售退货单')
                                        }
                                    }
                                }
                            }
                            break
                        case '盘点单':
                            if (lastType !== '盘亏单') {
                                wdd = await WarehouseDiskDeficient.find({_id: order.deficientId})
                                if (wdd && wdd.length) {
                                    wdd.forEach(f => {
                                        if (!obj.child.find(fc => fc._id === f._id)) {
                                            obj.child.push(Object.assign({orderType: '盘亏单'}, f._doc))
                                        }
                                    })
                                }
                            }
                            if (lastType !== '盘盈单') {
                                wds = await WarehouseDiskSurplus.find({_id: order.surplusId})
                                if (wds && wds.length) {
                                    wds.forEach(f => {
                                        if (!obj.child.find(fc => fc._id === f._id)) {
                                            obj.child.push(Object.assign({orderType: '盘盈单'}, f._doc))
                                        }
                                    })
                                }
                            }
                            break
                        case '盘盈单':
                            if (lastType !== '盘点单') {
                                wdp = await WarehouseDiskPoint.find({surplusId: order._id})
                                if (wdp && wdp.length) {
                                    for (let c = 0; c < wdp.length; c++) {
                                        if (!obj.child.find(fc => fc._id === wdp[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '盘点单'}, wdp[c]._doc))
                                            getChild(wdp[c], '盘点单', '盘盈单')
                                        }
                                    }
                                }
                            }
                            break
                        case '盘亏单':
                            if (lastType !== '盘点单') {
                                wdp = await WarehouseDiskPoint.find({deficientId: order._id})
                                if (wdp && wdp.length) {
                                    for (let c = 0; c < wdp.length; c++) {
                                        if (!obj.child.find(fc => fc._id === wdp[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '盘点单'}, wdp[c]._doc))
                                            getChild(wdp[c], '盘点单', '盘亏单')
                                        }
                                    }
                                }
                            }
                            break
                        case '其他入库单':
                            if (lastType !== '其他出库单') {
                                ids = Array.from(new Set(order.list.map(m => m.pId)))
                                wo = await WarehouseOut.find({_id: {$in: ids}})
                                if (wo && wo.length) {
                                    for (let c = 0; c < wo.length; c++) {
                                        if (!obj.child.find(fc => fc._id === wo[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '其他出库单'}, wo[c]._doc))
                                            getChild(wo[c], '其他出库单', '其他入库单')
                                        }
                                    }
                                }
                            }
                            break
                        case '其他出库单':
                            if (lastType !== '其他入库单') {
                                ids = Array.from(new Set(order.list.map(m => m.pId)))
                                wi = await WarehouseIn.find({_id: {$in: ids}})
                                if (wi && wi.length) {
                                    for (let c = 0; c < wi.length; c++) {
                                        if (!obj.child.find(fc => fc._id === wi[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '其他入库单'}, wi[c]._doc))
                                            getChild(wi[c], '其他入库单', '其他出库单')
                                        }
                                    }
                                }
                            }
                            break
                        case '调拨入库单':
                            if (lastType !== '调拨出库单') {
                                ids = Array.from(new Set(order.list.map(m => m.pId)))
                                wao = await WarehouseAllocatingOut.find({_id: {$in: ids}})
                                if (wao && wao.length) {
                                    for (let c = 0; c < wao.length; c++) {
                                        if (!obj.child.find(fc => fc._id === wao[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '调拨出库单'}, wao[c]._doc))
                                            getChild(wao[c], '调拨出库单', '调拨入库单')
                                        }
                                    }
                                }
                            }
                            break
                        case '调拨出库单':
                            if (lastType !== '调拨入库单') {
                                ids = Array.from(new Set(order.list.map(m => m.pId)))
                                wai = await WarehouseAllocatingIn.find({_id: {$in: ids}})
                                if (wai && wai.length) {
                                    for (let c = 0; c < wai.length; c++) {
                                        if (!obj.child.find(fc => fc._id === wai[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '调拨入库单'}, wai[c]._doc))
                                            getChild(wai[c], '调拨入库单', '调拨出库单')
                                        }
                                    }
                                }
                            }
                            break
                        case '收款单':
                            if (lastType !== '销售出库单') {
                                ids = Array.from(new Set(order.order.list.map(m => m.orderType === '销售出库单' && m.orderId)))
                                sw = await SalesWarehouse.find({_id: {$in: ids}})
                                if (sw && sw.length) {
                                    for (let c = 0; c < sw.length; c++) {
                                        if (!obj.child.find(fc => fc._id === sw[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '销售出库单'}, sw[c]._doc))
                                        }
                                    }
                                }
                            }
                            if (lastType !== '销售退货单') {
                                ids = Array.from(new Set(order.order.list.map(m => m.orderType === '销售退货单' && m.orderId)))
                                sr = await SalesReturn.find({_id: {$in: ids}})
                                if (sr && sr.length) {
                                    for (let c = 0; c < sr.length; c++) {
                                        if (!obj.child.find(fc => fc._id === sr[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '销售退货单'}, sr[c]._doc))
                                        }
                                    }
                                }
                            }
                            if (lastType !== '其他应收单') {
                                ro = await ReceivableOther.find({ 'orderId.payList': {$elemMatch: {orderId: order._id}}})
                                if (ro && ro.length) {
                                    for (let c = 0; c < ro.length; c++) {
                                        if (!obj.child.find(fc => fc._id === ro[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '其他应收单'}, ro[c]._doc))
                                        }
                                    }
                                }
                            }
                            break
                        case '付款单':
                            if (lastType !== '采购入库单') {
                                ids = Array.from(new Set(order.order.list.map(m => m.orderType === '采购入库单' && m.orderId)))
                                pw = await PurchaseWarehouse.find({_id: {$in: ids}})
                                if (pw && pw.length) {
                                    for (let c = 0; c < pw.length; c++) {
                                        if (!obj.child.find(fc => fc._id === pw[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '采购入库单'}, pw[c]._doc))
                                        }
                                    }
                                }
                            }
                            if (lastType !== '采购退货单') {
                                ids = Array.from(new Set(order.order.list.map(m => m.orderType === '采购退货单' && m.orderId)))
                                pr = await PurchaseReturn.find({_id: {$in: ids}})
                                if (pr && pr.length) {
                                    for (let c = 0; c < pr.length; c++) {
                                        if (!obj.child.find(fc => fc._id === pr[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '采购退货单'}, pr[c]._doc))
                                        }
                                    }
                                }
                            }
                            if (lastType !== '其他应付单') {
                                pao = await PayableOther.find({ 'orderId.payList': {$elemMatch: {orderId: order._id}}})
                                if (pao && pao.length) {
                                    for (let c = 0; c < pao.length; c++) {
                                        if (!obj.child.find(fc => fc._id === pao[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '其他应付单'}, pao[c]._doc))
                                        }
                                    }
                                }
                            }
                            break
                        case '预收款单':
                            if (lastType !== '销售订单') {
                                ids = Array.from(new Set(order.main.payList.map(m => m.orderType === '销售订单' && m.orderId)))
                                so = await SalesOrder.find({_id: {$in: ids}})
                                if (so && so.length) {
                                    for (let c = 0; c < so.length; c++) {
                                        if (!obj.child.find(fc => fc._id === so[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '销售订单'}, so[c]._doc))
                                        }
                                    }
                                }
                            }
                            if (lastType !== '销售出库单') {
                                ids = Array.from(new Set(order.main.payList.map(m => m.orderType === '销售出库单' && m.orderId)))
                                sw = await SalesWarehouse.find({_id: {$in: ids}})
                                if (sw && sw.length) {
                                    for (let c = 0; c < sw.length; c++) {
                                        if (!obj.child.find(fc => fc._id === sw[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '销售出库单'}, sw[c]._doc))
                                        }
                                    }
                                }
                            }
                            if (lastType !== '预收退款单') {
                                ids = Array.from(new Set(order.main.payList.map(m => m.orderType === '预收退款单' && m.orderId)))
                                rr = await ReceivableRefund.find({_id: {$in: ids}})
                                if (rr && rr.length) {
                                    for (let c = 0; c < rr.length; c++) {
                                        if (!obj.child.find(fc => fc._id === rr[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '预收退款单'}, rr[c]._doc))
                                        }
                                    }
                                }
                            }
                            if (lastType !== '其他应收单') {
                                ids = Array.from(new Set(order.main.payList.map(m => m.orderType === '其他应收单' && m.orderId)))
                                ro = await ReceivableOther.find({_id: {$in: ids}})
                                if (ro && ro.length) {
                                    for (let c = 0; c < ro.length; c++) {
                                        if (!obj.child.find(fc => fc._id === ro[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '其他应收单'}, ro[c]._doc))
                                        }
                                    }
                                }
                            }
                            break
                        case '预付款单':
                            if (lastType !== '采购订单') {
                                ids = Array.from(new Set(order.main.payList.map(m => m.orderType === '采购订单' && m.orderId)))
                                po = await PurchaseOrder.find({_id: {$in: ids}})
                                if (po && po.length) {
                                    for (let c = 0; c < po.length; c++) {
                                        if (!obj.child.find(fc => fc._id === po[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '采购订单'}, po[c]._doc))
                                        }
                                    }
                                }
                            }
                            if (lastType !== '采购入库单') {
                                ids = Array.from(new Set(order.main.payList.map(m => m.orderType === '采购入库单' && m.orderId)))
                                pw = await PurchaseWarehouse.find({_id: {$in: ids}})
                                if (pw && pw.length) {
                                    for (let c = 0; c < pw.length; c++) {
                                        if (!obj.child.find(fc => fc._id === pw[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '采购入库单'}, pw[c]._doc))
                                        }
                                    }
                                }
                            }
                            if (lastType !== '预付退款单') {
                                ids = Array.from(new Set(order.main.payList.map(m => m.orderType === '预付退款单' && m.orderId)))
                                par = await PayableRefund.find({_id: {$in: ids}})
                                if (par && par.length) {
                                    for (let c = 0; c < par.length; c++) {
                                        if (!obj.child.find(fc => fc._id === par[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '预付退款单'}, par[c]._doc))
                                        }
                                    }
                                }
                            }
                            if (lastType !== '其他应付单') {
                                ids = Array.from(new Set(order.main.payList.map(m => m.orderType === '其他应付单' && m.orderId)))
                                pao = await PayableOther.find({_id: {$in: ids}})
                                if (pao && pao.length) {
                                    for (let c = 0; c < pao.length; c++) {
                                        if (!obj.child.find(fc => fc._id === pao[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '其他应付单'}, pao[c]._doc))
                                        }
                                    }
                                }
                            }
                            break
                        case '预收退款单':
                            if (lastType !== '预收款单') {
                                ids = Array.from(new Set(order.order.list.map(m => m.orderType === '预收款单' && m.orderId)))
                                rr = await ReceivableRefund.find({_id: {$in: ids}})
                                if (rr && rr.length) {
                                    for (let c = 0; c < rr.length; c++) {
                                        if (!obj.child.find(fc => fc._id === rr[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '预收款单'}, rr[c]._doc))
                                        }
                                    }
                                }
                            }
                            break
                        case '预付退款单':
                            if (lastType !== '预付款单') {
                                ids = Array.from(new Set(order.order.list.map(m => m.orderType === '预付款单' && m.orderId)))
                                par = await PayableRefund.find({_id: {$in: ids}})
                                if (par && par.length) {
                                    for (let c = 0; c < par.length; c++) {
                                        if (!obj.child.find(fc => fc._id === par[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '预付款单'}, rr[c]._doc))
                                        }
                                    }
                                }
                            }
                            break
                        case '其他应收单':
                            if (lastType !== '预收款单') {
                                ids = Array.from(new Set(order.order.payList.map(m => m.orderType === '预收款单' && m.orderId)))
                                rr = await ReceivableRefund.find({_id: {$in: ids}})
                                if (rr && rr.length) {
                                    for (let c = 0; c < rr.length; c++) {
                                        if (!obj.child.find(fc => fc._id === rr[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '预收款单'}, rr[c]._doc))
                                        }
                                    }
                                }
                            }
                            if (lastType !== '其他应付单') {
                                ids = Array.from(new Set(order.order.payList.map(m => m.orderType === '其他应付单' && m.orderId)))
                                pao = await PayableOther.find({_id: {$in: ids}})
                                if (pao && pao.length) {
                                    for (let c = 0; c < pao.length; c++) {
                                        if (!obj.child.find(fc => fc._id === pao[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '其他应付单'}, pao[c]._doc))
                                        }
                                    }
                                }
                            }
                            break
                        case '其他应付单':
                            if (lastType !== '预付款单') {
                                ids = Array.from(new Set(order.order.payList.map(m => m.orderType === '预付款单' && m.orderId)))
                                par = await PayableRefund.find({_id: {$in: ids}})
                                if (par && par.length) {
                                    for (let c = 0; c < par.length; c++) {
                                        if (!obj.child.find(fc => fc._id === par[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '预付款单'}, rr[c]._doc))
                                        }
                                    }
                                }
                            }
                            if (lastType !== '其他应收单') {
                                ids = Array.from(new Set(order.order.payList.map(m => m.orderType === '其他应收单' && m.orderId)))
                                ro = await ReceivableOther.find({_id: {$in: ids}})
                                if (ro && ro.length) {
                                    for (let c = 0; c < ro.length; c++) {
                                        if (!obj.child.find(fc => fc._id === ro[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '其他应收单'}, ro[c]._doc))
                                        }
                                    }
                                }
                            }
                            break
                        case '核销单':
                            if (lastType !== '预收款单') {
                                rr = await ReceivableRefund.find({'order.list': {$elemMatch: {orderId: order._id}}})
                                if (rr && rr.length) {
                                    for (let c = 0; c < rr.length; c++) {
                                        if (!obj.child.find(fc => fc._id === rr[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '预收款单'}, rr[c]._doc))
                                        }
                                    }
                                }
                            }
                            if (lastType !== '预付款单') {
                                par = await PayableRefund.find({'order.list': {$elemMatch: {orderId: order._id}}})
                                if (par && par.length) {
                                    for (let c = 0; c < par.length; c++) {
                                        if (!obj.child.find(fc => fc._id === par[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '预付款单'}, rr[c]._doc))
                                        }
                                    }
                                }
                            }
                            if (lastType !== '其他应收单') {
                                ro = await ReceivableOther.find({'order.payList': {$elemMatch: {orderId: order._id}}})
                                if (ro && ro.length) {
                                    for (let c = 0; c < ro.length; c++) {
                                        if (!obj.child.find(fc => fc._id === ro[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '其他应收单'}, ro[c]._doc))
                                        }
                                    }
                                }
                            }
                            if (lastType !== '其他应付单') {
                                pao = await PayableOther.find({'order.payList': {$elemMatch: {orderId: order._id}}})
                                if (pao && pao.length) {
                                    for (let c = 0; c < pao.length; c++) {
                                        if (!obj.child.find(fc => fc._id === pao[c]._id)) {
                                            obj.child.push(Object.assign({orderType: '其他应付单'}, pao[c]._doc))
                                        }
                                    }
                                }
                            }
                            break
                    }
                }
                await getChild(order, data.type, null)
                obj.child = obj.child.sort((a, b) => {
                    if (moment(a.dateTime).isBefore(b.dateTime)) {
                        return -1
                    } else if (moment(a.dateTime).isAfter(b.dateTime)) {
                        return 1
                    } else {
                        return 0
                    }
                })
                result.push(obj)
            }
            res.status(200).json(result)
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}