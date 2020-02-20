const errors = require('@lib/errors');
const L = require('debug')('app:api');
const pushMsg = require('../message/message.controller').pushMsg;
const NP = require('number-precision');
const moment = require('moment');

const SalesWarehouse = require('../salesWarehouse/salesWarehouse.model');
const SalesReturn = require('../salesReturn/salesReturn.model');
const ReceivableCollection = require('../receivableCollection/receivableCollection.model');
const ReceivablePayments = require('../receivablePayments/receivablePayments.model');
const ReceivableRefund = require('../receivableRefund/receivableRefund.model');
const ReceivableOther = require('../receivableOther/receivableOther.model');

module.exports = {
    queryReceivableReport,
    queryAllReceivableReport
};

async function queryReceivableReport(req, res, next) {
    L('Calling API receivableReport.queryReceivableReport', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.customerId) {
            next(new errors.BadRequest('客户必填'));
        } else {
            let salesWarehouse = await SalesWarehouse.find(Object.assign({audit: '已审核'}, data))
            let salesReturn = await SalesReturn.find(Object.assign({audit: '已审核'}, data))
            let receivableCollection = await ReceivableCollection.find(Object.assign({audit: '已审核'}, data))
            let receivablePayments = await ReceivablePayments.find(Object.assign({audit: '已审核'}, data))
            let receivableRefund = await ReceivableRefund.find(Object.assign({audit: '已审核'}, data))
            let receivableOther = await ReceivableOther.find(Object.assign({audit: '已审核'}, data))
            let list = []
            if (salesWarehouse.length) {
                list = list.concat(salesWarehouse.map(v => {
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
            if (salesReturn.length) {
                list = list.concat(salesReturn.map(v => {
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

            if (receivableCollection.length) {
                list = list.concat(receivableCollection.map(v => {
                    let orderBalance = v.order.list.reduce((total, v) => ( total = NP.plus(total, v.orderType !== 'receivableOther' ? v.thisPay || 0 : 0)), 0)
                    let otherBalance = v.order.list.reduce((total, v) => ( total = NP.plus(total, v.orderType === 'receivableOther' ? v.thisPay || 0 : 0)), 0)
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

            if (receivablePayments.length) {
                list = list.concat(receivablePayments.map(v => {
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

            if (receivableRefund.length) {
                list = list.concat(receivableRefund.map(v => {
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

            if (receivableOther.length) {
                list = list.concat(receivableOther.map(v => {
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

async function queryAllReceivableReport(req, res, next) {
    L('Calling API receivableReport.queryAllReceivableReport', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let isOther = data.isOther || false
            let receivableOther = []
            let starTime = data.time.length && data.time[0]
            let endTime = data.time.length && data.time[1]
            delete data.time
            if (isOther) {
                delete data.isOther
                receivableOther = await ReceivableOther.find(data)
            }
            let salesWarehouse = await SalesWarehouse.find(data)
            let salesReturn = await SalesReturn.find(data)
            let receivableCollection = await ReceivableCollection.find(data)
            let receivablePayments = await ReceivablePayments.find(data)
            let receivableRefund = await ReceivableRefund.find(data)

            let list = []
            let customerList = []
            if (salesWarehouse.length) {
                list = list.concat(salesWarehouse.map(v => {
                    if (!customerList.includes(v.customerId.toString())) {
                        customerList.push(v.customerId.toString())
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
                        customerId: v.customerId.toString(),
                        orderType: '销售出库单',
                        code: v.code,
                        des: v.des,
                        departmentId: v.departmentId,
                        clerkId: v.clerkId,
                        _id: v._id,
                        routerName: 'salesWarehouse'
                    }
                }))
            }
            if (salesReturn.length) {
                list = list.concat(salesReturn.map(v => {
                    if (!customerList.includes(v.customerId.toString())) {
                        customerList.push(v.customerId.toString())
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
                        customerId: v.customerId.toString(),
                        orderType: '销售退货单',
                        code: v.code,
                        des: v.des,
                        departmentId: v.departmentId,
                        clerkId: v.clerkId,
                        _id: v._id,
                        routerName: 'salesReturn'
                    }
                }))
            }

            if (receivableCollection.length) {
                list = list.concat(receivableCollection.map(v => {
                    if (!customerList.includes(v.customerId.toString())) {
                        customerList.push(v.customerId.toString())
                    }
                    let orderBalance = v.order.list.reduce((total, v) => ( total = NP.plus(total, v.orderType !== 'receivableOther' ? v.thisPay || 0 : 0)), 0)
                    let otherBalance = v.order.list.reduce((total, v) => ( total = NP.plus(total, v.orderType === 'receivableOther' ? v.thisPay || 0 : 0)), 0)
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
                        customerId: v.customerId.toString(),
                        orderType: '收款单',
                        code: v.code,
                        des: v.des,
                        departmentId: v.departmentId,
                        clerkId: v.clerkId,
                        _id: v._id,
                        routerName: 'receivableCollection'
                    }
                }))
            }

            if (receivablePayments.length) {
                list = list.concat(receivablePayments.map(v => {
                    if (!customerList.includes(v.customerId.toString())) {
                        customerList.push(v.customerId.toString())
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
                        customerId: v.customerId.toString(),
                        orderType: '预收款单',
                        code: v.code,
                        des: v.des,
                        departmentId: v.departmentId,
                        clerkId: v.clerkId,
                        _id: v._id,
                        routerName: 'receivablePayments'
                    }
                }))
            }

            if (receivableRefund.length) {
                list = list.concat(receivableRefund.map(v => {
                    if (!customerList.includes(v.customerId.toString())) {
                        customerList.push(v.customerId.toString())
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
                        customerId: v.customerId.toString(),
                        orderType: '预收退款单',
                        code: v.code,
                        des: v.des,
                        departmentId: v.departmentId,
                        clerkId: v.clerkId,
                        _id: v._id,
                        routerName: 'receivableRefund'
                    }
                }))
            }

            if (receivableOther.length) {
                list = list.concat(receivableOther.map(v => {
                    if (!customerList.includes(v.customerId.toString())) {
                        customerList.push(v.customerId.toString())
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
                        customerId: v.customerId.toString(),
                        orderType: '其他应收单',
                        code: v.code,
                        des: v.des,
                        departmentId: v.departmentId,
                        clerkId: v.clerkId,
                        _id: v._id,
                        routerName: 'receivableOther'
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
                customerId: null,
                orderType: '合计',
                code: null,
                des: null,
                departmentId: null,
                clerkId: null
            }
            customerList.forEach(id => {
                let payableBalance = 0
                let orderBalance = 0
                let otherBalance = 0
                let cList = []
                let fList = list.filter(f => f.customerId.toString() === id.toString())
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
                                    customerId: null,
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