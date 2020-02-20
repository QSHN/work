const errors = require('@lib/errors');
const L = require('debug')('app:api');

const ExchangeRate = require('./exchangeRate.model');
const ExchangeRateType = require('./exchangeRateType.model');
const pushMsg = require('../message/message.controller').pushMsg;
let isInit = null

module.exports = {
    rateUpdate,
    rateQuery,
    rateDelete,
    typeUpdate,
    typeQuery,
    typeDelete
};

/***************** 汇率体系 ***********************/
async function rateUpdate(req, res, next) {
    L('Calling API ExchangeRate.rateUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.typeId) {
            next(new errors.BadRequest('汇率类型必选'));
        } else if (!data.currencyId) {
            next(new errors.BadRequest('币别必选'));
        } else if (!data.rate) {
            next(new errors.BadRequest('汇率必填'));
        } else if (!data.effectiveDate) {
            next(new errors.BadRequest('生效日期必填'));
        } else if (!data.expiryDate) {
            next(new errors.BadRequest('失效日期必填'));
        } else if (!data.status) {
            next(new errors.BadRequest('汇率状态必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await ExchangeRate.updateOne({_id}, { $set: data })
            } else {
                await ExchangeRate.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function rateQuery(req, res, next) {
    L('Calling API ExchangeRate.rateQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await ExchangeRate.find({
                accountSetId: data.accountSetId
            });
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function rateDelete(req, res, next) {
    L('Calling API ExchangeRate.rateDelete', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('汇率Id必填'));
        } else {
            await ExchangeRate.deleteOne({ _id: data.id }, (err) => {
                if (err) {
                    next(new errors.BadRequest(err));
                } else {
                    res.status(200).end();
                }
            })
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

/***************** 汇率类型 ***********************/
async function typeUpdate(req, res, next) {
    L('Calling API ExchangeRate.typeUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.code) {
            next(new errors.BadRequest('编码必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('名称必填'));
        } else if (!data.rate) {
            next(new errors.BadRequest('汇率精度必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await ExchangeRateType.updateOne({_id}, { $set: data })
            } else {
                await ExchangeRateType.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function typeQuery(req, res, next) {
    L('Calling API ExchangeRate.typeQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await ExchangeRateType.find(data);
            if (isInit !== data.accountSetId && result && result.length === 0) {
                isInit = data.accountSetId
                await ExchangeRateType.create({
                    accountSetId: data.accountSetId,
                    code: '01',
                    name: '公司汇率',
                    rate: 6
                })
                await ExchangeRateType.create({
                    accountSetId: data.accountSetId,
                    code: '02',
                    name: '买入汇率',
                    rate: 10
                })
                await ExchangeRateType.create({
                    accountSetId: data.accountSetId,
                    code: '03',
                    name: '卖出汇率',
                    rate: 10
                })
                await ExchangeRateType.create({
                    accountSetId: data.accountSetId,
                    code: '04',
                    name: '预算汇率',
                    rate: 6
                })
                result = await ExchangeRateType.find(data);
                isInit = null
            }
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function typeDelete(req, res, next) {
    L('Calling API ExchangeRate.typeDelete', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('汇率类型Id必填'));
        } else {
            await ExchangeRateType.deleteOne({ _id: data.id }, (err) => {
                if (err) {
                    next(new errors.BadRequest(err));
                } else {
                    res.status(200).end();
                }
            })
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
