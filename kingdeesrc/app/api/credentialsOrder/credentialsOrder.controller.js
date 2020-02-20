const errors = require('@lib/errors');
const L = require('debug')('app:api');

const CredentialsOrder = require('./credentialsOrder.model');
const pushMsg = require('../message/message.controller').pushMsg;

module.exports = {
    updateCredentialsOrder,
    queryCredentialsOrder,
    batchCredentialsOrder
};

async function updateCredentialsOrder(req, res, next) {
    L('Calling API CredentialsOrder.updateCredentialsOrder', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.code) {
            next(new errors.BadRequest('编码必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('名称必填'));
        } else if (!data.proofWordId) {
            next(new errors.BadRequest('凭证字必填'));
        } else if (!data.list || !data.list.length) {
            next(new errors.BadRequest('模板内容必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await CredentialsOrder.updateOne({_id}, { $set: data })
            } else {
                let result = await CredentialsOrder.findOne({
                    code: data.code
                })
                if (result) {
                    next(new errors.BadRequest('已存在该单据编号'));
                } else {
                    await CredentialsOrder.create(data)
                }
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function queryCredentialsOrder(req, res, next) {
    L('Calling API CredentialsOrder.queryCredentialsOrder', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await CredentialsOrder.find({
                accountSetId: data.accountSetId
            });
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function batchCredentialsOrder(req, res, next) {
    L('Calling API CredentialsOrder.batchCredentialsOrder', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('业务凭证模板Ids必填'));
        } else  if (!data.action) {
            next(new errors.BadRequest('批量操作必填'));
        } else {
            if (data.action === '删除') {
                await CredentialsOrder.deleteMany({ _id: {$in: data.ids} }, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    }
                })
                res.status(200).end();
            } else if (data.action.includes('默认')) {
                if (data.action === '默认') {
                    let list = await CredentialsOrder.find({_id: {$in: data.ids}})
                    let orderType = Array.from(new Set(list.map(v => v.orderType)))
                    await CredentialsOrder.updateMany({
                        orderType: {$in: orderType },
                        isDefault: true
                    }, { $set: { isDefault: false } })
                }
                await CredentialsOrder.updateMany({_id: {$in: data.ids}}, { $set: { isDefault: data.action === '默认' } })
                res.status(200).end();
            } else {
                await CredentialsOrder.updateMany({_id: {$in: data.ids}}, { $set: { status: data.action === '启用' } })
                res.status(200).end();
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
