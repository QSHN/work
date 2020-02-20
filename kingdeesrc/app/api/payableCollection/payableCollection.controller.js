const errors = require('@lib/errors');
const L = require('debug')('app:api');
const pushMsg = require('../message/message.controller').pushMsg;
const NP = require('number-precision');

const PayableCollection = require('./payableCollection.model');
const PayableOther = require('../payableOther/payableOther.model');
const PurchaseWarehouse = require('../purchaseWarehouse/purchaseWarehouse.model');
const PurchaseReturn = require('../purchaseReturn/purchaseReturn.model');

module.exports = {
    updatePayableCollection,
    queryPayableCollection,
    batchPayableCollection,
    parameterPayableCollection
};

async function updatePayableCollection(req, res, next) {
    L('Calling API PayableCollection.updatePayableCollection', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else if (!data.code) {
            next(new errors.BadRequest('单据编号必填'));
        } else if (!data.dateTime) {
            next(new errors.BadRequest('单据日期必填'));
        } else if (!data.supplierId) {
            next(new errors.BadRequest('供应商必填'));
        } else {
            let error = ''
            if (data._id) {
                let _id = data._id
                delete data._id
                await PayableCollection.updateOne({_id}, { $set: data })
            } else {
                let result = await PayableCollection.findOne({
                    code: data.code
                })
                if (result) {
                    error = '已存在该单据编号'
                } else {
                    await PayableCollection.create(data)
                }
            }
            if (error) {
                next('已存在该单据编号');
            } else {
                let result = await PayableCollection.findOne({
                    code: data.code
                })
                if (result.order.list.length) {
                    for(let i = 0; i < result.order.list.length; i++) {
                        let order = result.order.list[i]
                        let obj = {
                            orderId: result._id,
                            orderType: '付款单',
                            orderCode: result.code,
                            orderRouter: 'payableCollection',
                            orderMoney: order.thisPay
                        }
                        if (order.orderType === '采购入库单') {
                            let purchaseWarehouse = await PurchaseWarehouse.findOne({_id: order.orderId})
                            let list = purchaseWarehouse.paymentList
                            let index = list.findIndex(f => f.orderId === result._id)
                            if (index >= 0) {
                                list[index] = obj
                            } else {
                                list.push(obj)
                            }
                            let total = list.reduce((total, v) => (total = NP.plus(total, v.orderMoney)), 0)
                            let paymentStatus = total === purchaseWarehouse.unpaid ? '全部付款' : '部分付款'
                            await PurchaseWarehouse.updateOne({
                                _id: order.orderId
                            }, {
                                $set: {
                                    paymentList: list,
                                    paymentStatus: paymentStatus,
                                    paid: total
                                }
                            })
                        }
                        if (order.orderType === '采购退货单') {
                            let purchaseReturn = await PurchaseReturn.findOne({_id: order.orderId})
                            let list = purchaseReturn.refundList
                            let index = list.findIndex(f => f.orderId === result._id)
                            if (index >= 0) {
                                list[index] = obj
                            } else {
                                list.push(obj)
                            }
                            let total = list.reduce((total, v) => (total = NP.plus(total, v.orderMoney)), 0)
                            let refundStatus = total === purchaseReturn.unRefund ? '全部退款' : '部分退款'
                            await PurchaseReturn.updateOne({
                                _id: order.orderId
                            }, {
                                $set: {
                                    refundList: list,
                                    refundStatus: refundStatus,
                                    refunded: total
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

async function queryPayableCollection(req, res, next) {
    L('Calling API PayableCollection.queryPayableCollection', req.body);

    try {
        let data = req.body;
        if (!data.filter || !data.filter.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            if (data.isOne) {
                let result = await PayableCollection.findOne(data.filter).sort({createdAt: -1})
                res.status(200).json(result);
            } else {
                if (!data.pageInfo || !data.pageInfo.page || !data.pageInfo.limit) {
                    next(new errors.BadRequest('分页参数必填'));
                } else {
                    let result = await PayableCollection.find(data.filter).sort({createdAt: -1})
                      .limit(parseInt(data.pageInfo.limit))
                      .skip(data.pageInfo.limit * (data.pageInfo.page - 1));
                    let total = await PayableCollection.find(data.filter).countDocuments();
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

async function batchPayableCollection(req, res, next) {
    L('Calling API PayableCollection.batchPayableCollection', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('付款单Ids必填'));
        } else  if (!data.action) {
            next(new errors.BadRequest('批量操作必填'));
        } else {
            if (data.action === '删除') {
                let collection = await PayableCollection.find({ _id: {$in: data.ids} })
                for (let c = 0; c < collection.length; c++) {
                    let result = collection[c]
                    if (result.order.list.length) {
                        for(let i = 0; i < result.order.list.length; i++) {
                            let order = result.order.list[i]
                            if (order.orderType === '采购入库单') {
                                let purchaseWarehouse = await PurchaseWarehouse.findOne({_id: order.orderId})
                                let list = purchaseWarehouse.paymentList
                                let index = list.findIndex(f => f.orderId === result._id)
                                list.splice(index, 1)
                                let total = list.reduce((total, v) => (total = NP.plus(total, v.orderMoney)), 0)
                                let paymentStatus = total === purchaseWarehouse.unpaid ? '全部付款' : total === 0 ? '未付款' : '部分付款'
                                await PurchaseWarehouse.updateOne({
                                    _id: order.orderId
                                }, {
                                    $set: {
                                        paymentList: list,
                                        paymentStatus: paymentStatus,
                                        paid: total
                                    }
                                })
                            }
                            if (order.orderType === '采购退货单') {
                                let purchaseReturn = await PurchaseReturn.findOne({_id: order.orderId})
                                let list = purchaseReturn.refundList
                                let index = list.findIndex(f => f.orderId === result._id)
                                list.splice(index, 1)
                                let total = list.reduce((total, v) => (total = NP.plus(total, v.orderMoney)), 0)
                                let refundStatus = total === purchaseReturn.unRefund ? '全部退款' : total === 0 ? '未退款' : '部分退款'
                                await PurchaseReturn.updateOne({
                                    _id: order.orderId
                                }, {
                                    $set: {
                                        refundList: list,
                                        refundStatus: refundStatus,
                                        refunded: total
                                    }
                                })
                            }
                            if (order.orderType === '其他应付单') {
                                let payableOther = await PayableOther.findOne({_id: order.orderId})
                                let list = payableOther.order.payList
                                let index = list.findIndex(f => f.orderId === result._id)
                                list.splice(index, 1)
                                let total = list.reduce((total, v) => (total = NP.plus(total, v.orderMoney)), 0)
                                let status = total === payableOther.order.total ? '全部核销' : total === 0 ? '未核销' : '部分核销'
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
                await PayableCollection.deleteMany({ _id: {$in: data.ids} }, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    }
                })
                res.status(200).end();
            } else {
                await PayableCollection.updateMany({_id: {$in: data.ids}}, { $set: data.action })
                res.status(200).end();
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function parameterPayableCollection(req, res, next) {
    L('Calling API PayableCollection.parameterPayableCollection', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.dateTime) {
            next(new errors.BadRequest('单据日期必填'));
        } else {
            let total = await PayableCollection.find(data).countDocuments();
            res.status(200).json({
                total
            });
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
