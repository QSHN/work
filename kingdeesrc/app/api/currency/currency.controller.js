const errors = require('@lib/errors');
const L = require('debug')('app:api');
const pushMsg = require('../message/message.controller').pushMsg;

const Currency = require('./currency.model');
let isInit = null

module.exports = {
    currencyUpdate,
    currencyQuery,
    batchCurrency
};

async function currencyUpdate(req, res, next) {
    L('Calling API Currency.currencyUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else if (!data.code) {
            next(new errors.BadRequest('币别编码必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('币别名称必填'));
        } else if (!data.rate) {
            next(new errors.BadRequest('记账汇率必填'));
        } else if (!data.convert) {
            next(new errors.BadRequest('折算方式必选'));
        } else if (!data.float) {
            next(new errors.BadRequest('金额小数位数必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await Currency.updateOne({_id}, { $set: data })
            } else {
                await Currency.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function currencyQuery(req, res, next) {
    L('Calling API Currency.currencyQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await Currency.find(data)
            if (isInit !== data.accountSetId && result && result.length === 0) {
                isInit = data.accountSetId
                await Currency.create({
                    accountSetId: data.accountSetId,
                    code: 'RMB',
                    name: '人民币',
                    rate: 1,
                    convert: 'multi',
                    float: 2,
                    status: '启用',
                    isEdit: false
                })
                await Currency.create({
                    accountSetId: data.accountSetId,
                    code: 'AUD',
                    name: '澳元',
                    rate: 6.8737,
                    convert: 'multi',
                    float: 4,
                    status: '启用'
                })
                await Currency.create({
                    accountSetId: data.accountSetId,
                    code: 'CAD',
                    name: '加元',
                    rate: 7.9932,
                    convert: 'multi',
                    float: 4,
                    status: '启用'
                })
                await Currency.create({
                    accountSetId: data.accountSetId,
                    code: 'EUR',
                    name: '欧元',
                    rate: 10.8806,
                    convert: 'multi',
                    float: 4,
                    status: '启用'
                })
                await Currency.create({
                    accountSetId: data.accountSetId,
                    code: 'HKD',
                    name: '港元',
                    rate: 0.96,
                    convert: 'multi',
                    float: 4,
                    status: '启用'
                })
                await Currency.create({
                    accountSetId: data.accountSetId,
                    code: 'JPY',
                    name: '日元',
                    rate: 0.65164,
                    convert: 'multi',
                    float: 4,
                    status: '启用'
                })
                await Currency.create({
                    accountSetId: data.accountSetId,
                    code: 'USD',
                    name: '美元',
                    rate: 7.4577,
                    convert: 'multi',
                    float: 4,
                    status: '启用'
                })

                result = await Currency.find(data).sort({createdAt: -1})
                isInit = null
            }
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function batchCurrency(req, res, next) {
    L('Calling API Currency.batchCurrency', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('币别Ids必填'));
        } else  if (!data.action) {
            next(new errors.BadRequest('批量操作必填'));
        } else {
            if (data.action === '删除') {
                await Currency.deleteMany({ _id: {$in: data.ids} }, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    }
                })
                res.status(200).end();
            } else {
                await Currency.updateMany({_id: {$in: data.ids}}, { $set: { status: data.action } })
                res.status(200).end();
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
