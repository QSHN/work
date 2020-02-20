const errors = require('@lib/errors');
const L = require('debug')('app:api');
const pushMsg = require('../message/message.controller').pushMsg;

const SalesOrder = require('./salesOrder.model');

module.exports = {
    updateSalesOrder,
    querySalesOrder,
    batchSalesOrder,
    parameterSalesOrder
};

async function updateSalesOrder(req, res, next) {
    L('Calling API SalesOrder.updateSalesOrder', req.body);

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
                await SalesOrder.updateOne({_id}, { $set: data })
            } else {
                let result = await SalesOrder.findOne({
                    code: data.code
                })
                if (result) {
                    error = '已存在该单据编号'
                } else {
                    await SalesOrder.create(data)
                }
            }
            if (error) {
                next('已存在该单据编号');
            } else {
                let result = await SalesOrder.findOne({
                    code: data.code
                })
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

async function querySalesOrder(req, res, next) {
    L('Calling API SalesOrder.querySalesOrder', req.body);

    try {
        let data = req.body;
        if (!data.filter || !data.filter.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            if (data.isOne) {
                let result = await SalesOrder.findOne(data.filter).sort({createdAt: -1})
                res.status(200).json(result);
            } else {
                if (!data.pageInfo || !data.pageInfo.page || !data.pageInfo.limit) {
                    next(new errors.BadRequest('分页参数必填'));
                } else {
                    let result = await SalesOrder.find(data.filter).sort({createdAt: -1})
                      .limit(parseInt(data.pageInfo.limit))
                      .skip(data.pageInfo.limit * (data.pageInfo.page - 1));
                    let total = await SalesOrder.find(data.filter).countDocuments();
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

async function batchSalesOrder(req, res, next) {
    L('Calling API SalesOrder.batchSalesOrder', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('销售订单Ids必填'));
        } else  if (!data.action) {
            next(new errors.BadRequest('批量操作必填'));
        } else {
            if (data.action === '删除') {
                await SalesOrder.deleteMany({ _id: {$in: data.ids} }, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    }
                })
                res.status(200).end();
            } else {
                await SalesOrder.updateMany({_id: {$in: data.ids}}, { $set: data.action })
                res.status(200).end();
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function parameterSalesOrder(req, res, next) {
    L('Calling API SalesOrder.parameterSalesOrder', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.dateTime) {
            next(new errors.BadRequest('单据日期必填'));
        } else {
            let total = await SalesOrder.find(data).countDocuments();
            res.status(200).json({
                total
            });
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
