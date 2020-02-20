const errors = require('@lib/errors');
const L = require('debug')('app:api');

const CommodityBrand = require('./commodityBrand.model');
const CommodityBrandGroup = require('./commodityBrandGroup.model');
const pushMsg = require('../message/message.controller').pushMsg;

module.exports = {
    brandUpdate,
    brandQuery,
    brandBatch,
    groupUpdate,
    groupQuery,
    groupDelete
};

/***************** 商品品牌 ***********************/
async function brandUpdate(req, res, next) {
    L('Calling API CommodityBrand.brandUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.groupId) {
            next(new errors.BadRequest('商品品牌id必填'));
        } else if (!data.code) {
            next(new errors.BadRequest('编码必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('名称必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await CommodityBrand.updateOne({_id}, { $set: data })
            } else {
                await CommodityBrand.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function brandQuery(req, res, next) {
    L('Calling API CommodityBrand.brandQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await CommodityBrand.find({
                accountSetId: data.accountSetId
            });
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function brandBatch(req, res, next) {
    L('Calling API CommodityBrand.brandBatch', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('商品品牌Ids必填'));
        } else  if (!data.action) {
            next(new errors.BadRequest('批量操作必填'));
        } else {
            if (data.action === '删除') {
                await CommodityBrand.deleteMany({ _id: {$in: data.ids} }, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    }
                })
                res.status(200).end();
            } else {
                await CommodityBrand.updateMany({_id: {$in: data.ids}}, { $set: { status: data.action } })
                res.status(200).end();
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

/***************** 商品品牌组 ***********************/
async function groupUpdate(req, res, next) {
    L('Calling API CommodityBrand.groupUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('商品品牌组名称必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await CommodityBrandGroup.updateOne({_id}, { $set: data })
            } else {
                await CommodityBrandGroup.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function groupQuery(req, res, next) {
    L('Calling API CommodityBrand.groupQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await CommodityBrandGroup.find(data);
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function groupDelete(req, res, next) {
    L('Calling API CommodityBrand.groupDelete', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('商品品牌组Id必填'));
        } else {
            await CommodityBrandGroup.deleteOne({ _id: data.id }, (err) => {
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
