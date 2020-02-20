const errors = require('@lib/errors');
const L = require('debug')('app:api');
const User = require('@user/user.model');
const paymentmgr = require('./paymentmgr.model');
const pushMsg = require('@notification/notification.controller').pushMsg;
// const finance = require('../finance/finance.controller').add;

module.exports = {
    create,
    query,
    getById,
    update,
    mysponsorquery,
    mysenderquery,
    noreadmysenderquery,
    updatemysender
};

const filteringItems = '-__v -updatedAt -companyId';

async function create(req, res, next) {
    L('Calling API paymentmgr.create', req.body);

    try {
        let obj = req.body;
        let applicant = req.user.sub;
        let companyId = req.user.cid;
        obj.companyId = companyId;
        obj.applicant = applicant;
        let apply = await paymentmgr.create(obj);
        let myuser = await User.findById(applicant);
        for (var i = 0;i < obj.approver.length;i ++){

            pushMsg({
                applyId: apply._id,
                userId:obj.approver[i].uid,
                category:"付款",
                content: myuser.name+"向您提交付款申请",
                title:myuser.name+"给您提交付款",
            });
        }
        obj.sendover.forEach((v) => {
            pushMsg({
                userId: v,
                category: "付款",
                content: `${myuser.name}提交了付款申请`,
                title: `${myuser.name}提交了付款申请`,
                applyId: apply._id,
            });
        });

        // apply.notify();
        res.status(200).end();

    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

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

async function getById(req, res, next) {
    L('Calling API paymentmgr.getById', req.params.id);

    try {
        let aId = req.params.id;

        if (!aId) {
            throw new Error('invalid parameter for API applicaton.getById');
        }

        let a = await paymentmgr.findById(aId, filteringItems);
        res.status(200).json(a);

    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function query(req, res, next) {
    L('Calling API application.query', req.query);

    try {
        let filters = JSON.parse(req.query.q);

        if (filters.createdBefore || filters.createdAfter) {
            filters.createdAt = {};

            if (filters.createdAfter) {
                filters.createdAt.$gte = new Date(parseInt(filters.createdAfter));
                delete filters.createdAfter;
            }

            if (filters.createdBefore) {
                filters.createdAt.$lte = new Date(parseInt(filters.createdBefore));
                delete filters.createdBefore;
            }
        }

        filters.companyId = req.user.cid;

        filters["approver.uid"] = req.user.sub;

        let result = await paymentmgr.find(filters, filteringItems).sort({createdAt:-1});

        res.status(200).json(result);

    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function mysponsorquery(req, res, next) {
    L('Calling API application.query', req.query);

    try {
        let filters = JSON.parse(req.query.q);

        if (filters.createdBefore || filters.createdAfter) {
            filters.createdAt = {};

            if (filters.createdAfter) {
                filters.createdAt.$gte = new Date(parseInt(filters.createdAfter));
                delete filters.createdAfter;
            }

            if (filters.createdBefore) {
                filters.createdAt.$lte = new Date(parseInt(filters.createdBefore));
                delete filters.createdBefore;
            }
        }

        filters.companyId = req.user.cid;
        filters.applicant = req.user.sub;

        let result = await paymentmgr.find(filters, filteringItems).sort({createdAt:-1});

        res.status(200).json(result);

    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}


async function mysenderquery(req, res, next) {
    L('Calling API application.query', req.query);

    try {
        let filters = JSON.parse(req.query.q);

        if (filters.createdBefore || filters.createdAfter) {
            filters.createdAt = {};

            if (filters.createdAfter) {
                filters.createdAt.$gte = new Date(parseInt(filters.createdAfter));
                delete filters.createdAfter;
            }

            if (filters.createdBefore) {
                filters.createdAt.$lte = new Date(parseInt(filters.createdBefore));
                delete filters.createdBefore;
            }
        }

        filters.companyId = req.user.cid;
        filters.sendover = req.user.sub;

        let result = await paymentmgr.find(filters, filteringItems).sort({createdAt:-1});

        res.status(200).json(result);

    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function noreadmysenderquery(req, res, next) {
    L('Calling API application.query', req.query);

    try {
        let filters = JSON.parse(req.query.q);

        if (filters.createdBefore || filters.createdAfter) {
            filters.createdAt = {};

            if (filters.createdAfter) {
                filters.createdAt.$gte = new Date(parseInt(filters.createdAfter));
                delete filters.createdAfter;
            }

            if (filters.createdBefore) {
                filters.createdAt.$lte = new Date(parseInt(filters.createdBefore));
                delete filters.createdBefore;
            }
        }

        filters.companyId = req.user.cid;
        filters.sendover = req.user.sub;

        let result = await paymentmgr.find(filters, filteringItems).sort({createdAt:-1});

        res.status(200).json(result);

    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}


async function update(req, res, next) {
    L('Calling API paymentmgr.update', req.params.id, req.body);
    let aId = req.params.id;

    if (!aId) {
        throw new Error('invalid parameter for API paymentmgr.update');
    }

    try {
        let data = req.body
        let financeData
        if (data.status == "审批通过") {
            financeData = {
                lister: data.finance.lister
                // reviewer: data.finance.reviewer,
                // approver: data.finance.approver,
                // bookkeeper: data.finance.bookkeeper
            }
            delete data.finance
        }

        let a = await paymentmgr.findByIdAndUpdate(aId, data, {new: true});

        pushMsg({
            userId:a["applicant"],
            category:"付款",
            content: `你的付款申请${a["status"] == "审批通过" ? '已通过' : '被拒绝'}`,
            title:"付款提醒通知",
            applyId: a._id,
        });

        if (a["status"] == "审批通过") {
            pushMsg({
                userId: financeData.lister,
                category: '付款',
                content: `亲，您有一张付款申请单需要录入到财务系统，请尽快查看`,
                title: '付款申请',
                applyId: a._id
            })
            // let date = dateToString(new Date());
            //
            // finance({
            //     body:{
            //         //金额
            //         amount:a["allmoney"],
            //         //制表人
            //         // lister:a["approver"][0]["uid"],
            //         //代码
            //         code:"Z",
            //         //类别
            //         payment:"付款",
            //         //日期
            //         date:date,
            //         //图片
            //         photo:a["photo"],
            //         //经办人
            //         agent:a["applicant"],
            //         codeType: "Z",
            //         category: '财务审批',
            //
            //         lister: financeData.lister, // 制表人
            //         reviewer: financeData.reviewer, // 审核人
            //         approver: financeData.approver, // 审批人
            //         bookkeeper: financeData.bookkeeper,// 出纳人
            //
            //         //状态
            //         status: '待审核',
            //         //摘要
            //         summary: ''
            //     },
            //     user:{
            //         cid:a["companyId"]
            //     }
            // });
        }

        // a.notify();
        res.status(200).json(a);

    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function updatemysender(req, res, next) {
    L('Calling API paymentmgr.updatemysender', req.params.id, req.body);
    let aId = req.params.id;

    if (!aId) {
        throw new Error('invalid parameter for API paymentmgr.updatemysender');
    }

    try {
        let a = await paymentmgr.findByIdAndUpdate(aId, req.body);
        res.status(200).json(a);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
