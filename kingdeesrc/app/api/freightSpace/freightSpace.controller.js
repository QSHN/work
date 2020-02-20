const errors = require('@lib/errors');
const L = require('debug')('app:api');

const FreightSpace = require('./freightSpace.model');
const FreightSpaceGroup = require('./freightSpaceGroup.model');
const pushMsg = require('../message/message.controller').pushMsg;

module.exports = {
    spaceUpdate,
    spaceQuery,
    groupUpdate,
    groupQuery,
    groupDelete
};

/***************** 仓位 ***********************/
async function spaceUpdate(req, res, next) {
    L('Calling API FreightSpace.spaceUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.groupId) {
            next(new errors.BadRequest('仓位组id必填'));
        } else if (!data.code) {
            next(new errors.BadRequest('编码必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('名称必填'));
        }  else {
            if (data._id) {
                let _id = data._id
                delete data._id
                if (data.isDefault) {
                    await FreightSpace.updateMany({groupId: data.groupId, isDefault: true}, {$set: {isDefault: false}})
                }
                await FreightSpace.updateOne({_id}, { $set: data })
            } else {
                await FreightSpace.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function spaceQuery(req, res, next) {
    L('Calling API FreightSpace.spaceQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await FreightSpace.find(data);
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

/***************** 仓位组 ***********************/
async function groupUpdate(req, res, next) {
    L('Calling API FreightSpace.groupUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.code) {
            next(new errors.BadRequest('仓位组编码必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('仓位组名称必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await FreightSpaceGroup.updateOne({_id}, { $set: data })
            } else {
                await FreightSpaceGroup.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function groupQuery(req, res, next) {
    L('Calling API FreightSpace.groupQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await FreightSpaceGroup.find(data);
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function groupDelete(req, res, next) {
    L('Calling API FreightSpace.groupDelete', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('仓位组Id必填'));
        } else {
            await FreightSpaceGroup.deleteOne({ _id: data.id }, (err) => {
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
