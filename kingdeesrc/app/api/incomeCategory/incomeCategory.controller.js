const errors = require('@lib/errors');
const L = require('debug')('app:api');

const IncomeCategory = require('./incomeCategory.model');
const pushMsg = require('../message/message.controller').pushMsg;

module.exports = {
    incomeCategoryUpdate,
    incomeCategoryQuery,
    deleteIncomeCategory,
    batchIncomeCategory,
    incomeCategoryUpdateSubject
};

async function incomeCategoryUpdate(req, res, next) {
    L('Calling API IncomeCategory.incomeCategoryUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.code) {
            next(new errors.BadRequest('编码必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('名称必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await IncomeCategory.updateOne({_id}, { $set: data })
            } else {
                await IncomeCategory.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function incomeCategoryQuery(req, res, next) {
    L('Calling API IncomeCategory.incomeCategoryQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await IncomeCategory.find({
                accountSetId: data.accountSetId
            });
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function deleteIncomeCategory(req, res, next) {
    L('Calling API IncomeCategory.deleteIncomeCategory', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('收入类别Id必填'));
        } else {
            await IncomeCategory.deleteOne({ _id: {$in: data.id} }, (err) => {
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

async function batchIncomeCategory(req, res, next) {
    L('Calling API IncomeCategory.batchIncomeCategory', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('收入类别Ids必填'));
        } else  if (!data.action) {
            next(new errors.BadRequest('批量操作必填'));
        } else {
            if (data.action === '删除') {
                await IncomeCategory.deleteMany({ _id: {$in: data.ids} }, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    }
                })
                res.status(200).end();
            } else {
                await IncomeCategory.updateMany({_id: {$in: data.ids}}, { $set: { status: data.action } })
                res.status(200).end();
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function incomeCategoryUpdateSubject(req, res, next) {
    L('Calling API IncomeCategory.incomeCategoryUpdateSubject', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('Ids必填'));
        } else if (!data.subjectCode) {
            next(new errors.BadRequest('科目必填'));
        } else {
            await IncomeCategory.updateMany({_id: { $in:  data.ids}}, { $set: {subjectCode: data.subjectCode} })
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}