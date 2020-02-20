const errors = require('@lib/errors');
const L = require('debug')('app:api');
const Warehouse = require('./warehouse.model');
const pushMsg = require('@notification/notification.controller').pushMsg;

module.exports = {
    getById,
    create,
    query,
    update,
    deleteWarehouse
};

async function create(req, res, next) {
    L('Calling API Warehouse.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body
        obj.companyId = companyId
        let apply = await Warehouse.create(obj);
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function getById(req, res, next) {
    L('Calling API Warehouse.getById', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid Warehouse id'));
        return;
    }
    try {
        let result = await Warehouse.findById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function query(req, res, next) {
    L('Calling API Warehouse.query');

    try {
        let filter = {
            companyId: req.user.cid
        }
        if (req.query.id) filter._id = req.query.id
        let result = await Warehouse.findOne(filter);
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function update(req, res, next) {
    L('Calling API Warehouse.update', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body
        await Warehouse.update({companyId}, obj)
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function deleteWarehouse(req, res, next) {
    L('Calling API deleteWarehouse.delete', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid Warehouse id'));
        return;
    }
    try {
        await Warehouse.deleteOne({_id: req.params.id})
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
