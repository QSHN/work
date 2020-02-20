const errors = require('@lib/errors');
const L = require('debug')('app:api');
const pushMsg = require('../message/message.controller').pushMsg;

const AutomaticTransfer = require('./automaticTransfer.model');

module.exports = {
    updateTemplate,
    queryTemplate,
};

async function updateTemplate(req, res, next) {
    L('Calling API AccountSet.updateTemplate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('自动转账凭证名字必填'));
        } else if (!data.child.length) {
            next(new errors.BadRequest('自动转账凭证内容不能为空'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await AutomaticTransfer.updateOne({_id}, { $set: data })
            } else {
                await AutomaticTransfer.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function queryTemplate(req, res, next) {
    L('Calling API AccountSet.queryTemplate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await AutomaticTransfer.find({
                accountSetId: data.accountSetId
            })
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
