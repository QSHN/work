const errors = require('@lib/errors');
const L = require('debug')('app:api');
const pushMsg = require('../message/message.controller').pushMsg;

const ClearingForm = require('./clearingForm.model');

module.exports = {
    update,
    query,
    clearDelete
};

async function update(req, res, next) {
    L('Calling API ClearingForm.update', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('名称必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await ClearingForm.updateOne({_id}, { $set: data })
            } else {
                await ClearingForm.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function query(req, res, next) {
    L('Calling API ClearingForm.query', req.body);

    try {
        let data = req.body ? Object.assign({}, req.body) : {}
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await ClearingForm.find(data).sort({createdAt: -1})
            if (result && result.length === 0) {
                await ClearingForm.insertMany([
                    {
                        accountSetId: data.accountSetId,
                        name: '现金'
                    },
                    {
                        accountSetId: data.accountSetId,
                        name: '银行结账'
                    },
                    {
                        accountSetId: data.accountSetId,
                        name: '支票'
                    },
                    {
                        accountSetId: data.accountSetId,
                        name: '汇票'
                    },
                    {
                        accountSetId: data.accountSetId,
                        name: '信用卡'
                    },
                    {
                        accountSetId: data.accountSetId,
                        name: '支付宝'
                    },
                    {
                        accountSetId: data.accountSetId,
                        name: '微信'
                    }
                ])
                result = await ClearingForm.find(data).sort({createdAt: -1})
            }
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function clearDelete(req, res, next) {
    L('Calling API ClearingForm.clearDelete', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('结算方式Id必填'));
        } else {
            await ClearingForm.deleteOne({ _id: data.id }, (err) => {
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
