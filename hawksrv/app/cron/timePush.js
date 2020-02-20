const L = require('debug')('app:cron');
var CronJob = require('cron').CronJob;
const {pushMsg} = require('../api/notification/notification.controller')

const Company = require('@company/company.model');
const Journalmgr = require('../api/journalmgr/journalmgr.model');
const Reportdata = require('../api/reportdata/reportdata.model');
const User = require('../api/user/user.model');
const Journalsettemplate = require('../api/journalset/journalsettemplate.model')
// const Transaction = require('../api/finance/transaction.model')
const Commodity = require('../api/commodity/commodity.model')
const Warehouse = require('../api/warehouse/warehouse.model')
const CommodityNotification = require('../api/commodityNotification/commodityNotification.model')
const ClientNotification = require('../api/clientNotification/clientNotification.model')
const SalesOrder = require('../api/salesOrder/salesOrder.model')
const SalesReturn = require('../api/salesReturn/salesReturn.model')
const PaymentRegistration = require('../api/paymentRegistration/paymentRegistration.model')
const RefundRegistration = require('../api/refundRegistration/refundRegistration.model')
const Purchase = require('../api/purchase/purchase.model')
const moment = require('moment');

let attendanceCrons = {}
let transactionCrons = []
let listD = function (d) {
    return d.sub.slice(0).concat(d.sub.reduce((accum, s) => {
        return accum.concat(listD(s))
    }, []));
}
let userDepartment = function (uid,company) {
    let dList = listD(company.organization).filter(d => d.employees.includes(uid.toString()));
    return dList.length > 0 ? dList[0] : null;
}
// 假日
const isHoliday = (holidays, date) => {
    let ret = false;
    holidays.forEach(h => {
        let holiday = new Date(h);
        if (holiday.toHawkDateString() == date.toHawkDateString()) {
            ret = true;
        }
    })
    return ret;
}

// return
async function report() {
    // 汇报未读消息推送
    Reportdata.find((err, reports) => {
        let push = new Map()
        reports.map(report => {
            if (report.status === '未读' && report.approver.length) {
                report.approver.forEach((uid) => {
                    let unread = push.get(uid) || 0
                    push.set(uid, unread + 1)
                })
            }
        })
        let crons = []
        for (let [key, value] of push) {
            crons.push(createCron(toCronTime(toDate('22:00',0), 'day'), {
                userId: key,
                category: '汇报',
                content: `亲，您还有${value}条汇报未读`,
                title: '汇报',
            }))
        }

        attendanceCrons['report'] = crons
    })
}

async function Journal() {
    // 日报未读消息推送
    let start = new Date(), end = new Date();
    start.setHours(0);
    start.setMinutes(0);
    start.setSeconds(0);
    end.setHours(23);
    end.setMinutes(59);
    end.setSeconds(59);
    let filters = {
        createdAt: {
            $gte: start,
            $lte: end
        }
    }
    Journalmgr.find(filters, (err, journalmgrs) => {
        let push = new Map()
        journalmgrs.map(journal => {
            if (journal.status === '未读' && journal.approver.length) {
                journal.approver.forEach((uid) => {
                    let unread = push.get(uid) || 0
                    push.set(uid, unread + 1)
                })
            }
        })
        let crons = []
        for (let [key, value] of push) {
            crons.push(createCron(toCronTime(toDate('22:00', 0), 'day'), {
                userId: key,
                category: '日报',
                content: `亲，您还有${value}条日报未读`,
                title: '日报',
            }))
        }

        attendanceCrons['Journal'] = crons
    })
}

async function JournalNoSubmit () {
    // 不提交日报
    Company.find((err, companys) => {
        companys.forEach(async company => {
            if (!isHoliday(company.holidays, new Date())) {
                let crons = []
                // 不是节假日
                let users = await User.find({companyId: company._id});
                users.map(async v => {
                    let department = userDepartment(v._id, company)
                    if(!department)return

                    let template = await Journalsettemplate.findOne({department: department.departmentId})
                    if(!template)return

                    let startDate = '';
                    let endDate = '';
                    let now = moment().format("YYYY-MM-DD");
                    let endTime = ''

                    if (template.period == 'day') {
                        // 不是提交日
                        if (!template.days.filter((v) => v == new Date().getDay()).length) return
                        startDate = moment().format("YYYY-MM-DD");
                        endDate = moment().format("YYYY-MM-DD");
                        endTime = template.endTime
                    } else if(template.period == 'week') {
                        startDate = moment().day(template.startTimeOfWeek[0]).format("YYYY-MM-DD");
                        endDate = moment().day(template.endTimeOfWeek[0]).format("YYYY-MM-DD");
                        endTime = template.endTimeOfWeek[1]
                        if (moment(now).isBefore(startDate) || moment(now).isAfter(endDate)) return
                    } else if(template.period == 'month') {
                        startDate = moment().format("YYYY-MM") + '-' + (template.startTimeOfMonth[0] < 10 ? '0' + template.startTimeOfMonth[0] : template.startTimeOfMonth[0]);
                        endDate = moment().format("YYYY-MM") + '-' + (template.endTimeOfMonth[0] < 10 ? '0' + template.endTimeOfMonth[0] : template.endTimeOfMonth[0]);
                        endTime = template.endTimeOfMonth[1]
                        if (moment(now).isBefore(startDate) || moment(now).isAfter(endDate)) return
                    }

                    let daily_list = await Journalmgr.find({
                        applicant: v._id,
                        rtype: "日报",
                        createdAt: {
                            $gte: new Date(startDate + ' 00:00:00'),
                            $lte: new Date(endDate + ' 23:59:59.999')
                        }
                    })
                    if (!daily_list.length) {
                        let time = template.remindTime || 0
                        crons.push(createCron(toCronTime(toDate(`${endTime < 10 ? '0' + endTime : endTime}:00`, -time), 'day'), {
                            userId: v._id,
                            category: '日报',
                            content: `亲，你今天的日报还没提交`,
                            title: '日报',
                        }))
                    }
                })
                attendanceCrons['Journal' + company._id] = crons
            }
        })
    })
}

async function attendance() {
    Company.find((err, companys) => {
        companys.forEach(company => {
            let cronData = []
            company.timeCards.forEach(tc => {
                if (tc.type != '上下班打卡') return
                let users = tc.owners
                let start = []
                let end = []
                let crons = []
                let week = new Date().getDay();
                week = week === 0 ? 6 : week - 1;
                if (tc.workDays[week] && !isHoliday(company.holidays, new Date())) {
                    tc.workTimes.forEach(wt => {
                        start.push(wt.start)
                        end.push(wt.end)
                        users.forEach(user => {
                            crons.push(createCron(toCronTime(toDate(wt.start, -10), 'day'), {
                                userId: user,
                                category: "考勤",
                                content: '亲，您还有10分钟就要上班了，请记得打卡',
                                title: "考勤",
                            }))
                            crons.push(createCron(toCronTime(toDate(wt.end, 0), 'day'), {
                                userId: user,
                                category: "考勤",
                                content: '亲，您的下班时间到了，请记得打卡',
                                title: "考勤",
                            }))
                        })
                    })
                    cronData.push({timeCards: tc._id, crons, users, start, end})
                }
            });
            attendanceCrons[company._id] = cronData
        })
    })
}


function createCron(cronTime, msg) {
    // console.log(cronTime,msg)
    let job = new CronJob(cronTime, () => {
        L('pushMsg ' + cronTime + ' ' + msg.content);
        pushMsg(msg)
    });
    job.start()
    return job
}

function toCronTime(date, rule) {
    const W = date.getDay()
    const M = date.getMonth() + 1
    const D = date.getDate()
    const h = date.getHours()
    const m = date.getMinutes()
    const s = date.getSeconds()
    let timeArr
    if (rule == 'day') {
        timeArr = [s, m, h, '*', '*', '*']
    } else if (rule == 'month') {
        timeArr = [s, m, h, D, '*', '*']
    } else if (rule == 'Week') {
        timeArr = [s, m, h, D, M, '*']
    } else {
        timeArr = [s, m, h, D, M, W]
    }
    let str = timeArr.join(' ')
    return str
}

// 08:00时间转换Date对象 m分钟的差值
function toDate(timepoint, m, date) {
    let time = timepoint.split(':');
    let d = date ? new Date(date.getTime()) : new Date();
    d.setHours(parseInt(time[0]));
    d.setMinutes(parseInt(time[1]));
    d.setSeconds(parseInt(time[2] ? time[2] : '0'));
    d.setMilliseconds(0);
    d.setMinutes(d.getMinutes() + m)
    return d;
}

function clearCron(){
    for (let key in attendanceCrons) {
        if (attendanceCrons[key].crons) {
            attendanceCrons[key].crons.forEach(job=>job.stop());
        } else {
            attendanceCrons[key].forEach(item=>item.crons.forEach(job=>job.stop()));
        }
    }
    transactionCrons.forEach(item=>item.stop())
}

// async function finance() {
//     let data = {
//         date: moment().format("YYYY-MM-DD"),
//         status:{$ne:'已完成'}
//     }
//     let list = await Transaction.find(data)
//     list.forEach(item=>{
//         transactionCrons.push(createCron('0 0 8 * * *',{
//             userId: item.lister,
//             category: "财务管理",
//             content: '您今天有一笔'+item.code+'账款需要处理，再不处理就过期了，请查看',
//             title: "账款处理",
//         }))
//         if(item.agent && item.lister != item.agent){
//             transactionCrons.push(createCron('0 0 8 * * *',{
//                 userId: item.agent,
//                 category: "财务管理",
//                 content: '您今天有一笔'+item.code+'账款需要处理，再不处理就过期了，请查看',
//                 title: "账款处理",
//             }))
//         }
//     })
// }

async function commodityNotification() {
    Company.find((err, companys) => {
        companys.forEach(async company => {
            let commodity = await Commodity.find({companyId: company._id})
            let wData = await Warehouse.findOne({companyId: company._id})
            let note = await CommodityNotification.findOne({companyId: company._id})
            let users = await User.find({companyId: company._id});
            let content = ``
            let crons = []

            if (!wData || wData.warehouse.length === 0) return
            if (note && note._id && note.notification.length === 0) return
            commodity.forEach(async v => {
                let number = 0
                let unit = ''
                wData.warehouse.forEach(w => {
                    w.commodity.forEach(c => {
                        if (c.commodity._id  === v._id.toString()) {
                            number += parseInt(c.realNumber)
                            unit = c.commodity.unit
                        }
                    })
                })
                if (v.produced && v.expiration && v.dateUnit && number > 0) {
                    let end = ''
                    let start = moment(v.produced)
                    if (v.dateUnit === '天') {
                        end = start.add(v.expiration, 'days');
                    } else if (v.dateUnit === '月') {
                        end = start.add(v.expiration, 'months');
                    } else if  (v.dateUnit === '年') {
                        end = start.add(v.expiration, 'years');
                    }
                    if (end) {
                        if (moment().isAfter(end)) {
                            content += `商品：${v.name}<br/>生产日期：${start.format("YYYY-MM-DD")}<br/>状态：该商品已过期<br/>库存：${number + unit}<br/><br/>`
                        } else {
                            let time = moment(end).subtract( v.noteTime || 10, 'days')
                            if (moment().isAfter(time)) {
                                let day = moment(end).toNow(true);
                                content += `商品：${v.name}<br/>生产日期：${start.format("YYYY-MM-DD")}<br/>状态：该商品离过期还有${day}<br/>库存：${number + unit}<br/><br/>`
                            }
                        }
                    }
                }
            })
            if (content.length) {
                let nList = note && note.notification || users.filter(u => u.superadmin).map(u => u._id)
                nList.forEach(n => {
                    crons.push(createCron(toCronTime(toDate('6:00', 0), 'day'), {
                        userId: n,
                        category: '商品过期通知',
                        content: content,
                        title: '商品过期通知',
                    }))
                })
                attendanceCrons['commodityNotification' + company._id] = crons
            }
        })
    })
}

const customerReceivable = async (cid) => {
    let filter = {
        companyId: cid
    };
    let filter1 = Object.assign({}, filter)
    let result = [];
    filter.status = {$in: ['待审批', '已审批']}
    filter1.status = '已审批'
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
    return await result
}

async function clientNotification() {
    Company.find((err, companys) => {
        companys.forEach(async company => {
            let receivable = await customerReceivable(company._id)
            let note = await ClientNotification.findOne({companyId: company._id})
            let users = await User.find({companyId: company._id});
            let content = ``
            let crons = []

            if (note && note._id && note.notification.length === 0) return
            receivable.forEach(v => {
                let s = v.sales - (v.refund > v['return'] ? v.refund : v['return']) - v.payment
                let z = v['return'] - v.refund
                if (s > 0 || z > 0) {
                    content += `客户：${v.name}<br/>`
                    if (s > 0)  content += `应收账款：${s}元<br/>`
                    if (z > 0)  content += `应付欠款：${z}元<br/>`
                }
            })

            if (content.length) {
                let nList = note && note.notification || users.filter(u => u.superadmin).map(u => u._id)
                nList.forEach(n => {
                    crons.push(createCron(toCronTime(toDate('6:00', 0), 'day'), {
                        userId: n,
                        category: '客户欠费通知',
                        content: content,
                        title: '客户欠费通知',
                    }))
                })
                attendanceCrons['clientNotification' + company._id] = crons
            }
        })
    })
}

// async function operationalReport() {
//     Company.find((err, companys) => {
//         companys.forEach(async company => {
//             let users = await User.find({companyId: company._id});
//             let admin = users.filter(u => u.superadmin).map(u => u._id)
//             let crons = []
//             let time = moment().subtract(1, 'days')
//             let finance = await Transaction.find({
//                 companyId: company._id,
//                 createdAt: time.format("YYYY-MM-DD"),
//                 status: '已完成'
//             })
//             let typesZ = ['Z', 'YF', 'GZ'];
//             let typesS = ['S', 'YS'];
//             let zhichu = finance.reduce((accum, r) => accum += (typesZ.find(t => r.code.startsWith(t)) ? r.amount : 0), 0)
//             let shouru = finance.reduce((accum, r) => accum += (typesS.find(t => r.code.startsWith(t)) ? r.amount : 0), 0)
//
//             let purchase = await Purchase.find({
//                 companyId: company._id,
//                 date: time.format("YYYY-MM-DD"),
//                 status: '已审批'
//             })
//             let sale = await SalesOrder.find({
//                 companyId: company._id,
//                 date: time.format("YYYY-MM-DD"),
//                 status: '已审批'
//             })
//
//             let content = `
//                 昨日经营报告 ${time.format('YY年MM月DD日')}<br/>
//                 收入：￥${shouru.toFixed(2)}<br/>
//                 支出：￥${zhichu.toFixed(2)}<br/>
//                 进货：${purchase.length}单，￥${purchase.reduce((accum, r) => accum += (r.allPrice ? parseFloat(r.allPrice) : 0), 0).toFixed(2)}<br/>
//                 销售订单：${sale.length}单，￥${sale.reduce((accum, r) => accum += (r.receivable ? parseFloat(r.receivable) : 0), 0).toFixed(2)}<br/>
//                 发货：${sale.filter(s => s.shippingStatus).length}单，￥${sale.filter(s => s.shippingStatus).reduce((accum, r) => accum += (r.receivable ? parseFloat(r.receivable) : 0), 0).toFixed(2)}
//             `
//
//             crons.push(createCron(toCronTime(toDate('6:01', 0), 'day'), {
//                 userId: admin,
//                 category: '昨日经营报告',
//                 content: content,
//                 title: '昨日经营报告',
//             }))
//             attendanceCrons['operationalReport' + company._id] = crons
//         })
//     })
// }

// 每天三点 重新计算
new CronJob('0 0 3 * * *', () => {
    // 清除历史定时器
    clearCron()
    // 重新扫描任务
    attendance()
    Journal()
    report()
    JournalNoSubmit()
    // finance()
    commodityNotification()
    clientNotification()
    // operationalReport()
}).start();

attendance()
Journal()
report()
JournalNoSubmit()
// finance()
commodityNotification()
clientNotification()
// operationalReport()
