const errors = require('@lib/errors');
const L = require('debug')('app:api');
const pushMsg = require('../message/message.controller').pushMsg;
const NP = require('number-precision');

const ReceivableVerification = require('./receivableVerification.model');
const ReceivablePayments = require('../receivablePayments/receivablePayments.model');
const ReceivableOther = require('../receivableOther/receivableOther.model');
const PayablePayments = require('../payablePayments/payablePayments.model');
const PayableOther = require('../payableOther/payableOther.model');
module.exports = {
    updateReceivableVerification,
    queryReceivableVerification,
    batchReceivableVerification,
    parameterReceivableVerification
};

async function updateReceivableVerification(req, res, next) {
    L('Calling API ReceivableVerification.updateReceivableVerification', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else if (!data.code) {
            next(new errors.BadRequest('单据编号必填'));
        } else if (!data.dateTime) {
            next(new errors.BadRequest('单据日期必填'));
        } else if (!data.customerId) {
            next(new errors.BadRequest('客户必填'));
        } else {
            let error = ''
            if (data._id) {
                let _id = data._id
                delete data._id
                await ReceivableVerification.updateOne({_id}, { $set: data })
            } else {
                let result = await ReceivableVerification.findOne({
                    code: data.code
                })
                if (result) {
                    error = '已存在该单据编号'
                } else {
                    await ReceivableVerification.create(data)
                }
            }
            if (error) {
                next('已存在该单据编号');
            } else {
                let result = await ReceivableVerification.findOne({
                    code: data.code
                })
                if (result.main.list.length) {
                    for(let i = 0; i < result.main.list.length; i++) {
                        let order = result.main.list[i]
                        let obj = {
                            orderId: result._id,
                            orderType: '核销单',
                            orderCode: result.code,
                            orderRouter: 'receivableVerification',
                            orderMoney: order.thisPay
                        }
                        if (order.orderType === '预收款单') {
                            let receivablePayments = await ReceivablePayments.findOne({_id: order.orderId})
                            let list = receivablePayments.main.payList
                            let index = list.findIndex(f => f.orderId === result._id)
                            if (index >= 0) {
                                list[index] = obj
                            } else {
                                list.push(obj)
                            }
                            let total = list.reduce((total, v) => (total = NP.plus(total, v.orderMoney)), 0)
                            let status = total === receivablePayments.main.total ? '全部核销' : '部分核销'
                            await ReceivablePayments.updateOne({
                                _id: order.orderId
                            }, {
                                $set: {
                                    'main.payList': list,
                                    'main.payTotal': total,
                                    status: status
                                }
                            })
                        }
                        if (order.orderType === '预付款单') {
                            let payablePayments = await PayablePayments.findOne({_id: order.orderId})
                            let list = payablePayments.main.payList
                            let index = list.findIndex(f => f.orderId === result._id)
                            if (index >= 0) {
                                list[index] = obj
                            } else {
                                list.push(obj)
                            }
                            let total = list.reduce((total, v) => (total = NP.plus(total, v.orderMoney)), 0)
                            let status = total === payablePayments.main.total ? '全部核销' : '部分核销'
                            await PayablePayments.updateOne({
                                _id: order.orderId
                            }, {
                                $set: {
                                    'main.payList': list,
                                    'main.payTotal': total,
                                    status: status
                                }
                            })
                        }
                        if (order.orderType === '其他应收单') {
                            let receivableOther = await ReceivableOther.findOne({_id: order.orderId})
                            let list = receivableOther.order.payList
                            let index = list.findIndex(f => f.orderId === result._id)
                            if (index >= 0) {
                                list[index] = obj
                            } else {
                                list.push(obj)
                            }
                            let total = list.reduce((total, v) => (total = NP.plus(total, v.orderMoney)), 0)
                            let status = total === receivableOther.order.total ? '全部核销' : '部分核销'
                            await ReceivableOther.updateOne({
                                _id: order.orderId
                            }, {
                                $set: {
                                    'order.payList': list,
                                    'order.payTotal': total,
                                    status: status
                                }
                            })
                        }
                    }
                }
                if (result.blunt.list.length) {
                    for(let i = 0; i < result.blunt.list.length; i++) {
                        let order = result.blunt.list[i]
                        let obj = {
                            orderId: result._id,
                            orderType: '核销单',
                            orderCode: result.code,
                            orderRouter: 'receivableVerification',
                            orderMoney: order.thisPay
                        }
                        if (order.orderType === '其他应收单') {
                            let receivableOther = await ReceivableOther.findOne({_id: order.orderId})
                            let list = receivableOther.order.payList
                            let index = list.findIndex(f => f.orderId === result._id)
                            if (index >= 0) {
                                list[index] = obj
                            } else {
                                list.push(obj)
                            }
                            let total = list.reduce((total, v) => (total = NP.plus(total, v.orderMoney)), 0)
                            let status = total === receivableOther.order.total ? '全部核销' : '部分核销'
                            await ReceivableOther.updateOne({
                                _id: order.orderId
                            }, {
                                $set: {
                                    'order.payList': list,
                                    'order.payTotal': total,
                                    status: status
                                }
                            })
                        }
                        if (order.orderType === '其他应付单') {
                            let payableOther = await PayableOther.findOne({_id: order.orderId})
                            let list = payableOther.order.payList
                            let index = list.findIndex(f => f.orderId === result._id)
                            if (index >= 0) {
                                list[index] = obj
                            } else {
                                list.push(obj)
                            }
                            let total = list.reduce((total, v) => (total = NP.plus(total, v.orderMoney)), 0)
                            let status = total === payableOther.order.total ? '全部核销' : '部分核销'
                            await PayableOther.updateOne({
                                _id: order.orderId
                            }, {
                                $set: {
                                    'order.payList': list,
                                    'order.payTotal': total,
                                    status: status
                                }
                            })
                        }
                    }
                }
                res.status(200).json({
                    result
                });
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function queryReceivableVerification(req, res, next) {
    L('Calling API ReceivableVerification.queryReceivableVerification', req.body);

    try {
        let data = req.body;
        if (!data.filter || !data.filter.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            if (data.isOne) {
                let result = await ReceivableVerification.findOne(data.filter).sort({createdAt: -1})
                res.status(200).json(result);
            } else {
                if (!data.pageInfo || !data.pageInfo.page || !data.pageInfo.limit) {
                    next(new errors.BadRequest('分页参数必填'));
                } else {
                    let result = await ReceivableVerification.find(data.filter).sort({createdAt: -1})
                      .limit(parseInt(data.pageInfo.limit))
                      .skip(data.pageInfo.limit * (data.pageInfo.page - 1));
                    let total = await ReceivableVerification.find(data.filter).countDocuments();
                    res.status(200).json({
                        total,
                        list: result
                    });
                }
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function batchReceivableVerification(req, res, next) {
    L('Calling API ReceivableVerification.batchReceivableVerification', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('核销单Ids必填'));
        } else  if (!data.action) {
            next(new errors.BadRequest('批量操作必填'));
        } else {
            if (data.action === '删除') {
                let verification = await ReceivableVerification.find({ _id: {$in: data.ids} })
                for (let c = 0; c < verification.length; c++) {
                    let result = verification[c]
                    if (result.main.list.length) {
                        for(let i = 0; i < result.main.list.length; i++) {
                            let order = result.main.list[i]
                            if (order.orderType === '预收款单') {
                                let receivablePayments = await ReceivablePayments.findOne({_id: order.orderId})
                                let list = receivablePayments.main.payList
                                let index = list.findIndex(f => f.orderId === result._id)
                                list.splice(index, 1)
                                let total = list.reduce((total, v) => (total = NP.plus(total, v.orderMoney)), 0)
                                let status = total === receivablePayments.main.total ? '全部核销' : '部分核销'
                                await ReceivablePayments.updateOne({
                                    _id: order.orderId
                                }, {
                                    $set: {
                                        'main.payList': list,
                                        'main.payTotal': total,
                                        status: status
                                    }
                                })
                            }
                            if (order.orderType === '预付款单') {
                                let payablePayments = await PayablePayments.findOne({_id: order.orderId})
                                let list = payablePayments.main.payList
                                let index = list.findIndex(f => f.orderId === result._id)
                                list.splice(index, 1)
                                let total = list.reduce((total, v) => (total = NP.plus(total, v.orderMoney)), 0)
                                let status = total === payablePayments.main.total ? '全部核销' : '部分核销'
                                await PayablePayments.updateOne({
                                    _id: order.orderId
                                }, {
                                    $set: {
                                        'main.payList': list,
                                        'main.payTotal': total,
                                        status: status
                                    }
                                })
                            }
                            if (order.orderType === '其他应收单') {
                                let receivableOther = await ReceivableOther.findOne({_id: order.orderId})
                                let list = receivableOther.order.payList
                                let index = list.findIndex(f => f.orderId === result._id)
                                list.splice(index, 1)
                                let total = list.reduce((total, v) => (total = NP.plus(total, v.orderMoney)), 0)
                                let status = total === receivableOther.order.total ? '全部核销' : '部分核销'
                                await ReceivableOther.updateOne({
                                    _id: order.orderId
                                }, {
                                    $set: {
                                        'order.payList': list,
                                        'order.payTotal': total,
                                        status: status
                                    }
                                })
                            }
                        }
                    }
                    if (result.blunt.list.length) {
                        for(let i = 0; i < result.blunt.list.length; i++) {
                            let order = result.blunt.list[i]
                            if (order.orderType === '其他应收单') {
                                let receivableOther = await ReceivableOther.findOne({_id: order.orderId})
                                let list = receivableOther.order.payList
                                let index = list.findIndex(f => f.orderId === result._id)
                                list.splice(index, 1)
                                let total = list.reduce((total, v) => (total = NP.plus(total, v.orderMoney)), 0)
                                let status = total === receivableOther.order.total ? '全部核销' : '部分核销'
                                await ReceivableOther.updateOne({
                                    _id: order.orderId
                                }, {
                                    $set: {
                                        'order.payList': list,
                                        'order.payTotal': total,
                                        status: status
                                    }
                                })
                            }
                            if (order.orderType === '其他应付单') {
                                let payableOther = await PayableOther.findOne({_id: order.orderId})
                                let list = payableOther.order.payList
                                let index = list.findIndex(f => f.orderId === result._id)
                                list.splice(index, 1)
                                let total = list.reduce((total, v) => (total = NP.plus(total, v.orderMoney)), 0)
                                let status = total === payableOther.order.total ? '全部核销' : '部分核销'
                                await PayableOther.updateOne({
                                    _id: order.orderId
                                }, {
                                    $set: {
                                        'order.payList': list,
                                        'order.payTotal': total,
                                        status: status
                                    }
                                })
                            }
                        }
                    }
                }
                await ReceivableVerification.deleteMany({ _id: {$in: data.ids} }, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    }
                })
                res.status(200).end();
            } else {
                await ReceivableVerification.updateMany({_id: {$in: data.ids}}, { $set: data.action })
                res.status(200).end();
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function parameterReceivableVerification(req, res, next) {
    L('Calling API ReceivableVerification.parameterReceivableVerification', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.dateTime) {
            next(new errors.BadRequest('单据日期必填'));
        } else {
            let total = await ReceivableVerification.find(data).countDocuments();
            res.status(200).json({
                total
            });
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
