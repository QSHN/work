const errors = require('@lib/errors');
const L = require('debug')('app:api');
const pushMsg = require('../message/message.controller').pushMsg;

const SelectInfo = require('./selectInfo.model');
const Cost = require('../cost/cost.model');
const Department = require('../department/department.model');
const Clerk = require('../clerk/clerk.model');
const Customer = require('../customer/customer.model');
const Supplier = require('../supplier/supplier.model');
const BankAccount = require('../bankAccount/bankAccount.model');

module.exports = {
    update,
    query,
    deleteSelectInfo
};

async function update(req, res, next) {
    L('Calling API SelectInfo.update', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else if (!data.code) {
            next(new errors.BadRequest('编码必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('名称必填'));
        } else if (!data.category) {
            next(new errors.BadRequest('类别必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await SelectInfo.updateOne({_id}, { $set: data })
                switch (data.category) {
                    case 'KHDJ':
                        await Customer.updateMany({
                            accountSetId: data.accountSetId,
                            levelId: _id
                        }, {$set: {level: data.name}})
                        break
                }
            } else {
                await SelectInfo.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function query(req, res, next) {
    L('Calling API SelectInfo.query', req.body);

    try {
        let filter = req.body ? Object.assign({}, req.body) : {}
        if (!filter.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await SelectInfo.find(filter)
            if (result.length === 0) {
                let info = [
                    {category: 'KHDJ', code: 'KHDJ1', name: '零售客户'},
                    {category: 'KHDJ', code: 'KHDJ2', name: '批发客户'},
                    {category: 'KHDJ', code: 'KHDJ3', name: 'VIP客户'},
                    {category: 'KHDJ', code: 'KHDJ4', name: '折扣等级一'},
                    {category: 'KHDJ', code: 'KHDJ5', name: '折扣等级二'}
                ]
                for (let i = 0; i < info.length; i++) {
                    let Obj = Object.assign({}, info[i])
                    Obj.accountSetId = filter.accountSetId
                    await SelectInfo.create(Obj)
                }
                result = await SelectInfo.find(filter)
            }
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function deleteSelectInfo(req, res, next) {
    L('Calling API SelectInfo.deleteSelectInfo', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('选择资料Id必填'));
        } else {
            await SelectInfo.deleteOne({ _id: data.id }, (err) => {
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
