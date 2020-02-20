const errors = require('@lib/errors');
const L = require('debug')('app:api');
const SalesOrder = require('../salesOrder/salesOrder.model');
const CxOrder = require('../carSales/cxOrder.model');

module.exports = {
    query
};

async function query(req, res, next) {
    L('Calling API SalesOrder.query');

    try {
        let filter = {
            companyId: req.user.cid
        };
        const val = req.body
        let result = [],
            sList = [],
            cList = [];
        if (val.status) filter.status = val.status;
        if (val.name) filter.name = val.name;
        if (val.creator) filter.creator = {$in: val.creator};
        if (val.startTime || val.endTime) {
            let time = {}
            if (val.startTime) time['$gte'] = val.startTime
            if (val.endTime) time['$lte'] = val.endTime
            filter.createdAt = time;
        }
        if (val.page && val.limit) {
            if (val.orderType === '销售订单' || !val.orderType) {
                sList = await SalesOrder.find(filter).sort({createdAt: -1})
                    .limit(parseInt(val.limit))
                    .skip(val.limit * (val.page - 1));
            }
            if (val.orderType === '车销单' || !val.orderType) {
                cList = await CxOrder.find(filter).sort({createdAt: -1})
                    .limit(parseInt(val.limit))
                    .skip(val.limit * (val.page - 1));
            }
        } else {
            if (val.orderType === '销售订单' || !val.orderType) {
                sList = await SalesOrder.find(filter);
            }
            if (val.orderType === '车销单' || !val.orderType) {
                cList = await CxOrder.find(filter);
            }
        }
        result = sList.concat(cList)
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
