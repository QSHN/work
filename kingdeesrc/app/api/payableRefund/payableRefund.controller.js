const errors = require('@lib/errors');
const L = require('debug')('app:api');
const pushMsg = require('../message/message.controller').pushMsg;
const NP = require('number-precision');

const PayableRefund = require('./payableRefund.model');
const PayablePayments = require('../payablePayments/payablePayments.model');

module.exports = {
    updatePayableRefund,
    queryPayableRefund,
    batchPayableRefund,
    parameterPayableRefund
};

async function updatePayableRefund(req, res, next) {
    L('Calling API PayableRefund.updatePayableRefund', req.body);

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
                await PayableRefund.updateOne({_id}, { $set: data })
            } else {
                let result = await PayableRefund.findOne({
                    code: data.code
                })
                if (result) {
                    error = '已存在该单据编号'
                } else {
                    await PayableRefund.create(data)
                }
            }
            if (error) {
                next('已存在该单据编号');
            } else {
                let result = await PayableRefund.findOne({
                    code: data.code
                })
                if (result.order.list.length) {
                    for(let i = 0; i < result.order.list.length; i++) {
                        let order = result.order.list[i]
                        let obj = {
                            orderId: result._id,
                            orderType: '预付退款单',
                            orderCode: result.code,
                            orderRouter: 'payableRefund',
                            orderMoney: order.thisPay
                        }
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

async function queryPayableRefund(req, res, next) {
    L('Calling API PayableRefund.queryPayableRefund', req.body);

    try {
        let data = req.body;
        if (!data.filter || !data.filter.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            if (data.isOne) {
                let result = await PayableRefund.findOne(data.filter).sort({createdAt: -1})
                res.status(200).json(result);
            } else {
                if (!data.pageInfo || !data.pageInfo.page || !data.pageInfo.limit) {
                    next(new errors.BadRequest('分页参数必填'));
                } else {
                    let result = await PayableRefund.find(data.filter).sort({createdAt: -1})
                      .limit(parseInt(data.pageInfo.limit))
                      .skip(data.pageInfo.limit * (data.pageInfo.page - 1));
                    let total = await PayableRefund.find(data.filter).countDocuments();
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

async function batchPayableRefund(req, res, next) {
    L('Calling API PayableRefund.batchPayableRefund', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('预付退款单Ids必填'));
        } else  if (!data.action) {
            next(new errors.BadRequest('批量操作必填'));
        } else {
            if (data.action === '删除') {
                let refund = await PayableRefund.find({ _id: {$in: data.ids} })
                for (let c = 0; c < refund.length; c++) {
                    let result = refund[c]
                    if (result.order.list.length) {
                        for(let i = 0; i < result.order.list.length; i++) {
                            let order = result.order.list[i]
                            let payablePayments = await PayablePayments.findOne({_id: order.orderId})
                            let list = payablePayments.main.payList
                            let index = list.findIndex(f => f.orderId === result._id)
                            list.splice(index, 1)
                            let total = list.reduce((total, v) => (total = NP.plus(total, v.orderMoney)), 0)
                            let status = total === payablePayments.main.total ? '全部核销' : total === 0 ? '未核销' : '部分核销'
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
                    }
                }
                await PayableRefund.deleteMany({ _id: {$in: data.ids} }, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    }
                })
                res.status(200).end();
            } else {
                await PayableRefund.updateMany({_id: {$in: data.ids}}, { $set: data.action })
                res.status(200).end();
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function parameterPayableRefund(req, res, next) {
    L('Calling API PayableRefund.parameterPayableRefund', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.dateTime) {
            next(new errors.BadRequest('单据日期必填'));
        } else {
            let total = await PayableRefund.find(data).countDocuments();
            res.status(200).json({
                total
            });
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
