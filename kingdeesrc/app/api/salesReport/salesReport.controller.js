const errors = require('@lib/errors');
const L = require('debug')('app:api');
const pushMsg = require('../message/message.controller').pushMsg;
const moment = require('moment');

const SalesWarehouse = require('../salesWarehouse/salesWarehouse.model');
const SalesReturn = require('../salesReturn/salesReturn.model');
const SalesOrder = require('../salesOrder/salesOrder.model');
const PurchaseWarehouse = require('../purchaseWarehouse/purchaseWarehouse.model');
const PurchaseReturn = require('../purchaseReturn/purchaseReturn.model');

module.exports = {
    detailSalesReport,
    trackingSalesReport,
    PSummarySalesReport,
    summarySalesReport,
    rankingSalesReport
};

async function detailSalesReport(req, res, next) {
    L('Calling API salesReport.detailSalesReport', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else {
            let type = data.type
            delete data.type
            let sw = type !== '销售退货' ? await SalesWarehouse.find(data) : []
            let sr = type !== '销售出库' ? await SalesReturn.find(data) : []
            let result = sw.map(v => {
                return Object.assign({orderType: '销售出库单'}, v._doc)
            }).concat(sr.map(v => {
                return Object.assign({orderType: '销售退货单'}, v._doc)
            })).sort((a, b) => {
                if (moment(a.dateTime).isBefore(b.dateTime)) {
                    return -1
                } else if (moment(a.dateTime).isAfter(b.dateTime)) {
                    return 1
                } else {
                    return 0
                }
            })
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function trackingSalesReport(req, res, next) {
    L('Calling API salesReport.trackingSalesReport', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else {
            let result = await SalesOrder.find(data)
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function PSummarySalesReport(req, res, next) {
    L('Calling API salesReport.trackingSalesReport', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else {
            let sw = await SalesWarehouse.find(data)
            let sr = await SalesReturn.find(data)
            let pw = await PurchaseWarehouse.find(data)
            let pr = await PurchaseReturn.find(data)
            let result = sw.map(v => {
                return Object.assign({orderType: '销售出库单'}, v._doc)
            }).concat(sr.map(v => {
                return Object.assign({orderType: '销售退货单'}, v._doc)
            })).concat(pw.map(v => {
                return Object.assign({orderType: '采购入库单'}, v._doc)
            })).concat(pr.map(v => {
                return Object.assign({orderType: '采购退货单'}, v._doc)
            }))
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function summarySalesReport(req, res, next) {
    L('Calling API salesReport.summarySalesReport', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else {
            let type = data.type
            delete data.type
            let sw = type !== '销售退货' ? await SalesWarehouse.find(data) : []
            let sr = type !== '销售出库' ? await SalesReturn.find(data) : []
            let result = sw.map(v => {
                return Object.assign({orderType: '销售出库单'}, v._doc)
            }).concat(sr.map(v => {
                return Object.assign({orderType: '销售退货单'}, v._doc)
            })).sort((a, b) => {
                if (moment(a.dateTime).isBefore(b.dateTime)) {
                    return -1
                } else if (moment(a.dateTime).isAfter(b.dateTime)) {
                    return 1
                } else {
                    return 0
                }
            })
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
async function rankingSalesReport(req, res, next) {
    L('Calling API salesReport.rankingSalesReport', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else {
            let type = data.type
            delete data.type
            let sw = type !== '销售退货' ? await SalesWarehouse.find(data) : []
            let sr = type !== '销售出库' ? await SalesReturn.find(data) : []
            let result = sw.map(v => {
                return Object.assign({orderType: '销售出库单'}, v._doc)
            }).concat(sr.map(v => {
                return Object.assign({orderType: '销售退货单'}, v._doc)
            }))
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
