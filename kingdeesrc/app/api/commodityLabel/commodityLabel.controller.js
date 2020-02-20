const errors = require('@lib/errors');
const L = require('debug')('app:api');

const CommodityLabel = require('./commodityLabel.model');
const CommodityLabelGroup = require('./commodityLabelGroup.model');
const pushMsg = require('../message/message.controller').pushMsg;

module.exports = {
    labelUpdate,
    labelQuery,
    labelBatch,
    groupUpdate,
    groupQuery,
    groupDelete
};

/***************** 商品标签 ***********************/
async function labelUpdate(req, res, next) {
    L('Calling API CommodityLabel.labelUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.groupId) {
            next(new errors.BadRequest('商品标签id必填'));
        } else if (!data.code) {
            next(new errors.BadRequest('编码必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('名称必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await CommodityLabel.updateOne({_id}, { $set: data })
            } else {
                await CommodityLabel.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function labelQuery(req, res, next) {
    L('Calling API CommodityLabel.labelQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await CommodityLabel.find({
                accountSetId: data.accountSetId
            });
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function labelBatch(req, res, next) {
    L('Calling API CommodityLabel.labelBatch', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('商品标签Ids必填'));
        } else  if (!data.action) {
            next(new errors.BadRequest('批量操作必填'));
        } else {
            if (data.action === '删除') {
                await CommodityLabel.deleteMany({ _id: {$in: data.ids} }, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    }
                })
                res.status(200).end();
            } else {
                await CommodityLabel.updateMany({_id: {$in: data.ids}}, { $set: { status: data.action } })
                res.status(200).end();
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

/***************** 商品标签组 ***********************/
async function groupUpdate(req, res, next) {
    L('Calling API CommodityLabel.groupUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('商品标签组名称必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await CommodityLabelGroup.updateOne({_id}, { $set: data })
            } else {
                await CommodityLabelGroup.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function groupQuery(req, res, next) {
    L('Calling API CommodityLabel.groupQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await CommodityLabelGroup.find(data);
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function groupDelete(req, res, next) {
    L('Calling API CommodityLabel.groupDelete', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('商品标签组Id必填'));
        } else {
            await CommodityLabelGroup.deleteOne({ _id: data.id }, (err) => {
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
