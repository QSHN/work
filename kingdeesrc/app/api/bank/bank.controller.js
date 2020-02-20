const errors = require('@lib/errors');
const L = require('debug')('app:api');
const pushMsg = require('../message/message.controller').pushMsg;

const Bank = require('./bank.model');

module.exports = {
    update,
    query,
    deleteBank
};

async function update(req, res, next) {
    L('Calling API Bank.update', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else if (!data.linkNumber) {
            next(new errors.BadRequest('联行号必填'));
        } else if (!data.bankDeposit) {
            next(new errors.BadRequest('开户行必填'));
        } else if (!data.status) {
            next(new errors.BadRequest('使用状态'));
        } else {
            let result;
            if (data._id) {
                let _id = data._id
                delete data._id
                await Bank.updateOne({_id}, { $set: data })
            } else {
                await Bank.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function query(req, res, next) {
    L('Calling API Bank.query', req.body);

    try {
        let filter = req.body ? Object.assign({}, req.body) : {}
        let result = await Bank.find(filter).sort({createdAt: -1})
        res.status(200).json(result);
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function deleteBank(req, res, next) {
    L('Calling API Bank.deleteBank', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('银行Id必填'));
        } else {
            await Bank.deleteOne({ _id: data.id }, (err) => {
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
