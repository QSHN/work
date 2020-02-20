const errors = require('@lib/errors');
const L = require('debug')('app:api');

const AuxiliaryInfo = require('./auxiliaryInfo.model');
const AuxiliaryInfoGroup = require('./auxiliaryInfoGroup.model');
const pushMsg = require('../message/message.controller').pushMsg;

module.exports = {
    auxiliaryUpdate,
    auxiliaryQuery,
    auxiliaryBatch,
    groupUpdate,
    groupQuery,
    groupDelete
};

/***************** 辅助资料 ***********************/
async function auxiliaryUpdate(req, res, next) {
    L('Calling API AuxiliaryInfo.auxiliaryUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.groupId) {
            next(new errors.BadRequest('辅助资料id必填'));
        } else if (!data.code) {
            next(new errors.BadRequest('编码必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('名称必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await AuxiliaryInfo.updateOne({_id}, { $set: data })
            } else {
                await AuxiliaryInfo.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function auxiliaryQuery(req, res, next) {
    L('Calling API AuxiliaryInfo.auxiliaryQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await AuxiliaryInfo.find({
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
    L('Calling API AuxiliaryInfo.auxiliaryBatch', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('辅助资料Ids必填'));
        } else  if (!data.action) {
            next(new errors.BadRequest('批量操作必填'));
        } else {
            if (data.action === '删除') {
                await AuxiliaryInfo.deleteMany({ _id: {$in: data.ids} }, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    }
                })
                res.status(200).end();
            } else {
                await AuxiliaryInfo.updateMany({_id: {$in: data.ids}}, { $set: { status: data.action } })
                res.status(200).end();
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

/***************** 辅助资料组 ***********************/
async function groupUpdate(req, res, next) {
    L('Calling API AuxiliaryInfo.groupUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('辅助资料组名称必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await AuxiliaryInfoGroup.updateOne({_id}, { $set: data })
            } else {
                await AuxiliaryInfoGroup.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function groupQuery(req, res, next) {
    L('Calling API AuxiliaryInfo.groupQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await AuxiliaryInfoGroup.find(data);
            if (!result || !result.length) {
                await AuxiliaryInfoGroup.insertMany([
                    {
                        accountSetId: data.accountSetId,
                        code: '001',
                        name: '交货方式'
                    },
                    {
                        accountSetId: data.accountSetId,
                        code: '002',
                        name: '退货原因'
                    },
                    {
                        accountSetId: data.accountSetId,
                        code: '003',
                        name: '其它入库类型'
                    },
                    {
                        accountSetId: data.accountSetId,
                        code: '004',
                        name: '其他出库类型'
                    },
                    {
                        accountSetId: data.accountSetId,
                        code: '005',
                        name: '价格等级'
                    }
                ])
                result = await AuxiliaryInfoGroup.find(data);
            }
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function groupDelete(req, res, next) {
    L('Calling API AuxiliaryInfo.groupDelete', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('辅助资料组Id必填'));
        } else {
            await AuxiliaryInfoGroup.deleteOne({ _id: data.id }, (err) => {
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
