const errors = require('@lib/errors');
const L = require('debug')('app:api');
const CxInventory = require('./cxInventory.model');
const pushMsg = require('@notification/notification.controller').pushMsg;

module.exports = {
    query,
    getById,
    create,
    update
};

async function create(req, res, next) {
    L('Calling API CxInventory.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body;
        obj.companyId = companyId;
        await CxInventory.create(obj);
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
async function getById(req, res, next) {
    L('Calling API CxInventory.getById', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid CxInventory id'));
        return;
    }
    try {
        let result = await CxInventory.findById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function query(req, res, next) {
    L('Calling API CxInventory.query');

    try {
        let filter = {
            companyId: req.user.cid
        };
        let result = await CxInventory.find(filter);
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function update(req, res, next) {
    L('Calling API CxInventory.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body
        let _id = obj._id
        delete obj._id
        await CxInventory.update({_id, companyId}, obj)
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
