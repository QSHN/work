const errors = require('@lib/errors');
const L = require('debug')('app:api');

const CommodityInventory = require('./commodityInventory.model');
const pushMsg = require('../message/message.controller').pushMsg;

module.exports = {
    updateCommodityInventory,
    queryCommodityInventory,
    batchCommodityInventory
};

/***************** 商品库存 ***********************/
async function updateCommodityInventory(req, res, next) {
    L('Calling API CommodityInventory.updateCommodityInventory', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.commodityId) {
            next(new errors.BadRequest('商品id必填'));
        } else if (!data.warehouseId) {
            next(new errors.BadRequest('仓库id必填'));
        } else if (!data.groupId) {
            next(new errors.BadRequest('商品类别必填'));
        } else if (!data.unit) {
            next(new errors.BadRequest('基本单位必填'));
        } else if (!data.beginning) {
            next(new errors.BadRequest('期初余额必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await CommodityInventory.updateOne({_id}, { $set: data })
            } else {
                await CommodityInventory.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function queryCommodityInventory(req, res, next) {
    L('Calling API CommodityInventory.queryCommodityInventory', req.body);

    try {
        let data = req.body;
        if (!data.filter || !data.filter.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.pageInfo || !data.pageInfo.page || !data.pageInfo.limit) {
            next(new errors.BadRequest('分页参数必填'));
        } else {
            let total = await CommodityInventory.find(data.filter).countDocuments();
            let result = await CommodityInventory.find(data.filter)
              .limit(parseInt(data.pageInfo.limit))
              .skip(data.pageInfo.limit * (data.pageInfo.page - 1));
            res.status(200).json({
                total,
                list: result
            });
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function batchCommodityInventory(req, res, next) {
    L('Calling API CommodityInventory.batchCommodityInventory', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('商品Ids必填'));
        } else {
            if (data.action === '删除') {
                await CommodityInventory.deleteMany({ _id: {$in: data.ids} }, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    }
                })
                res.status(200).end();
            } else {
                for (let i = 0; i < data.ids.length; i++) {
                    if (data.ids[i]._id) {
                        await CommodityInventory.updateOne({
                            _id: data.ids[i]._id
                        }, {
                            $set: {
                                warehouseId: data.ids[i].warehouseId,
                                registration: data.ids[i].registration,
                                production: data.ids[i].production,
                                beginning: data.ids[i].beginning,
                                inventory: data.ids[i].inventory,
                                unit: data.ids[i].unit,
                            }
                        })
                    } else {
                        await CommodityInventory.create(Object.assign({accountSetId: data.accountSetId}, data.ids[i]))
                    }
                }
                res.status(200).end();
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
