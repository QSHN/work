const errors = require('@lib/errors');
const L = require('debug')('app:api');
const Commodity = require('./commodity.model');
const CommodityType = require('./commodityType.model');
const CommodityLabel = require('./commodityLabel.model');
const CommodityUnit = require('./commodityUnit.model');
const CommodityBrand = require('./commodityBrand.model');
const Warehouse = require('../warehouse/warehouse.model');
const pushMsg = require('@notification/notification.controller').pushMsg;
const moment = require('moment');

module.exports = {
    createType,
    queryType,
    updateType,
    createLabel,
    queryLabel,
    updateLabel,
    createUnit,
    queryUnit,
    updateUnit,
    createBrand,
    queryBrand,
    updateBrand,
    getById,
    create,
    query,
    update,
    deleteCommodity
};

async function createType(req, res, next) {
    L('Calling API CommodityType.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = {companyId: companyId};
        if (req.body && req.body.type) obj.type = req.body.type
        await CommodityType.create(obj);
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function queryType(req, res, next) {
    L('Calling API CommodityType.query');

    try {
        let companyId = req.user.cid;
        let result = await CommodityType.findOne({companyId: companyId});
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function updateType(req, res, next) {
    L('Calling API CommodityType.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = {companyId: companyId};
        if (req.body && req.body.type) obj.type = req.body.type
        await CommodityType.updateOne(obj)
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function createLabel(req, res, next) {
    L('Calling API CommodityLabel.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = {companyId: companyId};
        if (req.body && req.body.label) obj.label = req.body.label
        await CommodityLabel.create(obj);
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function queryLabel(req, res, next) {
    L('Calling API CommodityLabel.query');

    try {
        let companyId = req.user.cid;
        let result = await CommodityLabel.findOne({companyId: companyId});
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function updateLabel(req, res, next) {
    L('Calling API CommodityLabel.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = {companyId: companyId};
        if (req.body && req.body.label) obj.label = req.body.label
        await CommodityLabel.updateOne(obj)
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function createUnit(req, res, next) {
    L('Calling API CommodityUnit.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = {companyId: companyId};
        if (req.body && req.body.unit) obj.unit = req.body.unit
        await CommodityUnit.create(obj);
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function queryUnit(req, res, next) {
    L('Calling API CommodityUnit.query');

    try {
        let companyId = req.user.cid;
        let result = await CommodityUnit.findOne({companyId: companyId});
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function updateUnit(req, res, next) {
    L('Calling API CommodityUnit.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = {companyId: companyId};
        if (req.body && req.body.unit) obj.unit = req.body.unit
        await CommodityUnit.updateOne(obj)
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}


async function createBrand(req, res, next) {
    L('Calling API CommodityBrand.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = {companyId: companyId};
        if (req.body && req.body.brand) obj.brand = req.body.brand
        await CommodityBrand.create(obj);
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function queryBrand(req, res, next) {
    L('Calling API CommodityBrand.query');

    try {
        let companyId = req.user.cid;
        let result = await CommodityBrand.findOne({companyId: companyId});
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function updateBrand(req, res, next) {
    L('Calling API CommodityBrand.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = {companyId: companyId};
        if (req.body && req.body.brand) obj.brand = req.body.brand
        await CommodityBrand.updateOne(obj)
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function create(req, res, next) {
    L('Calling API Commodity.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body
        obj.companyId = companyId
        let wData = await Warehouse.findOne({companyId: companyId})
        if (wData && wData.warehouse) {
            wData.warehouse.forEach(v => {
                v.commodity.forEach(v1 => {
                    if (v1.commodity.name === obj.name && v1.commodity.produced && moment(v1.commodity.produced).isSame(obj.produced)) {
                        throw new Error('已存在该生产日期的商品');
                    }
                })
            })
        }
        let apply = await Commodity.create(obj);
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
async function getById(req, res, next) {
    L('Calling API Commodity.getById', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid Commodity id'));
        return;
    }
    try {
        let result = await Commodity.findById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function query(req, res, next) {
    L('Calling API Commodity.query');

    try {
        let filter = {
            companyId: req.user.cid
        }
        let result = []
        if (req.query.id) filter._id = req.query.id
        if (req.query.page && req.query.limit) {
            result = await Commodity.find(filter).sort({createdAt: -1, status: -1})
                .limit(parseInt(req.query.limit))
                .skip(req.query.limit * (req.query.page - 1));
        } else {
            result = await Commodity.find(filter);
        }
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function update(req, res, next) {
    L('Calling API Commodity.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body
        let _id = obj._id
        delete obj._id
        await Commodity.update({_id, companyId}, obj)
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function deleteCommodity(req, res, next) {
    L('Calling API deleteCommodity.delete', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid Commodity id'));
        return;
    }
    try {
        let wData = await Warehouse.findOne({companyId: req.user.cid})
        if (wData && wData.warehouse) {
            wData.warehouse.forEach(v => {
                v.commodity.forEach(v1 => {
                    if (v1.commodity._id === req.params.id) {
                        if (
                            v1.realNumber && v1.realNumber > 0 ||
                            v1.dropShipping && v1.dropShipping > 0 ||
                            v1.billNumber && v1.billNumber > 0
                        ) {
                            throw new Error(`删除失败，该商品还拥有库存:${v1.realNumber || 0}, 待发货：${v1.dropShipping || 0}, 车载库存：${v1.billNumber || 0}`);
                        }
                    }
                })
            })
        }
        await Commodity.deleteOne({_id: req.params.id})
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
