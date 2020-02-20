const errors = require('@lib/errors');
const L = require('debug')('app:api');

const SpendingCategory = require('./spendingCategory.model');
const pushMsg = require('../message/message.controller').pushMsg;

module.exports = {
    spendingCategoryUpdate,
    spendingCategoryQuery,
    deleteSpendingCategory,
    batchSpendingCategory,
    spendingCategoryUpdateSubject
};

async function spendingCategoryUpdate(req, res, next) {
    L('Calling API SpendingCategory.spendingCategoryUpdate', req.body);

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
                await SpendingCategory.updateOne({_id}, { $set: data })
            } else {
                await SpendingCategory.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function spendingCategoryQuery(req, res, next) {
    L('Calling API SpendingCategory.spendingCategoryQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await SpendingCategory.find({
                accountSetId: data.accountSetId
            });
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function deleteSpendingCategory(req, res, next) {
    L('Calling API SpendingCategory.deleteSpendingCategory', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('支出类别Id必填'));
        } else {
            await SpendingCategory.deleteOne({ _id: {$in: data.id} }, (err) => {
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

async function batchSpendingCategory(req, res, next) {
    L('Calling API SpendingCategory.batchSpendingCategory', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('支出类别Ids必填'));
        } else  if (!data.action) {
            next(new errors.BadRequest('批量操作必填'));
        } else {
            if (data.action === '删除') {
                await SpendingCategory.deleteMany({ _id: {$in: data.ids} }, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    }
                })
                res.status(200).end();
            } else {
                await SpendingCategory.updateMany({_id: {$in: data.ids}}, { $set: { status: data.action } })
                res.status(200).end();
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function spendingCategoryUpdateSubject(req, res, next) {
    L('Calling API SpendingCategory.spendingCategoryUpdateSubject', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('Ids必填'));
        } else if (!data.subjectCode) {
            next(new errors.BadRequest('科目必填'));
        } else {
            await SpendingCategory.updateMany({_id: { $in:  data.ids}}, { $set: {subjectCode: data.subjectCode} })
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}