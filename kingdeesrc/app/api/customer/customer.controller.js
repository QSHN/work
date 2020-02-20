const errors = require('@lib/errors');
const L = require('debug')('app:api');

const Customer = require('./customer.model');
const CustomerGroup = require('./customerGroup.model');
const pushMsg = require('../message/message.controller').pushMsg;

module.exports = {
    customerUpdate,
    customerQuery,
    batchCustomer,
    customerGroupUpdate,
    customerGroupQuery,
    customerGroupDelete,
    customerUpdateSubject
};

/***************** 客户 ***********************/
async function customerUpdate(req, res, next) {
    L('Calling API Customer.customerUpdate', req.body);

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
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await Customer.updateOne({_id}, { $set: data })
            } else {
                await Customer.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function customerQuery(req, res, next) {
    L('Calling API Customer.customerQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await Customer.find({
                accountSetId: data.accountSetId
            });
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function batchCustomer(req, res, next) {
    L('Calling API Customer.batchCustomer', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('客户Ids必填'));
        } else  if (!data.action) {
            next(new errors.BadRequest('批量操作必填'));
        } else {
            if (data.action === '删除') {
                await Customer.deleteMany({ _id: {$in: data.ids} }, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    }
                })
                res.status(200).end();
            } else {
                await Customer.updateMany({_id: {$in: data.ids}}, { $set: { status: data.action } })
                res.status(200).end();
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

/***************** 客户组 ***********************/
async function customerGroupUpdate(req, res, next) {
    L('Calling API Customer.customerGroupUpdate', req.body);

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
                await CustomerGroup.updateOne({_id}, { $set: data })
            } else {
                await CustomerGroup.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function customerGroupQuery(req, res, next) {
    L('Calling API Customer.customerGroupQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await CustomerGroup.find(data);
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function customerGroupDelete(req, res, next) {
    L('Calling API Customer.customerGroupDelete', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('客户组Id必填'));
        } else {
            await CustomerGroup.deleteOne({ _id: data.id }, (err) => {
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

async function customerUpdateSubject(req, res, next) {
    L('Calling API Customer.customerUpdateSubject', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('Ids必填'));
        } else if (!data.subjectCode) {
            next(new errors.BadRequest('科目必填'));
        } else {
            await Customer.updateMany({_id: { $in:  data.ids}}, { $set: {subjectCode: data.subjectCode} })
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}