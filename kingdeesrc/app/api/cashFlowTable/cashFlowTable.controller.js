const errors = require('@lib/errors');
const L = require('debug')('app:api');

const CashFlowTable = require('./cashFlowTable.model');
const pushMsg = require('../message/message.controller').pushMsg;

module.exports = {
    cashUpdate,
    cashQuery
};

async function cashUpdate(req, res, next) {
    L('Calling API CashFlowTable.cashUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.table) {
            next(new errors.BadRequest('现金流量表必填'));
        } else {
            await CashFlowTable.updateOne({
                accountSetId: data.accountSetId
            }, {$set: {table: data.table}})
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function cashQuery(req, res, next) {
    L('Calling API CashFlowTable.cashQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await CashFlowTable.findOne({
                accountSetId: data.accountSetId
            });
            if (!result) {
                await CashFlowTable.create({
                    accountSetId: data.accountSetId
                })
                result = await CashFlowTable.findOne({
                    accountSetId: data.accountSetId
                });
            }
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
