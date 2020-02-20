const errors = require('@lib/errors');
const L = require('debug')('app:api');

const Supplier = require('./supplier.model');
const SupplierGroup = require('./supplierGroup.model');
const pushMsg = require('../message/message.controller').pushMsg;

module.exports = {
    supplierUpdate,
    supplierQuery,
    batchSupplier,
    supplierGroupUpdate,
    supplierGroupQuery,
    supplierGroupDelete,
    supplierUpdateSubject
};

/***************** 供应商 ***********************/
async function supplierUpdate(req, res, next) {
    L('Calling API Supplier.supplierUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.code) {
            next(new errors.BadRequest('编码必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('名称必填'));
        } else if (!data.list || !data.list.length) {
            next(new errors.BadRequest('联系人必填'));
        }  else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await Supplier.updateOne({_id}, { $set: data })
            } else {
                await Supplier.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function supplierQuery(req, res, next) {
    L('Calling API Supplier.supplierQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await Supplier.find({
                accountSetId: data.accountSetId
            });
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function batchSupplier(req, res, next) {
    L('Calling API Supplier.batchSupplier', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('供应商Ids必填'));
        } else  if (!data.action) {
            next(new errors.BadRequest('批量操作必填'));
        } else {
            if (data.action === '删除') {
                await Supplier.deleteMany({ _id: {$in: data.ids} }, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    }
                })
                res.status(200).end();
            } else {
                await Supplier.updateMany({_id: {$in: data.ids}}, { $set: { status: data.action } })
                res.status(200).end();
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

/***************** 供应商组 ***********************/
async function supplierGroupUpdate(req, res, next) {
    L('Calling API Supplier.supplierGroupUpdate', req.body);

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
                await SupplierGroup.updateOne({_id}, { $set: data })
            } else {
                await SupplierGroup.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function supplierGroupQuery(req, res, next) {
    L('Calling API Supplier.supplierGroupQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await SupplierGroup.find(data);
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function supplierGroupDelete(req, res, next) {
    L('Calling API Supplier.supplierGroupDelete', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('供应商组Id必填'));
        } else {
            await SupplierGroup.deleteOne({ _id: data.id }, (err) => {
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

async function supplierUpdateSubject(req, res, next) {
    L('Calling API Supplier.supplierUpdateSubject', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('Ids必填'));
        } else if (!data.subjectCode) {
            next(new errors.BadRequest('科目必填'));
        } else {
            await Supplier.updateMany({_id: { $in: data.ids}}, { $set: {subjectCode: data.subjectCode} })
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}