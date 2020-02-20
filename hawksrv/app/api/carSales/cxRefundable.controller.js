const errors = require('@lib/errors');
const L = require('debug')('app:api');
const CxRefundable = require('./cxRefundable.model');
const CxInventory = require('./cxInventory.model');
// const finance = require('../finance/finance.controller').add;
const pushMsg = require('@notification/notification.controller').pushMsg;

module.exports = {
    getById,
    create,
    query,
    update,
    deleteRefundable
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
    L('Calling API CxRefundable.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body;
        obj.companyId = companyId;
        obj.creator = req.user.sub;
        let apply = await CxRefundable.create(obj);
        if (obj.approver) {
            obj.approver.forEach(v => {
                pushMsg({
                    userId: v.uid,
                    category: '退换货再售',
                    content: `亲，您${req.user.sub !== v.uid ? '的下属' : ''}提交了退换货再售，请尽快审批`,
                    title: '退换货再售',
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
    L('Calling API CxRefundable.getById', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid CxRefundable id'));
        return;
    }
    try {
        let result = await CxRefundable.findById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function query(req, res, next) {
    L('Calling API CxRefundable.query');

    try {
        let filter = {
            companyId: req.user.cid
        };
        const val = req.body
        let result = [];
        if (val.id) filter._id = val.id;
        if (val.status) filter.status = val.status;
        if (val.name) filter.name = val.name;
        if (val.numberPlate) filter.numberPlate = val.numberPlate;
        if (val.coding) filter.coding = val.coding;
        if (val.creator) filter.creator = {$in: val.creator};
        if (val.startTime || val.endTime) {
            let time = {}
            if (val.startTime) time['$gte'] = val.startTime
            if (val.endTime) time['$lte'] = val.endTime
            filter.createdAt = time;
        }
        if (val.page && val.limit) {
            result = await CxRefundable.find(filter).sort({createdAt: -1})
                .limit(parseInt(val.limit))
                .skip(val.limit * (val.page - 1));
        } else {
            result = await CxRefundable.find(filter);
        }
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function update(req, res, next) {
    L('Calling API CxRefundable.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body
        let _id = obj._id
        delete obj._id
        if (obj.status === '已审批') {
            let commodity = obj.commodity
            let iData = await CxInventory.findOne({ companyId })
            iData.inventory.forEach(v => {
                if (v.numberPlate == obj.numberPlate) {
                    commodity.forEach(v1 => {
                        let isUpdate = false
                        v.commodity.forEach(v2 => {
                            if (v1.commodity._id === v2.commodity._id) {
                                isUpdate = true
                                let number = parseInt(v1.swapNumber)
                                if (parseInt(v2.realNumber) < number) {
                                    throw new Error(`库存不足，无法换货，目前${v2.commodity.name}库存：${v2.realNumber}，换货数量：${number}`);
                                } else {
                                    v2.realNumber = parseInt(v2.realNumber) + parseInt(v1.returnNumber)
                                    v2.returnNumber = parseInt(v2.returnNumber) + parseInt(v1.returnNumber)
                                    v2.swapNumber = parseInt(v2.swapNumber) + parseInt(v1.swapNumber)
                                }
                            }
                        })
                        if (!isUpdate) {
                            throw new Error(`找不到该商品，无法退换货`);
                        }
                    })
                }
            })
            iData.save();

            if (obj.allPrice > 0) {
                pushMsg({
                    userId: obj.finance.lister,
                    category: '退换货再销',
                    content: `亲，您有一张退换货再销单需要录入到财务系统，请尽快查看`,
                    title: '退换货再销',
                    applyId: _id
                })
                // let financeData = {
                //     lister: obj.finance.lister,
                //     reviewer: obj.finance.reviewer,
                //     approver: obj.finance.approver,
                //     bookkeeper: obj.finance.bookkeeper
                // }
                // delete obj.finance
                // finance({
                //     body:{
                //         //金额
                //         amount: obj.allPrice,
                //         code:"Z",          //代码
                //         payment:"退换货再销", //类别
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
        }
        await CxRefundable.update({_id, companyId}, obj)
        if (obj.status !== '待审批') {
            pushMsg({
                userId: obj.creator,
                category: "退换货再售",
                content: `您的退换货再售${obj.status === '已审批' ? '已审批' : '被驳回'}`,
                title: "退换货再售审批结果",
                applyId: _id,
            });
        }
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function deleteRefundable(req, res, next) {
    L('Calling API deleteCxRefundable.delete', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid CxRefundable id'));
        return;
    }
    try {
        await CxRefundable.deleteOne({_id: req.params.id})
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
