const errors = require('@lib/errors');
const L = require('debug')('app:api');
const pushMsg = require('../message/message.controller').pushMsg;
const NP = require('number-precision');

const ReceivableCollection = require('./receivableCollection.model');
const ReceivableOther = require('../receivableOther/receivableOther.model');
const SalesWarehouse = require('../salesWarehouse/salesWarehouse.model');
const SalesReturn = require('../salesReturn/salesReturn.model');

module.exports = {
    updateReceivableCollection,
    queryReceivableCollection,
    batchReceivableCollection,
    parameterReceivableCollection
};

async function updateReceivableCollection(req, res, next) {
    L('Calling API ReceivableCollection.updateReceivableCollection', req.body);

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
                await ReceivableCollection.updateOne({_id}, { $set: data })
            } else {
                let result = await ReceivableCollection.findOne({
                    code: data.code
                })
                if (result) {
                    error = '已存在该单据编号'
                } else {
                    await ReceivableCollection.create(data)
                }
            }
            if (error) {
                next('已存在该单据编号');
            } else {
                let result = await ReceivableCollection.findOne({
                    code: data.code
                })
                if (result.order.list.length) {
                    for(let i = 0; i < result.order.list.length; i++) {
                        let order = result.order.list[i]
                        let obj = {
                            orderId: result._id,
                            orderType: '收款单',
                            orderCode: result.code,
                            orderRouter: 'receivableCollection',
                            orderMoney: order.thisPay
                        }
                        if (order.orderType === '销售出库单') {
                            let salesWarehouse = await SalesWarehouse.findOne({_id: order.orderId})
                            let list = salesWarehouse.paymentList
                            let index = list.findIndex(f => f.orderId === result._id)
                            if (index >= 0) {
                                list[index] = obj
                            } else {
                                list.push(obj)
                            }
                            let total = list.reduce((total, v) => (total = NP.plus(total, v.orderMoney)), 0)
                            let paymentStatus = total === salesWarehouse.unpaid ? '全部收款' : '部分收款'
                            await SalesWarehouse.updateOne({
                                _id: order.orderId
                            }, {
                                $set: {
                                    paymentList: list,
                                    paymentStatus: paymentStatus,
                                    paid: total
                                }
                            })
                        }
                        if (order.orderType === '销售退货单') {
                            let salesReturn = await SalesReturn.findOne({_id: order.orderId})
                            let list = salesReturn.refundList
                            let index = list.findIndex(f => f.orderId === result._id)
                            if (index >= 0) {
                                list[index] = obj
                            } else {
                                list.push(obj)
                            }
                            let total = list.reduce((total, v) => (total = NP.plus(total, v.orderMoney)), 0)
                            let refundStatus = total === salesReturn.unRefund ? '全部退款' : '部分退款'
                            await SalesReturn.updateOne({
                                _id: order.orderId
                            }, {
                                $set: {
                                    refundList: list,
                                    refundStatus: refundStatus,
                                    refunded: total
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

async function queryReceivableCollection(req, res, next) {
    L('Calling API ReceivableCollection.queryReceivableCollection', req.body);

    try {
        let data = req.body;
        if (!data.filter || !data.filter.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            if (data.isOne) {
                let result = await ReceivableCollection.findOne(data.filter).sort({createdAt: -1})
                res.status(200).json(result);
            } else {
                if (!data.pageInfo || !data.pageInfo.page || !data.pageInfo.limit) {
                    next(new errors.BadRequest('分页参数必填'));
                } else {
                    let result = await ReceivableCollection.find(data.filter).sort({createdAt: -1})
                      .limit(parseInt(data.pageInfo.limit))
                      .skip(data.pageInfo.limit * (data.pageInfo.page - 1));
                    let total = await ReceivableCollection.find(data.filter).countDocuments();
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

async function batchReceivableCollection(req, res, next) {
    L('Calling API ReceivableCollection.batchReceivableCollection', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('收款单Ids必填'));
        } else  if (!data.action) {
            next(new errors.BadRequest('批量操作必填'));
        } else {
            if (data.action === '删除') {
                let collection = await ReceivableCollection.find({ _id: {$in: data.ids} })
                for (let c = 0; c < collection.length; c++) {
                    let result = collection[c]
                    if (result.order.list.length) {
                        for(let i = 0; i < result.order.list.length; i++) {
                            let order = result.order.list[i]
                            if (order.orderType === '销售出库单') {
                                let salesWarehouse = await SalesWarehouse.findOne({_id: order.orderId})
                                let list = salesWarehouse.paymentList
                                let index = list.findIndex(f => f.orderId === result._id)
                                list.splice(index, 1)
                                let total = list.reduce((total, v) => (total = NP.plus(total, v.orderMoney)), 0)
                                let paymentStatus = total === salesWarehouse.unpaid ? '全部收款' : total === 0 ? '未收款' : '部分收款'
                                await SalesWarehouse.updateOne({
                                    _id: order.orderId
                                }, {
                                    $set: {
                                        paymentList: list,
                                        paymentStatus: paymentStatus,
                                        paid: total
                                    }
                                })
                            }
                            if (order.orderType === '销售退货单') {
                                let salesReturn = await SalesReturn.findOne({_id: order.orderId})
                                let list = salesReturn.refundList
                                let index = list.findIndex(f => f.orderId === result._id)
                                list.splice(index, 1)
                                let total = list.reduce((total, v) => (total = NP.plus(total, v.orderMoney)), 0)
                                let refundStatus = total === salesReturn.unRefund ? '全部退款' : total === 0 ? '未退款' : '部分退款'
                                await SalesReturn.updateOne({
                                    _id: order.orderId
                                }, {
                                    $set: {
                                        refundList: list,
                                        refundStatus: refundStatus,
                                        refunded: total
                                    }
                                })
                            }
                            if (order.orderType === '其他应收单') {
                                let receivableOther = await ReceivableOther.findOne({_id: order.orderId})
                                let list = receivableOther.order.payList
                                let index = list.findIndex(f => f.orderId === result._id)
                                list.splice(index, 1)
                                let total = list.reduce((total, v) => (total = NP.plus(total, v.orderMoney)), 0)
                                let status = total === receivableOther.order.total ? '全部核销' : total === 0 ? '未核销' : '部分核销'
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
                }
                await ReceivableCollection.deleteMany({ _id: {$in: data.ids} }, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    }
                })
                res.status(200).end();
            } else {
                await ReceivableCollection.updateMany({_id: {$in: data.ids}}, { $set: data.action })
                res.status(200).end();
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function parameterReceivableCollection(req, res, next) {
    L('Calling API ReceivableCollection.parameterReceivableCollection', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.dateTime) {
            next(new errors.BadRequest('单据日期必填'));
        } else {
            let total = await ReceivableCollection.find(data).countDocuments();
            res.status(200).json({
                total
            });
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
