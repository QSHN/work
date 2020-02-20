const errors = require('@lib/errors');
const L = require('debug')('app:api');
const pushMsg = require('../message/message.controller').pushMsg;
const moment = require('moment');

const PurchaseWarehouse = require('../purchaseWarehouse/purchaseWarehouse.model');
const PurchaseReturn = require('../purchaseReturn/purchaseReturn.model');
const PurchaseOrder = require('../purchaseOrder/purchaseOrder.model');

module.exports = {
    detailPurchaseReport,
    summaryPurchaseReport,
    trackingPurchaseReport
};

async function detailPurchaseReport(req, res, next) {
    L('Calling API purchaseReport.detailPurchaseReport', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else {
            let type = data.type
            delete data.type
            let pw = type !== '采购退货' ? await PurchaseWarehouse.find(data) : []
            let pr = type !== '采购入库' ? await PurchaseReturn.find(data) : []
            let result = pw.map(v => {
                return Object.assign({orderType: '采购入库单'}, v._doc)
            }).concat(pr.map(v => {
                return Object.assign({orderType: '采购退货单'}, v._doc)
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

async function summaryPurchaseReport(req, res, next) {
    L('Calling API purchaseReport.summaryPurchaseReport', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else {
            let type = data.type
            delete data.type
            let pw = type !== '采购退货' ? await PurchaseWarehouse.find(data) : []
            let pr = type !== '采购入库' ? await PurchaseReturn.find(data) : []
            let result = pw.map(v => {
                return Object.assign({orderType: '采购入库单'}, v._doc)
            }).concat(pr.map(v => {
                return Object.assign({orderType: '采购退货单'}, v._doc)
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

async function trackingPurchaseReport(req, res, next) {
    L('Calling API purchaseReport.trackingPurchaseReport', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else {
            let result = await PurchaseOrder.find(data).sort({dateTime: -1})
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}


