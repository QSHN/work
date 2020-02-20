const errors = require('@lib/errors');
const L = require('debug')('app:api');
const CxCarManage = require('./cxCarManage.model');
const pushMsg = require('@notification/notification.controller').pushMsg;

module.exports = {
    query,
    getById,
    create,
    update,
    deleteCar
};

async function create(req, res, next) {
    L('Calling API CxCarManage.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body;
        obj.companyId = companyId;
        obj.creator = req.user.sub;
        let apply = await CxCarManage.create(obj);
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
async function getById(req, res, next) {
    L('Calling API CxCarManage.getById', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid CxCarManage id'));
        return;
    }
    try {
        let result = await CxCarManage.findById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function query(req, res, next) {
    L('Calling API CxCarManage.query');

    try {
        let filter = {
            companyId: req.user.cid
        };
        const val = req.body
        let result = [];
        if (val.id) filter._id = val.id;
        if (val.status) filter.status = val.status;
        if (val.numberPlate) filter.numberPlate = val.numberPlate;
        if (val.salesman) filter.salesman = val.salesman;
        if (val.page && val.limit) {
            result = await CxCarManage.find(filter).sort({createdAt: -1})
                .limit(parseInt(val.limit))
                .skip(val.limit * (val.page - 1));
        } else {
            result = await CxCarManage.find(filter);
        }
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function update(req, res, next) {
    L('Calling API CxCarManage.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body
        let _id = obj._id
        delete obj._id
        await CxCarManage.update({_id, companyId}, obj)
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function deleteCar(req, res, next) {
    L('Calling API deleteCxCarManage.delete', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid CxCarManage id'));
        return;
    }
    try {
        await CxCarManage.deleteOne({_id: req.params.id})
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
