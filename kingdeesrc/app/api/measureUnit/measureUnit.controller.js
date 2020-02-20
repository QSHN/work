const errors = require('@lib/errors');
const L = require('debug')('app:api');

const MeasureUnit = require('./measureUnit.model');
const UnitGroup = require('./unitGroup.model');
const pushMsg = require('../message/message.controller').pushMsg;

module.exports = {
    unitUpdate,
    unitQuery,
    unitDelete,
    groupUpdate,
    groupQuery,
    groupDelete
};

/***************** 计量单位 ***********************/
async function unitUpdate(req, res, next) {
    L('Calling API MeasureUnit.unitUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.groupId) {
            next(new errors.BadRequest('计量组id必填'));
        } else if (!data.code) {
            next(new errors.BadRequest('编码必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('名称必填'));
        } else if (!data.conversion) {
            next(new errors.BadRequest('换算方式必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                if (data.setDefault !== undefined) {
                    await UnitGroup.updateOne({_id: data.groupId}, { $set: {defaultValue: data.setDefault ? _id : null}})
                }
                await MeasureUnit.updateOne({_id}, { $set: data })
            } else {
                await MeasureUnit.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function unitQuery(req, res, next) {
    L('Calling API MeasureUnit.unitQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await MeasureUnit.find({
                accountSetId: data.accountSetId
            });
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function unitDelete(req, res, next) {
    L('Calling API MeasureUnit.unitDelete', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('计量单位Ids必填'));
        } else {
            await MeasureUnit.deleteMany({ _id: {$in: data.ids} }, (err) => {
                if (err) {
                    next(new errors.BadRequest(err));
                }
            })
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

/***************** 计量单位组 ***********************/
async function groupUpdate(req, res, next) {
    L('Calling API MeasureUnit.groupUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('计量单位组名称必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await UnitGroup.updateOne({_id}, { $set: data })
            } else {
                await UnitGroup.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function groupQuery(req, res, next) {
    L('Calling API MeasureUnit.groupQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await UnitGroup.find(data);
            let num = result.length
            if (num > 0) {
                result.forEach(async (v, i) => {
                    if (v.defaultValue) {
                        let unit = await MeasureUnit.findOne({_id: v.defaultValue})
                        if (unit) v._doc.dValue = unit.name
                        num--
                    } else {
                        num--
                    }
                    if (num <= 0) res.status(200).json(result);
                })
            } else {
                res.status(200).json(result);
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function groupDelete(req, res, next) {
    L('Calling API MeasureUnit.groupDelete', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('计量单位组Id必填'));
        } else {
            await UnitGroup.deleteOne({ _id: data.id }, (err) => {
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
