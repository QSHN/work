const errors = require('@lib/errors');
const L = require('debug')('app:api');

const CredentialsTemplate = require('./credentialsTemplate.model');
const pushMsg = require('../message/message.controller').pushMsg;

module.exports = {
    credentialsTemplateUpdate,
    credentialsTemplateQuery,
    credentialsTemplateDelete
};

async function credentialsTemplateUpdate(req, res, next) {
    L('Calling API CredentialsTemplate.credentialsTemplateUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('模式凭证名字必填'));
        } else if (!data.child.length) {
            next(new errors.BadRequest('模式凭证录入数据不能为空'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await CredentialsTemplate.updateOne({_id}, { $set: data })
            } else {
                await CredentialsTemplate.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function credentialsTemplateQuery(req, res, next) {
    L('Calling API CredentialsTemplate.credentialsTemplateQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await CredentialsTemplate.find({
                accountSetId: data.accountSetId
            })
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function credentialsTemplateDelete(req, res, next) {
    L('Calling API CredentialsTemplate.credentialsTemplateDelete', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('模式凭证Id必填'));
        } else {
            await CredentialsTemplate.deleteOne({ _id: data.id }, (err) => {
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
