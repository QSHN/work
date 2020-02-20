const errors = require('@lib/errors');
const L = require('debug')('app:api');

const FunPermission = require('./funPermission.model');

module.exports = {
    funPermissionUpdate,
    funPermissionQuery
};

async function funPermissionUpdate(req, res, next) {
    L('Calling API FunPermission.funPermissionUpdate', req.body);

    try {
        let data = req.body;
        if (!data.bClientId) {
            next(new errors.BadRequest('后台客户id必填'));
        } else if (!data.permission) {
            next(new errors.BadRequest('权限必填'));
        } else {
            let fData = await FunPermission.findOne({bClientId: data.bClientId})
            if (fData) {
                await FunPermission.updateOne({bClientId: data.bClientId}, data)
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
        if (!data.bClientId) {
            next(new errors.BadRequest('后台客户id必填'));
        } else {
            let result = await FunPermission.findOne({
                bClientId: data.bClientId
            });
            res.status(200).json(result);
        }
    } catch (err) {
        next(new errors.BadRequest(err.message));
        L(err);
    }
}
