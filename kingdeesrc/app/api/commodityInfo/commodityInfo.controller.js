const errors = require('@lib/errors');
const L = require('debug')('app:api');

const CommodityInfo = require('./commodityInfo.model');
const CommodityInfoGroup = require('./commodityInfoGroup.model');
const CommodityPrices = require('../commodityPrices/commodityPrices.model')
const pushMsg = require('../message/message.controller').pushMsg;

module.exports = {
    commodityInfoUpdate,
    commodityInfoQuery,
    batchCommodityInfo,
    queryCommodityInfoAndDetail,
    commodityInfoGroupUpdate,
    commodityInfoGroupQuery,
    commodityInfoGroupDelete,
    commodityInfoUpdateSubject
};

/***************** 客户 ***********************/
async function commodityInfoUpdate(req, res, next) {
    L('Calling API CommodityInfo.commodityInfoUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.code) {
            next(new errors.BadRequest('商品代码必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('商品名称必填'));
        } else if (!data.goodsType) {
            next(new errors.BadRequest('商品类型必填'));
        } else if (!data.groupId) {
            next(new errors.BadRequest('商品类别必填'));
        } else if (!data.unitGroup) {
            next(new errors.BadRequest('计量单位组必填'));
        } else if (!data.unit) {
            next(new errors.BadRequest('基本单位必填'));
        }  else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await CommodityInfo.updateOne({_id}, { $set: data })
            } else {
                await CommodityInfo.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function commodityInfoQuery(req, res, next) {
    L('Calling API CommodityInfo.commodityInfoQuery', req.body);

    try {
        let data = req.body;
        if (!data.filter || !data.filter.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.pageInfo || !data.pageInfo.page || !data.pageInfo.limit) {
            next(new errors.BadRequest('分页参数必填'));
        } else {
            let result = await CommodityInfo.find(data.filter).sort({createdAt: -1})
              .limit(parseInt(data.pageInfo.limit))
              .skip(data.pageInfo.limit * (data.pageInfo.page - 1));
            let total = await CommodityInfo.find(data.filter).countDocuments();
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

async function batchCommodityInfo(req, res, next) {
    L('Calling API CommodityInfo.batchCommodityInfo', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('客户Ids必填'));
        } else  if (!data.action) {
            next(new errors.BadRequest('批量操作必填'));
        } else {
            if (data.action === '删除') {
                await CommodityInfo.deleteMany({ _id: {$in: data.ids} }, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    }
                })
                res.status(200).end();
            } else {
                await CommodityInfo.updateMany({_id: {$in: data.ids}}, { $set: { status: data.action } })
                res.status(200).end();
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function queryCommodityInfoAndDetail(req, res, next) {
    L('Calling API CommodityInfo.queryCommodityInfoAndDetail', req.body);

    try {
        let data = req.body;
        if (!data.filter || !data.filter.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.pageInfo || !data.pageInfo.page || !data.pageInfo.limit) {
            next(new errors.BadRequest('分页参数必填'));
        } else {
            let isOne = data.filter.isOne
            delete data.filter.isOne
            let commodityInfo = await CommodityInfo.find(data.filter).sort({createdAt: -1})
            let result = []
            commodityInfo.forEach(f => {
                let addList = []
                if (!isOne && f.character.auxiliary && f.character.auxiliaryData.content && f.character.auxiliaryData.content.length) {
                    f.character.auxiliaryData.content.forEach(c => {
                        let obj = JSON.parse(JSON.stringify(f))
                        obj.auxiliary = c.auxiliary
                        obj.sku = c.sku
                        addList.push(obj)
                    })
                } else {
                    addList.unshift(JSON.parse(JSON.stringify(f)))
                }
                result = result.concat(addList)
            })
            let list = result.slice((data.pageInfo.page - 1) * data.pageInfo.limit, data.pageInfo.page * data.pageInfo.limit)
            let priceList = await CommodityPrices.find({ commodityId: { $in: list.map(m => m._id) }})
            res.status(200).json({
                priceList,
                total: result.length,
                list: list
            });
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

/***************** 客户组 ***********************/
async function commodityInfoGroupUpdate(req, res, next) {
    L('Calling API CommodityInfo.commodityInfoGroupUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('名称必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await CommodityInfoGroup.updateOne({_id}, { $set: data })
            } else {
                await CommodityInfoGroup.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function commodityInfoGroupQuery(req, res, next) {
    L('Calling API CommodityInfo.commodityInfoGroupQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await CommodityInfoGroup.find(data);
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function commodityInfoGroupDelete(req, res, next) {
    L('Calling API CommodityInfo.commodityInfoGroupDelete', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('客户组Id必填'));
        } else {
            await CommodityInfoGroup.deleteOne({ _id: data.id }, (err) => {
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

async function commodityInfoUpdateSubject(req, res, next) {
    L('Calling API CommodityInfo.commodityInfoUpdateSubject', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('Ids必填'));
        } else {
            let ids = data.ids
            delete data.ids
            await CommodityInfo.updateMany({_id: { $in: ids}}, { $set: data })
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}