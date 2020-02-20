const errors = require('@lib/errors');
const L = require('debug')('app:api');
const pushMsg = require('../message/message.controller').pushMsg;

const Formula = require('./formula.model');

module.exports = {
    formulaUpdate,
    formulaQuery,
    formulaDelete
};

async function formulaUpdate(req, res, next) {
    L('Calling API Formula.formulaUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else if (!data.list) {
            next(new errors.BadRequest('公式内容必填'));
        } else if (!data.type) {
            next(new errors.BadRequest('公式类别必填'));
        } else {
            if (data.type.includes('custom')) {
                let formula = await Formula.findOne({ accountSetId: data.accountSetId })
                let custom = Object.assign({}, formula.custom )|| {}
                if (data.type.includes('_')) {
                    custom[data.type].list = data.list
                } else {
                    if (Object.keys(custom).length) {
                        let num = 1
                        for (let k in custom) {
                            num = k.split('_')[1]
                        }
                        custom['custom_' + (parseInt(num) + 1)] = data.list
                    } else {
                        custom = { 'custom_1': data.list }
                    }
                }
                await Formula.updateOne({
                    accountSetId: data.accountSetId
                }, {
                    $set: { custom: custom }
                })
            } else {
                await Formula.updateOne({
                    accountSetId: data.accountSetId
                }, {
                    $set: {
                        [data.type]: data.list
                    }
                })
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function formulaQuery(req, res, next) {
    L('Calling API Formula.formulaQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else {
            let filter = {
                accountSetId: data.accountSetId
            }
            let result = await Formula.findOne(filter)
            if  (!result) {
                await Formula.create(filter)
                result = await Formula.findOne(filter)
            }
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function formulaDelete(req, res, next) {
    L('Calling API Formula.formulaDelete', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else if (!data.type) {
            next(new errors.BadRequest('公式类别必填'));
        } else {
            let formula = await Formula.findOne({ accountSetId: data.accountSetId })
            let custom = formula.custom
            if (custom[data.type]) {
                delete custom[data.type]
            }
            await Formula.updateOne({
                accountSetId: data.accountSetId
            }, {
                $set: { custom: custom }
            })
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
