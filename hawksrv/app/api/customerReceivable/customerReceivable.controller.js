const errors = require('@lib/errors');
const L = require('debug')('app:api');
const SalesOrder = require('../salesOrder/salesOrder.model');
const SalesReturn = require('../salesReturn/salesReturn.model');
const PaymentRegistration = require('../paymentRegistration/paymentRegistration.model');
const RefundRegistration = require('../refundRegistration/refundRegistration.model');
const pushMsg = require('@notification/notification.controller').pushMsg;

module.exports = {
    query
};

async function query(req, res, next) {
    L('Calling API CustomerReceivable.query');

    try {
        let filter = {
            companyId: req.user.cid
        };
        const val = req.body
        let result = [];
        if (val.id) filter._id = val.id;
        if (val.name) filter.name = val.name;
        if (val.startTime || val.endTime) {
            let time = {}
            if (val.startTime) time['$gte'] = val.startTime
            if (val.endTime) time['$lte'] = val.endTime
            filter.createdAt = time;
        }
        filter.status = {$in: ['待审批', '已审批']}
        let filter1 = Object.assign({}, filter)
        filter1.status = '已审批'
        if (val.operator) {
            filter.operator = {$in: val.operator};
            filter1.creator = {$in: val.operator};
        }
        let sList = await SalesOrder.find(filter1);
        let reList = await SalesReturn.find(filter1);
        let pList = await PaymentRegistration.find(filter);
        let rList = await RefundRegistration.find(filter);
        let setList = async (list, type) => {
            list.forEach(async v => {
                let isPush = true
                result.forEach(async item => {
                    if (item.name === v.name) {
                        isPush = false
                        if (type === 'sales') {
                            item.sales = parseFloat(item.sales) + parseFloat(v.allPrice)
                            await item.salesList.push(v)
                        } else if (type === 'return') {
                            item.return = parseFloat(item.return) + parseFloat(v.allPrice)
                            await item.returnList.push(v)
                        } else if (type === 'payment') {
                            if (v.status === '已审批') item.payment = parseFloat(item.payment) + parseFloat(v.receivable)
                            await item.paymentList.push(v)
                        } else if (type === 'refund') {
                            if (v.status === '已审批') item.refund = parseFloat(item.refund) + parseFloat(v.receivable)
                            await item.refundList.push(v)
                        }
                    }
                })
                if (isPush) {
                    await result.push({
                        name: v.name,
                        sales: type === 'sales' ? v.allPrice : 0,
                        return: type === 'return' ? v.allPrice : 0,
                        payment: type === 'payment' && v.status === '已审批' ? v.receivable : 0,
                        refund: type === 'refund' && v.status === '已审批' ? v.receivable : 0,
                        salesList: type === 'sales' ? [v] : [],
                        returnList: type === 'return' ? [v] : [],
                        paymentList: type === 'payment' ? [v] : [],
                        refundList: type === 'refund' ? [v] : []
                    })
                }
            })
        }
        setList(sList,'sales')
        setList(reList,'return')
        setList(pList,'payment')
        setList(rList,'refund')
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
