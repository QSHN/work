const errors = require('@lib/errors');
const L = require('debug')('app:api');
const pushMsg = require('../message/message.controller').pushMsg;

const ProofWords = require('./proofWords.model');

module.exports = {
    update,
    query,
    wordDelete
};

async function update(req, res, next) {
    L('Calling API ProofWords.update', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('名称必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                if (data.defaultValue === '是') {
                    await ProofWords.updateMany({
                        accountSetId: data.accountSetId,
                        defaultValue: '是'
                    }, {$set: { defaultValue: '否' }})
                }
                await ProofWords.updateOne({_id}, { $set: data })
            } else {
                await ProofWords.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function query(req, res, next) {
    L('Calling API ProofWords.query', req.body);

    try {
        let filter = req.body ? Object.assign({}, req.body) : {}
        let result = await ProofWords.find(filter).sort({createdAt: -1})
        if (result && result.length === 0) {
            await ProofWords.insertMany([
                {
                    accountSetId: filter.accountSetId,
                    name: '调'
                },
                {
                    accountSetId: filter.accountSetId,
                    name: '付'
                },
                {
                    accountSetId: filter.accountSetId,
                    name: '记',
                    defaultValue: '是'
                },
                {
                    accountSetId: filter.accountSetId,
                    name: '收'
                },
                {
                    accountSetId: filter.accountSetId,
                    name: '转'
                }
            ])
            result = await ProofWords.find(filter).sort({createdAt: -1})
        }
        res.status(200).json(result);
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function wordDelete(req, res, next) {
    L('Calling API ProofWords.wordDelete', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('凭证字Id必填'));
        } else {
            await ProofWords.deleteOne({ _id: data.id }, (err) => {
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
