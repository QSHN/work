const errors = require('@lib/errors');
const L = require('debug')('app:api');

const AuxiliaryAttributes = require('./auxiliaryAttributes.model');
const AuxiliaryAttributesGroup = require('./auxiliaryAttributesGroup.model');
const pushMsg = require('../message/message.controller').pushMsg;

module.exports = {
    auxiliaryUpdate,
    auxiliaryQuery,
    auxiliaryBatch,
    groupUpdate,
    groupQuery,
    groupDelete
};

/***************** 辅助属性 ***********************/
async function auxiliaryUpdate(req, res, next) {
    L('Calling API AuxiliaryAttributes.auxiliaryUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.groupId) {
            next(new errors.BadRequest('辅助属性id必填'));
        } else if (!data.code) {
            next(new errors.BadRequest('编码必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('名称必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await AuxiliaryAttributes.updateOne({_id}, { $set: data })
            } else {
                await AuxiliaryAttributes.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function auxiliaryQuery(req, res, next) {
    L('Calling API AuxiliaryAttributes.auxiliaryQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await AuxiliaryAttributes.find({
                accountSetId: data.accountSetId
            });
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function auxiliaryBatch(req, res, next) {
    L('Calling API AuxiliaryAttributes.auxiliaryBatch', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('辅助属性Ids必填'));
        } else  if (!data.action) {
            next(new errors.BadRequest('批量操作必填'));
        } else {
            if (data.action === '删除') {
                await AuxiliaryAttributes.deleteMany({ _id: {$in: data.ids} }, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    }
                })
                res.status(200).end();
            } else {
                await AuxiliaryAttributes.updateMany({_id: {$in: data.ids}}, { $set: { status: data.action } })
                res.status(200).end();
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

/***************** 辅助属性组 ***********************/
async function groupUpdate(req, res, next) {
    L('Calling API AuxiliaryAttributes.groupUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('辅助属性组名称必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await AuxiliaryAttributesGroup.updateOne({_id}, { $set: data })
            } else {
                await AuxiliaryAttributesGroup.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function groupQuery(req, res, next) {
    L('Calling API AuxiliaryAttributes.groupQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await AuxiliaryAttributesGroup.find(data);
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function groupDelete(req, res, next) {
    L('Calling API AuxiliaryAttributes.groupDelete', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('辅助属性组Id必填'));
        } else {
            await AuxiliaryAttributesGroup.deleteOne({ _id: data.id }, (err) => {
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
