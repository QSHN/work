const errors = require('@lib/errors');
const L = require('debug')('app:api');
const Purchase = require('./purchase.model');
const Warehouse = require('../warehouse/warehouse.model')
// const finance = require('../finance/finance.controller').add;
const pushMsg = require('@notification/notification.controller').pushMsg;

module.exports = {
    getById,
    create,
    query,
    update,
    deletePurchase
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
    L('Calling API Purchase.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body;
        obj.companyId = companyId;
        obj.creator = req.user.sub;
        let apply = await Purchase.create(obj);
        if (obj.approver) {
            obj.approver.forEach(v => {
                pushMsg({
                    userId: v.uid,
                    category: '进货单',
                    content: `亲，您${req.user.sub !== v.uid ? '的下属' : ''}提交了进货单，请尽快审批`,
                    title: '进货单',
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
    L('Calling API Purchase.getById', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid Purchase id'));
        return;
    }
    try {
        let result = await Purchase.findById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function query(req, res, next) {
    L('Calling API Purchase.query');

    try {
        let filter = {
            companyId: req.user.cid
        };
        const val = req.body
        let result = [];
        if (val.id) filter._id = val.id;
        if (val.status) filter.status = val.status;
        if (val.warehouse) filter.warehouse = val.warehouse;
        if (val.coding) filter.coding = val.coding;
        if (val.creator) filter.creator = {$in: val.creator};
        if (val.startTime || val.endTime) {
            let time = {}
            if (val.startTime) time['$gte'] = val.startTime
            if (val.endTime) time['$lte'] = val.endTime
            filter.createdAt = time;
        }
        if (val.page && val.limit) {
            result = await Purchase.find(filter).sort({createdAt: -1})
                .limit(parseInt(val.limit))
                .skip(val.limit * (val.page - 1));
        } else {
            result = await Purchase.find(filter);
        }
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function update(req, res, next) {
    L('Calling API Purchase.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body
        let _id = obj._id
        delete obj._id
        if (obj.status === '已审批') {
            let commodity = obj.commodity
            let wData = await Warehouse.findOne({ companyId })
            wData.warehouse.forEach(v => {
                if (v.name == obj.warehouse) {
                    commodity.forEach(v1 => {
                        let isUpdate = false
                        v.commodity.forEach(v2 => {
                            if (v1.commodity._id === v2.commodity._id) {
                                isUpdate = true
                                v2.realNumber = parseInt(v2.realNumber) +  v1.number
                            }
                        })
                        if (!isUpdate) {
                            v.commodity.push({
                                commodity: v1.commodity,
                                realNumber: v1.number
                            })
                        }
                    })
                }
            })
            wData.save();

            let financeData = obj.finance
            pushMsg({
                userId: financeData.lister,
                category: '进货单',
                content: `亲，您有一张进货单需要录入到财务系统，请尽快查看`,
                title: '进货单',
                applyId: _id
            })
            delete obj.finance
            // finance({
            //     body:{
            //         //金额
            //         amount: obj.allPrice,
            //         code:"Z",          //代码
            //         payment:"进货单",  //类别
            //         date: dateToString(new Date()), //日期
            //         photo: [],      //图片
            //         //经办人
            //         agent: obj.operator,
            //         codeType: "Z",
            //         category: '进货单',
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
        await Purchase.update({_id, companyId}, obj)
        if (obj.status !== '待审批') {
            pushMsg({
                userId: obj.creator,
                category: "进货单",
                content: `您的进货单${obj.status === '已审批' ? '已审批' : '被驳回'}`,
                title: "进货单审批结果",
                applyId: _id,
            });
        }
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function deletePurchase(req, res, next) {
    L('Calling API deletePurchase.delete', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid Purchase id'));
        return;
    }
    try {
        await Purchase.deleteOne({_id: req.params.id})
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
