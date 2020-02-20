const errors = require('@lib/errors');
const L = require('debug')('app:api');

const BankAccount = require('./bankAccount.model');
const pushMsg = require('../message/message.controller').pushMsg;

module.exports = {
    bankAccountUpdate,
    bankAccountQuery,
    batchBankAccount,
    bankAccountUpdateSubject
};

async function bankAccountUpdate(req, res, next) {
    L('Calling API BankAccount.bankAccountUpdate', req.body);

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
                await BankAccount.updateOne({_id}, { $set: data })
            } else {
                await BankAccount.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function bankAccountQuery(req, res, next) {
    L('Calling API BankAccount.bankAccountQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await BankAccount.find({
                accountSetId: data.accountSetId
            });
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function batchBankAccount(req, res, next) {
    L('Calling API BankAccount.batchBankAccount', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('银行账号Ids必填'));
        } else  if (!data.action) {
            next(new errors.BadRequest('批量操作必填'));
        } else {
            if (data.action === '删除') {
                await BankAccount.deleteMany({ _id: {$in: data.ids} }, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    }
                })
                res.status(200).end();
            } else {
                await BankAccount.updateMany({_id: {$in: data.ids}}, { $set: { status: data.action } })
                res.status(200).end();
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function bankAccountUpdateSubject(req, res, next) {
    L('Calling API BankAccount.bankAccountUpdateSubject', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('Ids必填'));
        } else if (!data.subjectCode) {
            next(new errors.BadRequest('科目必填'));
        } else {
            await BankAccount.updateMany({_id: { $in:  data.ids}}, { $set: {subjectCode: data.subjectCode} })
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
