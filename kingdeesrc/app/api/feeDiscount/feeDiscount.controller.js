const errors = require('@lib/errors');
const L = require('debug')('app:api');
const pushMsg = require('../message/message.controller').pushMsg;

const FeeDiscount = require('./feeDiscount.model');

module.exports = {
    updateFeeDiscount,
    queryFeeDiscount
};

async function updateFeeDiscount(req, res, next) {
    L('Calling API FeeDiscount.updateFeeDiscount', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else if (!data.feeSubjectCode && !data.discountSubjectCode) {
            next(new errors.BadRequest('对应科目必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await FeeDiscount.updateOne({_id}, { $set: data })
            } else {
                await FeeDiscount.create(data)
            }
            res.status(200).end()
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function queryFeeDiscount(req, res, next) {
    L('Calling API FeeDiscount.queryFeeDiscount', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await FeeDiscount.findOne(data)
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}