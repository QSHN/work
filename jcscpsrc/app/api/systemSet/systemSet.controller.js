const errors = require('@lib/errors');
const L = require('debug')('app:api');

const SystemSet = require('./systemSet.model');

module.exports = {
    updateSystemSet,
    querySystemSet
};

async function updateSystemSet(req, res, next) {
    L('Calling API SystemSet.updateSystemSet', req.body);

    try {
        let data = req.body
        if (data._id) {
            let _id = data._id
            delete data._id
            await SystemSet.updateOne({_id}, data)
            res.status(200).end();
        } else {
            next(new errors.BadRequest('缺少系统设置id'));
        }
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function querySystemSet(req, res, next) {
    L('Calling API SystemSet.querySystemSet', req.body);

    try {
        let result = await SystemSet.findOne()
        if (!result) {
            await SystemSet.create({ passErr: 5 })
            result = await SystemSet.findOne()
        }
        res.status(200).json(result);
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}