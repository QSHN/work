const errors = require('@lib/errors');
const L = require('debug')('app:api');

const Cost = require('./cost.model');
const pushMsg = require('../message/message.controller').pushMsg;

module.exports = {
    costUpdate,
    costQuery,
    costDelete
};

async function costUpdate(req, res, next) {
    L('Calling API Cost.costUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.code) {
            next(new errors.BadRequest('编码必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('名称必填'));
        } else if (!data.costType) {
            next(new errors.BadRequest('费用类型必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await Cost.updateOne({_id}, { $set: data })
            } else {
                await Cost.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function costQuery(req, res, next) {
    L('Calling API Cost.costQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await Cost.find({
                accountSetId: data.accountSetId
            });
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function costDelete(req, res, next) {
    L('Calling API Cost.costDelete', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('费用Id必填'));
        } else {
            await Cost.deleteOne({ _id: data.id }, (err) => {
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
