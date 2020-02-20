const errors = require('@lib/errors');
const L = require('debug')('app:api');
const pushMsg = require('../message/message.controller').pushMsg;
const NP = require('number-precision');
const moment = require('moment');

const PurchaseWarehouse = require('../purchaseWarehouse/purchaseWarehouse.model');
const PurchaseReturn = require('../purchaseReturn/purchaseReturn.model');
const PayableCollection = require('../payableCollection/payableCollection.model');
const PayablePayments = require('../payablePayments/payablePayments.model');
const PayableRefund = require('../payableRefund/payableRefund.model');
const PayableOther = require('../payableOther/payableOther.model');

module.exports = {
    queryPayableReport,
    queryAllPayableReport
};

async function queryPayableReport(req, res, next) {
    L('Calling API payableReport.queryPayableReport', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.supplierId) {
            next(new errors.BadRequest('供应商必填'));
        } else {
            let purchaseWarehouse = await PurchaseWarehouse.find(Object.assign({audit: '已审核'}, data))
            let purchaseReturn = await PurchaseReturn.find(Object.assign({audit: '已审核'}, data))
            let payableCollection = await PayableCollection.find(Object.assign({audit: '已审核'}, data))
            let payablePayments = await PayablePayments.find(Object.assign({audit: '已审核'}, data))
            let payableRefund = await PayableRefund.find(Object.assign({audit: '已审核'}, data))
            let payableOther = await PayableOther.find(Object.assign({audit: '已审核'}, data))
            let list = []
            if (purchaseWarehouse.length) {
                list = list.concat(purchaseWarehouse.map(v => {
                    return{
                        dateTime: v.dateTime,
                        payable: -(v.offsetAdvance || 0),
                        orderPayable: v.orderMoney || 0,
                        otherPayable: 0,
                        totalPayable: v.orderMoney || 0,
                        orderAmount: NP.plus(v.paymentTotal || 0, v.offsetAdvance || 0),
                        otherAmount: 0,
                        totalAmount: NP.plus(v.paymentTotal || 0, v.offsetAdvance || 0),
                        payableBalance: -(v.offsetAdvance || 0),
                        orderBalance: v.unpaid || 0,
                        otherBalance: 0,
                        balance: 0,
                    }
                }))
            }
            if (purchaseReturn.length) {
                list = list.concat(purchaseReturn.map(v => {
                    return{
                        dateTime: v.dateTime,
                        payable: 0,
                        orderPayable: -(v.orderMoney || 0),
                        otherPayable: 0,
                        totalPayable: -(v.orderMoney || 0),
                        orderAmount: -(v.refund || 0),
                        otherAmount: 0,
                        totalAmount: -(v.refund || 0),
                        payableBalance: 0,
                        orderBalance: -(v.unRefund || 0),
                        otherBalance: 0,
                        balance: 0,
                    }
                }))
            }

            if (payableCollection.length) {
                list = list.concat(payableCollection.map(v => {
                    let orderBalance = v.order.list.reduce((total, v) => ( total = NP.plus(total, v.orderType !== 'payableOther' ? v.thisPay || 0 : 0)), 0)
                    let otherBalance = v.order.list.reduce((total, v) => ( total = NP.plus(total, v.orderType === 'payableOther' ? v.thisPay || 0 : 0)), 0)
                    return{
                        dateTime: v.dateTime,
                        payable: 0,
                        orderPayable:0,
                        otherPayable: 0,
                        totalPayable: 0,
                        orderAmount: v.main.total || 0,
                        otherAmount: 0,
                        totalAmount:  v.main.total || 0,
                        payableBalance: 0,
                        orderBalance: -orderBalance,
                        otherBalance: -otherBalance,
                        balance: 0,
                    }
                }))
            }

            if (payablePayments.length) {
                list = list.concat(payablePayments.map(v => {
                    return{
                        dateTime: v.dateTime,
                        payable: v.main.total || 0,
                        orderPayable:0,
                        otherPayable: 0,
                        totalPayable: 0,
                        orderAmount: 0,
                        otherAmount: 0,
                        totalAmount: 0,
                        payableBalance: v.main.total || 0,
                        orderBalance: 0,
                        otherBalance: 0,
                        balance: 0,
                    }
                }))
            }

            if (payableRefund.length) {
                list = list.concat(payableRefund.map(v => {
                    return{
                        dateTime: v.dateTime,
                        payable: -(v.main.total || 0),
                        orderPayable:0,
                        otherPayable: 0,
                        totalPayable: 0,
                        orderAmount: 0,
                        otherAmount: 0,
                        totalAmount: 0,
                        payableBalance: -(v.main.total || 0),
                        orderBalance: 0,
                        otherBalance: 0,
                        balance: 0,
                    }
                }))
            }

            if (payableOther.length) {
                list = list.concat(payableOther.map(v => {
                    return{
                        dateTime: v.dateTime,
                        payable: 0,
                        orderPayable:0,
                        otherPayable: 0,
                        totalPayable: 0,
                        orderAmount: 0,
                        otherAmount: v.orderType === '退款' ? -(v.order.total || 0) : v.order.total || 0,
                        totalAmount: v.orderType === '退款' ? -(v.order.total || 0) : v.order.total || 0,
                        payableBalance: 0,
                        orderBalance: 0,
                        otherBalance: v.orderType === '退款' ? -(v.order.total || 0) : v.order.total || 0,
                        balance: 0,
                    }
                }))
            }
            list = list.sort((a, b) => {
                if (moment(a.dateTime).isBefore(b.dateTime)) {
                    return -1
                } else if (moment(a.dateTime).isAfter(b.dateTime)) {
                    return 1
                } else {
                    return 0
                }
            })
            let payableBalance = 0
            let orderBalance = 0
            let otherBalance = 0
            let balance = 0
            list.forEach((v, i) => {
                v.payableBalance = payableBalance = NP.plus(payableBalance || 0, v.payableBalance || 0)
                v.orderBalance = orderBalance = NP.plus(orderBalance || 0, v.orderBalance || 0)
                v.otherBalance = otherBalance = NP.plus(otherBalance || 0, v.otherBalance || 0)
                v.balance = -NP.minus(NP.minus(v.payableBalance || 0,  v.orderBalance || 0), v.otherBalance || 0)
                if (i === list.length - 1) balance = v.balance
            })
            res.status(200).json({
                balance
            })
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}


async function queryAllPayableReport(req, res, next) {
    L('Calling API payableReport.queryAllPayableReport', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let isOther = data.isOther || false
            let payableOther = []
            let starTime = data.time.length && data.time[0]
            let endTime = data.time.length && data.time[1]
            delete data.time
            if (isOther) {
                delete data.isOther
                payableOther = await PayableOther.find(data)
            }
            let purchaseWarehouse = await PurchaseWarehouse.find(data)
            let purchaseReturn = await PurchaseReturn.find(data)
            let payableCollection = await PayableCollection.find(data)
            let payablePayments = await PayablePayments.find(data)
            let payableRefund = await PayableRefund.find(data)

            let list = []
            let supplierList = []
            if (purchaseWarehouse.length) {
                list = list.concat(purchaseWarehouse.map(v => {
                    if (!supplierList.includes(v.supplierId.toString())) {
                        supplierList.push(v.supplierId.toString())
                    }
                    return{
                        dateTime: v.dateTime,
                        payable: -(v.offsetAdvance || 0),
                        orderPayable: v.orderMoney || 0,
                        otherPayable: 0,
                        totalPayable: v.orderMoney || 0,
                        orderAmount: NP.plus(v.paymentTotal || 0, v.offsetAdvance || 0),
                        otherAmount: 0,
                        totalAmount: NP.plus(v.paymentTotal || 0, v.offsetAdvance || 0),
                        payableBalance: -(v.offsetAdvance || 0),
                        orderBalance: v.unpaid || 0,
                        otherBalance: 0,
                        balance: 0,
                        supplierId: v.supplierId.toString(),
                        orderType: '采购入库单',
                        code: v.code,
                        des: v.des,
                        departmentId: v.departmentId,
                        clerkId: v.clerkId,
                        _id: v._id,
                        routerName: 'purchaseWarehouse'
                    }
                }))
            }
            if (purchaseReturn.length) {
                list = list.concat(purchaseReturn.map(v => {
                    if (!supplierList.includes(v.supplierId.toString())) {
                        supplierList.push(v.supplierId.toString())
                    }
                    return{
                        dateTime: v.dateTime,
                        payable: 0,
                        orderPayable: -(v.orderMoney || 0),
                        otherPayable: 0,
                        totalPayable: -(v.orderMoney || 0),
                        orderAmount: -(v.refund || 0),
                        otherAmount: 0,
                        totalAmount: -(v.refund || 0),
                        payableBalance: 0,
                        orderBalance: -(v.unRefund || 0),
                        otherBalance: 0,
                        balance: 0,
                        supplierId: v.supplierId.toString(),
                        orderType: '采购退货单',
                        code: v.code,
                        des: v.des,
                        departmentId: v.departmentId,
                        clerkId: v.clerkId,
                        _id: v._id,
                        routerName: 'purchaseReturn'
                    }
                }))
            }

            if (payableCollection.length) {
                list = list.concat(payableCollection.map(v => {
                    if (!supplierList.includes(v.supplierId.toString())) {
                        supplierList.push(v.supplierId.toString())
                    }
                    let orderBalance = v.order.list.reduce((total, v) => ( total = NP.plus(total, v.orderType !== 'payableOther' ? v.thisPay || 0 : 0)), 0)
                    let otherBalance = v.order.list.reduce((total, v) => ( total = NP.plus(total, v.orderType === 'payableOther' ? v.thisPay || 0 : 0)), 0)
                    return{
                        dateTime: v.dateTime,
                        payable: 0,
                        orderPayable:0,
                        otherPayable: 0,
                        totalPayable: 0,
                        orderAmount: v.main.total || 0,
                        otherAmount: 0,
                        totalAmount:  v.main.total || 0,
                        payableBalance: 0,
                        orderBalance: -orderBalance,
                        otherBalance: -otherBalance,
                        balance: 0,
                        supplierId: v.supplierId.toString(),
                        orderType: '付款单',
                        code: v.code,
                        des: v.des,
                        departmentId: v.departmentId,
                        clerkId: v.clerkId,
                        _id: v._id,
                        routerName: 'payableCollection'
                    }
                }))
            }

            if (payablePayments.length) {
                list = list.concat(payablePayments.map(v => {
                    if (!supplierList.includes(v.supplierId.toString())) {
                        supplierList.push(v.supplierId.toString())
                    }
                    return{
                        dateTime: v.dateTime,
                        payable: v.main.total || 0,
                        orderPayable:0,
                        otherPayable: 0,
                        totalPayable: 0,
                        orderAmount: 0,
                        otherAmount: 0,
                        totalAmount: 0,
                        payableBalance: v.main.total || 0,
                        orderBalance: 0,
                        otherBalance: 0,
                        balance: 0,
                        supplierId: v.supplierId.toString(),
                        orderType: '预付款单',
                        code: v.code,
                        des: v.des,
                        departmentId: v.departmentId,
                        clerkId: v.clerkId,
                        _id: v._id,
                        routerName: 'payablePayments'
                    }
                }))
            }

            if (payableRefund.length) {
                list = list.concat(payableRefund.map(v => {
                    if (!supplierList.includes(v.supplierId.toString())) {
                        supplierList.push(v.supplierId.toString())
                    }
                    return{
                        dateTime: v.dateTime,
                        payable: -(v.main.total || 0),
                        orderPayable:0,
                        otherPayable: 0,
                        totalPayable: 0,
                        orderAmount: 0,
                        otherAmount: 0,
                        totalAmount: 0,
                        payableBalance: -(v.main.total || 0),
                        orderBalance: 0,
                        otherBalance: 0,
                        balance: 0,
                        supplierId: v.supplierId.toString(),
                        orderType: '预付退款单',
                        code: v.code,
                        des: v.des,
                        departmentId: v.departmentId,
                        clerkId: v.clerkId,
                        _id: v._id,
                        routerName: 'payableRefund'
                    }
                }))
            }

            if (payableOther.length) {
                list = list.concat(payableOther.map(v => {
                    if (!supplierList.includes(v.supplierId.toString())) {
                        supplierList.push(v.supplierId.toString())
                    }
                    return{
                        dateTime: v.dateTime,
                        payable: 0,
                        orderPayable:0,
                        otherPayable: 0,
                        totalPayable: 0,
                        orderAmount: 0,
                        otherAmount: v.orderType === '退款' ? -(v.order.total || 0) : v.order.total || 0,
                        totalAmount: v.orderType === '退款' ? -(v.order.total || 0) : v.order.total || 0,
                        payableBalance: 0,
                        orderBalance: 0,
                        otherBalance: v.orderType === '退款' ? -(v.order.total || 0) : v.order.total || 0,
                        balance: 0,
                        supplierId: v.supplierId.toString(),
                        orderType: '其他应付单',
                        code: v.code,
                        des: v.des,
                        departmentId: v.departmentId,
                        clerkId: v.clerkId,
                        _id: v._id,
                        routerName: 'payableOther'
                    }
                }))
            }
            list = list.sort((a, b) => {
                if (moment(a.dateTime).isBefore(b.dateTime)) {
                    return -1
                } else if (moment(a.dateTime).isAfter(b.dateTime)) {
                    return 1
                } else {
                    return 0
                }
            })
            let result = []
            let totalObj = {
                dateTime: null,
                payable: 0,
                orderPayable:0,
                otherPayable: 0,
                totalPayable: 0,
                orderAmount: 0,
                otherAmount: 0,
                totalAmount: 0,
                payableBalance: 0,
                orderBalance: 0,
                otherBalance:0,
                balance: 0,
                supplierId: null,
                orderType: '合计',
                code: null,
                des: null,
                departmentId: null,
                clerkId: null
            }
            supplierList.forEach(id => {
                let payableBalance = 0
                let orderBalance = 0
                let otherBalance = 0
                let cList = []
                let fList = list.filter(f => f.supplierId.toString() === id.toString())
                let start = {}
                let end = {}
                fList.forEach((v, i) => {
                    v.payableBalance = payableBalance = NP.plus(payableBalance || 0, v.payableBalance || 0)
                    v.orderBalance = orderBalance = NP.plus(orderBalance || 0, v.orderBalance || 0)
                    v.otherBalance = otherBalance = NP.plus(otherBalance || 0, v.otherBalance || 0)
                    v.balance = -NP.minus(NP.minus(v.payableBalance || 0,  v.orderBalance || 0), v.otherBalance || 0)
                    if (starTime && endTime) {
                        if (moment(v.dateTime).isBefore(starTime)) {
                            start = Object.assign({}, v, {
                                dateTime: null,
                                payable: 0,
                                orderPayable:0,
                                otherPayable: 0,
                                totalPayable: 0,
                                orderAmount: 0,
                                otherAmount: 0,
                                totalAmount: 0,
                                orderType: '期初余额',
                                code: null,
                                des: null,
                                departmentId: null,
                                clerkId: null
                            })
                        } else if (moment(v.dateTime).isAfter(starTime) && moment(v.dateTime).isBefore(endTime)) {
                            if (!start.orderType) {
                                start = Object.assign({}, v, {
                                    dateTime: null,
                                    payable: 0,
                                    orderPayable:0,
                                    otherPayable: 0,
                                    totalPayable: 0,
                                    orderAmount: 0,
                                    otherAmount: 0,
                                    totalAmount: 0,
                                    payableBalance: 0,
                                    orderBalance: 0,
                                    otherBalance:0,
                                    balance: 0,
                                    supplierId: null,
                                    orderType: '期初余额',
                                    code: null,
                                    des: null,
                                    departmentId: null,
                                    clerkId: null
                                })
                            }
                            cList.push(Object.assign({}, v))
                            end = Object.assign({}, v, {
                                orderType: '小计',
                                code: null,
                                des: null,
                                departmentId: null,
                                clerkId: null
                            })
                        }
                    } else {
                        if (i === 0) {
                            start = Object.assign({}, v, {
                                orderType: '期初余额',
                                code: null,
                                des: null,
                                departmentId: null,
                                clerkId: null
                            })
                        }
                        if (i === fList.length - 1) {
                            end = Object.assign({}, v, {
                                orderType: '小计',
                                code: null,
                                des: null,
                                departmentId: null,
                                clerkId: null
                            })
                        }
                        cList.push(Object.assign({}, v))
                    }
                })
                cList.unshift(start)
                cList.push(end)
                totalObj.payableBalance = NP.plus(totalObj.payableBalance, end.payableBalance)
                totalObj.orderBalance = NP.plus(totalObj.orderBalance, end.orderBalance)
                totalObj.otherBalance = NP.plus(totalObj.otherBalance, end.otherBalance)
                totalObj.balance = -NP.minus(NP.minus(totalObj.payableBalance, totalObj.orderBalance), totalObj.otherBalance)
                result = result.concat(cList)
            })
            result.push(totalObj)
            res.status(200).json(result)
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
