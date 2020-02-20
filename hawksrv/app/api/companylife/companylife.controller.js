const CompanyLife = require('./companylife.model');
const moment = require('moment');
moment.locale('zh-cn');
const L = require('debug')('app:api');
const errors = require('@lib/errors');

module.exports = {

    getByCompanyId,
    startTrial,
}

let options = {
    new: true
};


async function getByCompanyId(req, res, next) {
    L('Calling CompanyLife API CompanyLife.getById');

    if (!req.user.cid) {
        next(new errors.BadRequest('invalid company id'));
        return;
    }

    try {
        let c = await CompanyLife.find({companyId:req.user.cid});
        if (c && c.length>0){
            res.json(c[0]);
        } else {
            res.json(null);
        }

    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

/**
 *
 * 开通试用
 * @returns {Promise<void>}
 */
async function startTrial(cid) {
    try {
        if (!cid) {
            new errors.BadRequest('invalid company id')
            return;
        }

        let companylife = {}
        let validDate = moment({hour:0}).add(300,'years');
        companylife.companyId = cid;
        companylife.number = 3000000;
        companylife.validDate = validDate;
        companylife.nearestValidDate = validDate;
        companylife.items = [{number: 3000000, validDate:validDate}]
        companylife.status = '正常';
        await CompanyLife.create(companylife);

    } catch (err) {
        L(err);
        throw err;
    }

}

