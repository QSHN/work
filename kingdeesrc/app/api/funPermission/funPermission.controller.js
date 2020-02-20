const errors = require('@lib/errors');
const L = require('debug')('app:api');

const FunPermission = require('./funPermission.model');
const pushMsg = require('../message/message.controller').pushMsg;

module.exports = {
    funPermissionUpdate,
    funPermissionQuery
};

async function funPermissionUpdate(req, res, next) {
    L('Calling API FunPermission.funPermissionUpdate', req.body);

    try {
        let data = req.body;
        if (!data.companyId) {
            next(new errors.BadRequest('公司id必填'));
        } else if (!data.permission) {
            next(new errors.BadRequest('权限必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await FunPermission.updateOne({_id}, { $set: data })
            } else {
                await FunPermission.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function funPermissionQuery(req, res, next) {
    L('Calling API FunPermission.funPermissionQuery', req.body);

    try {
        let data = req.body;
        if (!data.companyId) {
            next(new errors.BadRequest('公司id必填'));
        } else {
            let result = await FunPermission.findOne({
                companyId: data.companyId
            });
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
