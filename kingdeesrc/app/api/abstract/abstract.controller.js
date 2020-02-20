const errors = require('@lib/errors');
const L = require('debug')('app:api');
const pushMsg = require('../message/message.controller').pushMsg;

const Abstract = require('./abstract.model');

module.exports = {
    update,
    query,
    deleteAbstract
};

async function update(req, res, next) {
    L('Calling API Abstract.update', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('名字必填'));
        } else if (!data.code) {
            next(new errors.BadRequest('编码必填'));
        } else {
            let result;
            if (data._id) {
                let _id = data._id
                delete data._id
                await Abstract.updateOne({_id}, { $set: data })
            } else {
                await Abstract.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function query(req, res, next) {
    L('Calling API Abstract.query', req.body);

    try {
        let filter = req.body ? Object.assign({}, req.body) : {}
        let result = await Abstract.find(filter).sort({createdAt: -1})
        res.status(200).json(result);
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function deleteAbstract(req, res, next) {
    L('Calling API Abstract.deleteAbstract', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('银行Id必填'));
        } else {
            await Abstract.deleteOne({ _id: data.id }, (err) => {
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
