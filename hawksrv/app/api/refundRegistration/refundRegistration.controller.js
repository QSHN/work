const errors = require('@lib/errors');
const L = require('debug')('app:api');
const RefundRegistration = require('./refundRegistration.model');
// const finance = require('../finance/finance.controller').add;
const pushMsg = require('@notification/notification.controller').pushMsg;

module.exports = {
    getById,
    create,
    query,
    update,
    deleteRefundRegistration
};

function dateToString(date){
    var year = date.getFullYear();
    var month =(date.getMonth() + 1).toString();
    var day = (date.getDate()).toString();
    if (month.length == 1) {
        month = "0" + month;
    }
    if (day.length == 1) {
        day = "0" + day;
    }
    var dateTime = year + "-" + month + "-" + day;
    return dateTime;
}

async function create(req, res, next) {
    L('Calling API RefundRegistration.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body;
        obj.companyId = companyId;
        obj.creator = req.user.sub;
        let apply = await RefundRegistration.create(obj);
        if (obj.approver) {
            obj.approver.forEach(v => {
                pushMsg({
                    userId: v.uid,
                    category: '退款登记',
                    content: `亲，您${req.user.sub !== v.uid ? '的下属' : ''}提交了退款登记，请尽快审批`,
                    title: '退款登记',
                    applyId: apply._id
                });
            })
        }
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
async function getById(req, res, next) {
    L('Calling API RefundRegistration.getById', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid RefundRegistration id'));
        return;
    }
    try {
        let result = await RefundRegistration.findById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function query(req, res, next) {
    L('Calling API RefundRegistration.query');

    try {
        let filter = {
            companyId: req.user.cid
        };
        const val = req.body
        let result = [];
        if (val.id) filter._id = val.id;
        if (val.status) filter.status = val.status;
        if (val.name) filter.name = val.name;
        if (val.coding) filter.coding = val.coding;
        if (val.paymentType) filter.paymentType = val.paymentType;
        if (val.operator) filter.operator = {$in: val.operator};
        if (val.creator) filter.creator = {$in: val.creator};
        if (val.startTime || val.endTime) {
            let time = {}
            if (val.startTime) time['$gte'] = val.startTime
            if (val.endTime) time['$lte'] = val.endTime
            filter.createdAt = time;
        }
        if (val.page && val.limit) {
            result = await RefundRegistration.find(filter).sort({createdAt: -1})
                .limit(parseInt(val.limit))
                .skip(val.limit * (val.page - 1));
        } else {
            result = await RefundRegistration.find(filter);
        }
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function update(req, res, next) {
    L('Calling API RefundRegistration.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body
        let _id = obj._id
        delete obj._id
        if (obj.status === '已审批') {
            let financeData = obj.finance
            pushMsg({
                userId: financeData.lister,
                category: '退款登记',
                content: `亲，您有一张退款登记单需要录入到财务系统，请尽快查看`,
                title: '退款登记',
                applyId: _id
            })
            delete obj.finance
            // finance({
            //     body:{
            //         //金额
            //         amount: obj.receivable,
            //         code:"Z",          //代码
            //         payment:"退款登记", //类别
            //         date: dateToString(new Date()), //日期
            //         photo: [],      //图片
            //         //经办人
            //         agent: obj.operator,
            //         codeType: "Z",
            //         category: '财务审批',
            //         lister: financeData.lister, // 制表人
            //         reviewer: financeData.reviewer, // 审核人
            //         approver: financeData.approver, // 审批人
            //         bookkeeper: financeData.bookkeeper,// 出纳人
            //         status: '待审核',
            //         summary: obj.des || ''
            //     },
            //     user:{
            //         cid: companyId
            //     }
            // });
        }
        await RefundRegistration.update({_id, companyId}, obj)
        if (obj.status !== '待审批') {
            pushMsg({
                userId: obj.creator,
                category: "退款登记",
                content: `您的退款登记${obj.status === '已审批' ? '已审批' : '被驳回'}`,
                title: "退款登记审批结果",
                applyId: _id,
            });
        }
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function deleteRefundRegistration(req, res, next) {
    L('Calling API deleteRefundRegistration.delete', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid RefundRegistration id'));
        return;
    }
    try {
        await RefundRegistration.deleteOne({_id: req.params.id})
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
