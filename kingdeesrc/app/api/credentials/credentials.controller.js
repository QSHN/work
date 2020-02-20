const errors = require('@lib/errors');
const L = require('debug')('app:api');
const NP = require('number-precision');
const moment = require('moment');

const Credentials = require('./credentials.model');
const ProofWords = require('../proofWords/proofWords.model');
const Subject = require('../subject/subject.model');
const SubjectType = require('../subject/subjectType.model');
const AccountSet = require('../accountSet/accountSet.model');
const Currency = require('../currency/currency.model');
const ExchangeRate = require('../exchangeRate/exchangeRate.model');
const ExchangeRateType = require('../exchangeRate/exchangeRateType.model');
const AutomaticTransfer = require('../automaticTransfer/automaticTransfer.model');
const Customer = require('../customer/customer.model');
const Department = require('../department/department.model');
const Clerk = require('../clerk/clerk.model');
const Supplier = require('../supplier/supplier.model');
const Cost = require('../cost/cost.model');
const BankAccount = require('../bankAccount/bankAccount.model');
const CashFlow = require('../cashFlow/cashFlow.model');
const pushMsg = require('../message/message.controller').pushMsg;
const DeleteCache = require('../credentialsCache/credentialsCache.controller').deleteCredentialsCache;

const updateParentsSubject = async (id, borrower, lender, accountingPeriod, accountingItem = []) => {
    let uData = await Subject.findOne({_id: id})
    let direction = uData.balance === '借方'
    if (uData.eachBalance && uData.eachBalance.length) {
        let isPush = true
        let lastEach = null
        uData.eachBalance.forEach((v, i) => {
            if (v.time === accountingPeriod) {
                v.borrower = NP.plus(v.borrower || 0, borrower || 0)
                v.lender = NP.plus(v.lender || 0, lender || 0)
                isPush = false
            }
            if (i === uData.eachBalance.length - 1) lastEach = v
        })
        if (isPush) {
            let beginningBalance = 0
            if (accountingPeriod.split('-')[1] == 1) {
                let balance = uData.eachYearBalance.find(b => b.time === (accountingPeriod.split('-')[0] - 1))
                if (direction) {
                    beginningBalance = NP.minus(NP.plus(balance && balance.beginningBalance || 0, balance && balance.borrower || 0), balance && balance.lender || 0)
                } else {
                    beginningBalance = NP.minus(NP.plus(balance && balance.beginningBalance || 0, balance && balance.lender || 0), balance && balance.borrower || 0)
                }
            } else {
                if (direction) {
                    beginningBalance = NP.minus(NP.plus(lastEach.beginningBalance || 0, lastEach.borrower || 0), lastEach.lender || 0)
                } else {
                    beginningBalance = NP.minus(NP.plus(lastEach.beginningBalance || 0, lastEach.lender || 0), lastEach.borrower || 0)
                }
            }
            uData.eachBalance.push({
                time: accountingPeriod,
                borrower: borrower || 0,
                lender: lender || 0,
                beginningBalance: beginningBalance
            })
        }
    } else {
        let beginningBalance = 0
        if (direction) {
            beginningBalance = NP.minus(NP.plus(uData.beginningBalance || 0, uData.yearBorrow || 0), uData.yearCredit || 0)
        } else {
            beginningBalance = NP.minus(NP.plus(uData.beginningBalance || 0, uData.yearCredit || 0), uData.yearBorrow || 0)
        }
        uData.eachBalance = [{
            time: accountingPeriod,
            borrower: borrower || 0,
            lender: lender || 0,
            beginningBalance: beginningBalance
        }]
    }
    uData.yearBorrow = NP.plus(borrower || 0, uData.yearBorrow || 0)
    uData.yearCredit = NP.plus(lender || 0, uData.yearCredit || 0)
    if (accountingItem.length) updateAccountingSubject(accountingItem, id, borrower, lender, accountingPeriod)
    await Subject.updateOne({_id: id}, uData)
}

const updateAccountingSubject = async (accountingItem, id, borrower, lender, accountingPeriod, isMinus = false) => {
    let sData = await Subject.findOne({_id: id})
    let type = accountingItem.map(v => v.type).join('_')
    if (sData.accountItem && sData.accountItem.join('_') === type) {
        let child = sData.child || []
        let code = accountingItem.map(v => v.code).join('_')
        let name = accountingItem.map(v => v.name).join('_')
        let direction = sData.balance === '借方'
        let index = child.findIndex(f => f.code === code && f.name === name && f.type === type)
        let uData = index >= 0 ? sData.child[index] : {
            code,
            name,
            type,
            yearBorrow: null,
            yearCredit: null,
            beginningBalance: null,
            initYearBorrow: null,
            initYearCredit: null,
            initBeginningBalance: null,
            initBRate: null,
            initYBRate: null,
            initYCRate: null,
            eachBalance: null,
            eachYearBalance: null
        }
        if (uData.eachBalance && uData.eachBalance.length) {
            let isPush = true
            let lastEach = null
            uData.eachBalance.forEach((v, i) => {
                if (v.time === accountingPeriod) {
                    v.borrower = NP[isMinus ? 'minus' : 'plus'](v.borrower || 0, borrower || 0)
                    v.lender = NP[isMinus ? 'minus' : 'plus'](v.lender || 0, lender || 0)
                    isPush = false
                }
                if (i === uData.eachBalance.length - 1) lastEach = v
            })
            if (isPush) {
                let beginningBalance = 0
                if (accountingPeriod.split('-')[1] == 1) {
                    let balance = uData.eachYearBalance.find(b => b.time === (accountingPeriod.split('-')[0] - 1))
                    if (direction) {
                        beginningBalance = NP.minus(NP.plus(balance && balance.beginningBalance || 0, balance && balance.borrower || 0), balance && balance.lender || 0)
                    } else {
                        beginningBalance = NP.minus(NP.plus(balance && balance.beginningBalance || 0, balance && balance.lender || 0), balance && balance.borrower || 0)
                    }
                } else {
                    if (direction) {
                        beginningBalance = NP.minus(NP.plus(lastEach.beginningBalance || 0, lastEach.borrower || 0), lastEach.lender || 0)
                    } else {
                        beginningBalance = NP.minus(NP.plus(lastEach.beginningBalance || 0, lastEach.lender || 0), lastEach.borrower || 0)
                    }
                }
                uData.eachBalance.push({
                    time: accountingPeriod,
                    borrower: borrower || 0,
                    lender: lender || 0,
                    beginningBalance: beginningBalance
                })
            }
        } else {
            let beginningBalance = 0
            if (direction) {
                beginningBalance = NP.minus(NP.plus(uData.beginningBalance || 0, uData.yearBorrow || 0), uData.yearCredit || 0)
            } else {
                beginningBalance = NP.minus(NP.plus(uData.beginningBalance || 0, uData.yearCredit || 0), uData.yearBorrow || 0)
            }
            uData.eachBalance = [{
                time: accountingPeriod,
                borrower: borrower || 0,
                lender: lender || 0,
                beginningBalance: beginningBalance
            }]
        }
        uData.yearBorrow = NP[isMinus ? 'minus' : 'plus'](borrower || 0, uData.yearBorrow || 0)
        uData.yearCredit = NP[isMinus ? 'minus' : 'plus'](lender || 0, uData.yearCredit || 0)
        if (index >= 0) {
            child.splice(index, 1, uData)
        } else {
            child.push(uData)
        }
        await Subject.updateOne({_id: id}, { $set: { child: child }})
    }
}

module.exports = {
    credentialsUpdate,
    credentialsListUpdate,
    credentialsQuery,
    credentialsDelete,
    queryLastInfo,
    credentialsPost,
    credentialsSubject,
    generalLedger,
    allAccounting,
    numberAccounting,
    dailyReport,
    abstractQuery,
    accountingItemBalance,
    accountingItemDetail,
    accountingItemSummary,
    accountingItemCombination,
    accountingItemSubject,
    finalTuning,
    finalTuningHistory,
    interest,
    carrForward,
    invoicing,
    automaticTransfer,
    moreColumn,
    credentialsUnPost,
    credentialsBroken
};

async function credentialsUpdate(req, res, next) {
    L('Calling API Credentials.credentialsUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.time) {
            next(new errors.BadRequest('日期必填'));
        } else if (!data.accountingPeriod) {
            next(new errors.BadRequest('会计期间必填'));
        } else if (!data.proofWordId) {
            next(new errors.BadRequest('凭证字id必填'));
        } else if (!data.certificateNumber) {
            next(new errors.BadRequest('凭证号必填'));
        } else if (!data.child.length) {
            next(new errors.BadRequest('凭证录入数据不能为空'));
        } else if (!data.businessDate) {
            next(new errors.BadRequest('业务日期必填'));
        } else {
            let updateSubject = async (list, isMinus, isAdd, cb) => {
                await list.forEach(async (v, i) => {
                    let sData = await Subject.findOne({
                        accountSetId: data.accountSetId,
                        code: v.subjectCode
                    })
                    let direction = sData.balance === '借方'
                    let accountingPeriod = data.accountingPeriod
                    if (isAdd) {
                        if (sData.eachBalance && sData.eachBalance.length) {
                            let isPush = true
                            let lastEach = null
                            sData.eachBalance.forEach((e, i1) => {
                                if (e.time === accountingPeriod) isPush = false
                                if (i1 === sData.eachBalance.length - 1) lastEach = e
                            })
                            if (isPush) {
                                let beginningBalance = 0
                                if (accountingPeriod.split('-')[1] == 1) {
                                    let balance = sData.eachYearBalance.find(b => b.time === (accountingPeriod.split('-')[0] - 1))
                                    if (direction) {
                                        beginningBalance = NP.minus(NP.plus(balance && balance.beginningBalance || 0, balance && balance.borrower || 0), balance && balance.lender || 0)
                                    } else {
                                        beginningBalance = NP.minus(NP.plus(balance && balance.beginningBalance || 0, balance && balance.lender || 0), balance && balance.borrower || 0)
                                    }
                                } else {
                                    if (direction) {
                                        beginningBalance = NP.minus(NP.plus(lastEach.beginningBalance || 0, lastEach.borrower || 0), lastEach.lender || 0)
                                    } else {
                                        beginningBalance = NP.minus(NP.plus(lastEach.beginningBalance || 0, lastEach.lender || 0), lastEach.borrower || 0)
                                    }
                                }
                                sData.eachBalance.push({
                                    time: accountingPeriod,
                                    borrower: 0,
                                    lender: 0,
                                    beginningBalance: beginningBalance
                                })
                            }
                        } else {
                            let beginningBalance = 0
                            if (direction) {
                                beginningBalance = NP.minus(NP.plus(sData.beginningBalance || 0, sData.yearBorrow || 0), sData.yearCredit || 0)
                            } else {
                                beginningBalance = NP.minus(NP.plus(sData.beginningBalance || 0, sData.yearCredit || 0), sData.yearBorrow || 0)
                            }
                            sData.eachBalance = [{
                                time: accountingPeriod,
                                borrower: 0,
                                lender: 0,
                                beginningBalance: beginningBalance
                            }]
                        }
                    }

                    // 科目余额
                    let balance = sData.subjectBalance !== null ? sData.subjectBalance : NP[direction ? 'minus' : 'plus'](NP[direction ? 'plus' : 'minus'](sData.beginningBalance || 0, sData.yearBorrow || 0), sData.yearCredit || 0)
                    if (v.borrower) {
                        balance = isMinus ? NP[direction ? 'minus' : 'plus'](balance, v.borrower) : NP[direction ? 'plus' : 'minus'](balance, v.borrower)
                    }
                    if (v.lender) {
                        balance = isMinus ? NP[direction ? 'plus' : 'minus'](balance, v.lender) : NP[direction ? 'minus' : 'plus'](balance, v.lender)
                    }
                    sData.subjectBalance = balance
                    if (isAdd && sData.parentId.length) {
                        for (let p = 0; p < sData.parentId.length; p++) {
                            await updateParentsSubject(sData.parentId[p], 0,0, accountingPeriod, v.accountingItem)
                        }
                    }
                    await Subject.updateOne({_id: sData._id}, sData)
                    if (v.accountingItem && v.accountingItem.length) {
                        await updateAccountingSubject(v.accountingItem, sData._id, 0, 0, accountingPeriod)
                    }
                    if (i === list.length - 1) {
                        if (cb) cb()
                    }
                })
            }
            if (data._id) {
                let _id = data._id
                delete data._id
                let oldData = await Credentials.findOne({_id})
                if (!oldData.invalid && data.invalid) {
                    // 正常 => 作废
                    await updateSubject(oldData.child, true)
                } else if (oldData.invalid && !data.invalid) {
                    // 反作废 => 正常
                    await updateSubject(data.child)
                } else if (!oldData.invalid && !data.invalid) {
                    // 正常 => 正常
                    await updateSubject(oldData.child, true, false, () => {
                        updateSubject(data.child)
                    })
                }
                await Credentials.updateOne({_id}, { $set: data })
                res.status(200).end();
            } else {
                let list = await Credentials.find({
                    accountSetId: data.accountSetId,
                    proofWordId: data.proofWordId,
                    certificateNumber: data.certificateNumber
                })
                if (list.length > 0) {
                    next(new errors.BadRequest('已存在该凭证号'));
                } else {
                    await updateSubject(data.child, false, true)
                    let result = await Credentials.create(data)
                    res.status(200).json(result);
                }
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function credentialsQuery(req, res, next) {
    L('Calling API Credentials.credentialsQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result
            if (data.id) {
                result = await Credentials.findOne({_id: data.id});
            } else {
                let filter = {
                    accountSetId: data.accountSetId
                }
                if (data.audit === '未审核') filter.audit = null
                if (data.audit === '已审核') filter.audit = { $ne: null }
                if (data.post === '未过账') filter.post = null
                if (data.post === '已过账') filter.post = { $ne: null }
                if (data.time && data.time[0]) {
                    if (data.time[1]) {
                        filter.time = {
                            $gte: new Date(new Date(data.time[0]).toHawkDateString() + ' 00:00:00'),
                            $lte: new Date(new Date(data.time[1]).toHawkDateString() + ' 23:59:59.999'),
                        }
                    } else {
                        filter.time = {
                            $gte: new Date(new Date(data.time[0]).toHawkDateString() + ' 00:00:00'),
                            $lte: new Date(new Date(data.time[0]).toHawkDateString() + ' 23:59:59.999')
                        }
                    }
                }
                if (data.year) {
                    let ap = new Date(data.year).toHawkDateString().split('-')
                    filter.accountingPeriod = { $regex: ap[0] }
                }
                if (data.month) {
                    let ap = new Date(data.month).toHawkDateString().split('-')
                    filter.accountingPeriod = ap[0] + '-' + parseInt(ap[1])
                }
                if (data.proofWords) filter.proofWords = data.proofWords
                if (data.certificateNumber) {
                    switch (data.equation) {
                        case '=':
                            filter.certificateNumber = data.certificateNumber
                            break
                        case '!=':
                            filter.certificateNumber = {$ne: data.certificateNumber}
                            break
                        case '>':
                            filter.certificateNumber = {$gt: data.certificateNumber}
                            break
                        case '>=':
                            filter.certificateNumber = {$gte: data.certificateNumber}
                            break
                        case '<':
                            filter.certificateNumber = {$lt: data.certificateNumber}
                            break
                        case '<=':
                            filter.certificateNumber = {$lte: data.certificateNumber}
                            break
                    }
                }
                result = await Credentials.find(filter);
            }
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function credentialsDelete(req, res, next) {
    L('Calling API Credentials.credentialsDelete', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('凭证Id必填'));
        } else {
            let updateSubject = async (list) => {
                list.forEach(async (v, i) => {
                    let sData = await Subject.findOne({
                        accountSetId: data.accountSetId,
                        code: v.subjectCode
                    })
                    let direction = sData.balance === '借方'
                    // 科目余额
                    let balance = sData.subjectBalance !== null ? sData.subjectBalance : NP[direction ? 'minus' : 'plus'](NP[direction ? 'plus' : 'minus'](sData.beginningBalance || 0, sData.yearBorrow || 0), sData.yearCredit || 0)
                    if (v.borrower) {
                        balance = NP[direction ? 'minus' : 'plus'](balance, v.borrower)
                    }
                    if (v.lender) {
                        balance = NP[direction ? 'plus' : 'minus'](balance, v.borrower)
                    }
                    sData.subjectBalance = balance
                    await Subject.updateOne({_id: sData._id}, sData)
                })
            }
            let credentialsData = await Credentials.findOne({ _id: data.id })
            if (!credentialsData.invalid) await updateSubject(credentialsData.child)
            await DeleteCache(data.id)
            await Credentials.deleteOne({ _id: data.id }, (err) => {
                if (err) {
                    next(new errors.BadRequest(err));
                } else {
                    res.status(200).end();
                }
            })
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function queryLastInfo(req, res, next) {
    L('Calling API Credentials.queryLastInfo', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await Credentials.find({
                accountSetId: data.accountSetId
            }).sort({createdAt: -1})
            let proof = await ProofWords.find({
                accountSetId: data.accountSetId
            })
            proof.forEach(v => {
                let fData = result.find(r => r.proofWordId.toString() === v._id.toString())
                v._doc.total = fData ? fData.certificateNumber + 1 : 1
            })
            let obj = {
                proof,
                time: result.length ? result[0].time : null,
                accountingPeriod: result.length ? result[0].accountingPeriod : null,
                serialNumber: result.length ? result[0].serialNumber + 1 : result.length + 1
            }
            res.status(200).json(obj);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function credentialsPost(req, res, next) {
    L('Calling API Credentials.credentialsPost', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let accountData = await AccountSet.findOne({_id: data.accountSetId})
            if (!accountData.generalLedger) {
                next(new errors.BadRequest(`您还没有结束初始化，无法过账`));
            } else {
                let accountingPeriod = accountData.currentAccountingPeriod || accountData.accountingYear + '-' + accountData.accountingPeriod
                let updateSubject = async (child) => {
                    for (let index = 0; index < child.length; index++) {
                        let c = child[index]
                        let sData = await Subject.findOne({
                            accountSetId: data.accountSetId,
                            code: c.subjectCode
                        })
                        let direction = sData.balance === '借方'
                        if (sData.eachBalance && sData.eachBalance.length) {
                            let isPush = true
                            let lastEach = null
                            sData.eachBalance.forEach((v, i) => {
                                if (v.time === accountingPeriod) {
                                    v.borrower = NP.plus(v.borrower || 0, c.borrower || 0)
                                    v.lender = NP.plus(v.lender || 0, c.lender || 0)
                                    isPush = false
                                }
                                if (i === sData.eachBalance.length - 1) lastEach = v
                            })
                            if (isPush) {
                                let beginningBalance = 0
                                if (accountingPeriod.split('-')[1] == 1) {
                                    let balance = sData.eachYearBalance.find(b => b.time === (accountingPeriod.split('-')[0] - 1))
                                    if (direction) {
                                        beginningBalance = NP.minus(NP.plus(balance && balance.beginningBalance || 0, balance && balance.borrower || 0), balance && balance.lender || 0)
                                    } else {
                                        beginningBalance = NP.minus(NP.plus(balance && balance.beginningBalance || 0, balance && balance.lender || 0), balance && balance.borrower || 0)
                                    }
                                } else {
                                    if (direction) {
                                        beginningBalance = NP.minus(NP.plus(lastEach.beginningBalance || 0, lastEach.borrower || 0), lastEach.lender || 0)
                                    } else {
                                        beginningBalance = NP.minus(NP.plus(lastEach.beginningBalance || 0, lastEach.lender || 0), lastEach.borrower || 0)
                                    }
                                }
                                sData.eachBalance.push({
                                    time: accountingPeriod,
                                    borrower: c.borrower || 0,
                                    lender: c.lender || 0,
                                    beginningBalance: beginningBalance
                                })
                            }
                        } else {
                            let beginningBalance = 0
                            if (direction) {
                                beginningBalance = NP.minus(NP.plus(sData.beginningBalance || 0, sData.yearBorrow || 0), sData.yearCredit || 0)
                            } else {
                                beginningBalance = NP.minus(NP.plus(sData.beginningBalance || 0, sData.yearCredit || 0), sData.yearBorrow || 0)
                            }
                            sData.eachBalance = [{
                                time: accountingPeriod,
                                borrower: c.borrower || 0,
                                lender: c.lender || 0,
                                beginningBalance: beginningBalance
                            }]
                        }
                        sData.yearBorrow = NP.plus(c.borrower || 0, sData.yearBorrow || 0)
                        sData.yearCredit = NP.plus(c.lender || 0, sData.yearCredit || 0)
                        await Subject.updateOne({_id: sData._id}, sData)
                        if (c.accountingItem.length) {
                            await updateAccountingSubject(c.accountingItem, sData._id, c.borrower, c.lender, accountingPeriod)
                        }
                        if (sData.parentId.length) {
                            for (let p = 0; p < sData.parentId.length; p++) {
                                await updateParentsSubject(sData.parentId[p], c.borrower, c.lender, accountingPeriod, c.accountingItem)
                            }
                        }
                    }
                }
                if (data.id) {
                    // 单张
                    let cData = await Credentials.findOne({_id: data.id})
                    if (cData.accountingPeriod === accountingPeriod) {
                        let lastData = await Credentials.findOne({
                            accountSetId: data.accountSetId,
                            proofWords: data.proofWords,
                            certificateNumber: data.certificateNumber - 1
                        })
                        if (lastData || data.certificateNumber === 1) {
                            if ((lastData && lastData.post) || data.certificateNumber === 1) {
                                await Credentials.updateOne({
                                    _id: data.id
                                }, {$set: {post: req.user.sub}})
                                await updateSubject(cData.child)
                                res.status(200).end();
                            } else {
                                next(new errors.BadRequest(`上一张凭证号：${data.proofWords}-${data.certificateNumber - 1}没有过账，无法过账本张凭证`));
                            }
                        } else {
                            next(new errors.BadRequest(`凭证号不连续，无法找到上一张凭证号：${data.proofWords}-${data.certificateNumber}`));
                        }
                    } else {
                        if (cData.accountingPeriod > accountingPeriod) {
                            next(new errors.BadRequest(`${accountingPeriod}期凭证还没结账，无法过账${cData.accountingPeriod}期凭证`));
                        } else {
                            next(new errors.BadRequest(`${accountingPeriod}期凭证已结账，无法过账${cData.accountingPeriod}期凭证`));
                        }
                    }
                } else {
                    // 全部
                    let list = await Credentials.find({
                        accountSetId: data.accountSetId,
                        accountingPeriod: accountingPeriod
                    })
                    let unPostList = list.filter(v => !v.post)
                    if (unPostList.length === 0) {
                        next(new errors.BadRequest(`您的${accountingPeriod}期凭证已全部过账，无需再过账`));
                    }
                    let proof = await ProofWords.find({
                        accountSetId: data.accountSetId
                    })
                    let errorText = `凭证号不连续, 出现断号：<br/>`
                    let isError = false
                    proof.forEach((p) => {
                        let pList = list.filter(l => l.proofWordId.toString() === p._id.toString()).sort((x, y) => x.certificateNumber - y.certificateNumber)
                        for (let i = 1; i < pList.length; i++) {
                            if (pList[i].certificateNumber !== (pList[i - 1].certificateNumber + 1)) {
                                isError = true
                                errorText += `${pList[i - 1].proofWords}-${pList[i - 1].certificateNumber} 到 ${pList[i].proofWords}-${pList[i].certificateNumber}<br/>`
                            }
                        }
                    })
                    if (isError) {
                        next(new errors.BadRequest(errorText));
                    } else {
                        await Credentials.updateMany({
                            accountSetId: data.accountSetId,
                            accountingPeriod: accountingPeriod,
                            post: null
                        }, {$set: {post: req.user.sub}})

                        for (let i = 0; i < list.length; i++) {
                            if (!list[i].post) await updateSubject(list[i].child)
                        }
                        res.status(200).end();
                    }
                }
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function credentialsSubject(req, res, next) {
    L('Calling API Credentials.credentialsSubject', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.subjectCode) {
            next(new errors.BadRequest('科目必填'));
        } else {
            let filter = {
                accountSetId: data.accountSetId,
                invalid: {$ne: true }
            }
            if (data.post === '未过账') filter.post = null
            if (data.post === '已过账') filter.post = { $ne: null }
            if (data.time && data.time[0]) {
                if (data.time[1]) {
                    filter.time = {
                        $gte: new Date(new Date(data.time[0]).toHawkDateString() + ' 00:00:00'),
                        $lte: new Date(new Date(data.time[1]).toHawkDateString() + ' 23:59:59.999'),
                    }
                } else {
                    filter.time = {
                        $gte: new Date(new Date(data.time[0]).toHawkDateString() + ' 00:00:00'),
                        $lte: new Date(new Date(data.time[0]).toHawkDateString() + ' 23:59:59.999')
                    }
                }
            }
            if (data.accountingPeriod) {
                let ap = new Date(data.accountingPeriod).toHawkDateString().split('-')
                filter.accountingPeriod = ap[0] + '-' + parseInt(ap[1])

                if (data.accountingPeriodEnd) {
                    let ape = new Date(data.accountingPeriodEnd).toHawkDateString().split('-')
                    filter.accountingPeriod = { $gte: ap[0] + '-' + parseInt(ap[1]), $lte:  ape[0] + '-' + parseInt(ape[1]) }
                }
            }

            let cData = await Credentials.find(filter)
            let sData = await Subject.findOne({
                accountSetId: data.accountSetId,
                code: data.subjectCode
            })
            let list = cData.filter(v => v.child.filter(f => f.subjectCode.includes(data.subjectCode)).length)
            let obj = {
                list
            }
            if (sData.eachBalance && sData.eachBalance.length) {
                let ap = new Date(data.accountingPeriod).toHawkDateString().split('-')
                let time = ap[0] + '-' + parseInt(ap[1])
                let isPush = true
                let lastEach = null
                let direction = sData.balance === '借方'
                sData.eachBalance.forEach((e, i1) => {
                    if (e.time === time) {
                        obj.balance = {
                            time: time,
                            balance: sData.balance,
                            borrower: 0,
                            lender: 0,
                            beginningBalance: e.beginningBalance || 0
                        }
                        isPush = false
                    }
                    if (i1 === sData.eachBalance.length - 1) lastEach = e
                })
                if (isPush) {
                    let beginningBalance = 0
                    if (time.split('-')[1] == 1) {
                        let balance = sData.eachYearBalance.find(b => b.time === (time.split('-')[0] - 1))
                        if (direction) {
                            beginningBalance = NP.minus(NP.plus(balance && balance.beginningBalance || 0, balance && balance.borrower || 0), balance && balance.lender || 0)
                        } else {
                            beginningBalance = NP.minus(NP.plus(balance && balance.beginningBalance || 0, balance && balance.lender || 0), balance && balance.borrower || 0)
                        }
                    } else {
                        if (direction) {
                            beginningBalance = NP.minus(NP.plus(lastEach.beginningBalance || 0, lastEach.borrower || 0), lastEach.lender || 0)
                        } else {
                            beginningBalance = NP.minus(NP.plus(lastEach.beginningBalance || 0, lastEach.lender || 0), lastEach.borrower || 0)
                        }
                    }
                    obj.balance = {
                        time: time,
                        balance: sData.balance,
                        borrower: 0,
                        lender: 0,
                        beginningBalance: beginningBalance
                    }
                }
            } else {
                let beginningBalance = 0
                if (sData.balance === '借方') {
                    beginningBalance = NP.minus(NP.plus(sData.beginningBalance || 0, sData.yearBorrow || 0), sData.yearCredit || 0)
                } else {
                    beginningBalance = NP.minus(NP.plus(sData.beginningBalance || 0, sData.yearCredit || 0), sData.yearBorrow || 0)
                }
                obj.balance = {
                    time: data.accountingPeriod,
                    balance: sData.balance,
                    borrower: 0,
                    lender: 0,
                    beginningBalance: beginningBalance
                }
            }
            res.status(200).json(obj);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function generalLedger(req, res, next) {
    L('Calling API Credentials.generalLedger', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let filter = {
                accountSetId: data.accountSetId
            }
            if (data.subjectCode) {
                filter.code = data.subjectCode
                if (data.subjectCodeEnd) {
                    filter.code = { $gte: data.subjectCode, $lte: data.subjectCodeEnd }
                }
            }
            if (data.currency) {
                let currencyList = data.currency === '人民币' ? ['不核算', '所有币别', '人民币'] :  [data.currency]
                filter.currency = {$in: currencyList}
            }

            let sData = await Subject.find(filter)
            let cData = []
            let detail = []

            if (data.post) {
                // 包含未过账
                let cFilter = {
                    accountSetId: data.accountSetId,
                    post: null,
                    invalid: {$ne: true }
                }
                if (data.accountingPeriod) {
                    let ap = new Date(data.accountingPeriod).toHawkDateString().split('-')
                    cFilter.accountingPeriod = ap[0] + '-' + parseInt(ap[1])

                    if (data.accountingPeriodEnd) {
                        let ape = new Date(data.accountingPeriodEnd).toHawkDateString().split('-')
                        cFilter.accountingPeriod = { $gte: ap[0] + '-' + parseInt(ap[1]), $lte:  ape[0] + '-' + parseInt(ape[1]) }
                    }
                }
                cData = await Credentials.find(cFilter)
            }
            if (data.detail) {
                let cList = await Credentials.find({
                    accountSetId: data.accountSetId,
                    invalid: {$ne: true }
                })
                let sCodeList = sData.filter(v => v.accountItem.length).map(s => s.code)
                cList = cList.filter(v => v.child.find(c => sCodeList.includes(c.subjectCode)))

                let period = moment(data.accountingPeriod).format('YYYY-MM-DD').split('-')
                let periodEnd = data.accountingPeriodEnd ? moment(data.accountingPeriodEnd).format('YYYY-MM-DD').split('-') : period
                let time = period[0] + '-' + parseInt(period[1])
                let endTime = periodEnd[0] + '-' + parseInt(periodEnd[1])

                cList.forEach(c => {
                    c.child.forEach(cc => {
                        let fData = sData.find(v => v.code === cc.subjectCode && v.accountItem.length)
                        if (fData) {
                            let name = cc.accountingItem.map(a => a.name).join(',')
                            let fd = detail.find(d => d.name === name)
                            let isNow = c.accountingPeriod >= time && c.accountingPeriod <= endTime
                            let direction = fData.balance === '借方'
                            if (fd) {
                                if (isNow) {
                                    fd.borrower = NP.plus(fd.borrower, cc.borrower || 0)
                                    fd.lender = NP.plus(fd.lender, cc.lender || 0)
                                    fd.yearBorrow = fd.borrower
                                    fd.yearCredit = fd.lender
                                } else {
                                    fd.beginningBalance = NP.plus(fd.beginningBalance, cc.borrower || cc.lender)
                                }
                                fd.balance = NP[direction ? 'minus' : 'plus'](NP[direction ? 'plus' : 'minus'](fd.beginningBalance || 0, fd.borrower || 0), fd.lender || 0)
                            } else {
                                let cObj = {
                                    beginningBalance: isNow ? 0 : cc.borrower || cc.lender,
                                    borrower: isNow ? cc.borrower || 0 : 0,
                                    lender: isNow ? cc.lender || 0 : 0,
                                    yearBorrow: isNow ? cc.borrower || 0 : 0,
                                    yearCredit: isNow ? cc.lender || 0 : 0,
                                    code: cc.subjectCode,
                                    name
                                }
                                cObj.balance = NP[direction ? 'minus' : 'plus'](NP[direction ? 'plus' : 'minus'](cObj.beginningBalance || 0, cObj.borrower || 0), cObj.lender || 0)
                                detail.push(cObj)
                            }
                        }
                    })
                })
            }

            res.status(200).json({
                detail,
                subject: sData,
                credentials: cData
            });
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function allAccounting(req, res, next) {
    L('Calling API Credentials.allAccounting', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.accountItem) {
            next(new errors.BadRequest('项目类别必填'));
        } else {
            let filter = {
                accountSetId: data.accountSetId,
                accountItem: { $in: [data.accountItem] }
            }
            if (data.subjectCode) {
                filter.code = data.subjectCode
                if (data.subjectCodeEnd) {
                    filter.code = { $gte: data.subjectCode, $lte: data.subjectCodeEnd }
                }
            }
            let sData = await Subject.find(filter)
            let accountItem = []
            switch (data.accountItem) {
                case '客户':
                    accountItem = await Customer.find({accountSetId: data.accountSetId})
                    break
                case '部门':
                    accountItem = await Department.find({accountSetId: data.accountSetId})
                    break
                case '职员':
                    accountItem = await Clerk.find({accountSetId: data.accountSetId})
                    break
                case '供应商':
                    accountItem = await Supplier.find({accountSetId: data.accountSetId})
                    break
                case '费用':
                    accountItem = await Cost.find({accountSetId: data.accountSetId})
                    break
                case '银行账户':
                    accountItem = await BankAccount.find({accountSetId: data.accountSetId})
                    break
                case '现金流量项目':
                    accountItem = await CashFlow.find({accountSetId: data.accountSetId})
                    break
            }

            let cFilter = {
                accountSetId: data.accountSetId,
                invalid: {$ne: true },
                child: {
                    $elemMatch: {
                        accountingItem: {
                            $elemMatch: { type: data.accountItem }
                        }
                    }
                }
            }
            let cData = await Credentials.find(cFilter)
            let result = []
            let period = moment(data.accountingPeriod).format('YYYY-MM-DD').split('-')
            let periodEnd = data.accountingPeriodEnd ? moment(data.accountingPeriodEnd).format('YYYY-MM-DD').split('-') : period
            accountItem.forEach(v => {
                let obj = {
                    name: v.name,
                    cData: []
                }
                for (let i = parseInt(period[1]); i <= parseInt(periodEnd[1]); i++) {
                    sData.forEach(s => {
                        let fList = obj.cData.filter(o => o.code === s.code)
                        let beginningBalance = fList.length ? fList[fList.length - 1].balance : 0
                        let borrower = 0
                        let lender = 0
                        let yearBorrower = fList.length ? fList[fList.length - 1].yearBorrower : 0
                        let yearLender = fList.length ? fList[fList.length - 1].yearLender : 0
                        let balance = 0
                        let direction = s.balance === '借方'
                        cData.forEach(c => {
                            if ((data.post && !c.post) || (!data.post && c.post)) {
                                c.child.forEach(cf => {
                                    if (cf.subjectCode === s.code && cf.accountingItem.find(f => f.name === v.name)) {
                                        if (c.accountingPeriod === (period[0] + '-' + i)) {
                                            borrower = NP.plus(borrower, cf.borrower || 0)
                                            lender = NP.plus(lender, cf.lender || 0)
                                            yearBorrower = NP.plus(yearBorrower, cf.borrower || 0)
                                            yearLender = NP.plus(yearLender, cf.lender || 0)
                                        }
                                    }
                                })
                            }
                        })
                        if (beginningBalance > 0 || borrower > 0 || lender > 0 || yearBorrower > 0 || yearLender > 0) {
                            balance = NP[direction ? 'minus' : 'plus'](NP[direction ? 'plus' : 'minus'](beginningBalance, yearBorrower), yearLender)
                            obj.cData.push({
                                code: s.code,
                                name: s.name,
                                direction: s.balance,
                                time: period[0] + '-' + i,
                                beginningBalance,
                                borrower,
                                lender,
                                yearBorrower,
                                yearLender,
                                balance
                            })
                        }
                    })
                }
                result.push(obj)
            })
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function numberAccounting(req, res, next) {
    L('Calling API Credentials.numberAccounting', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let filter = {
                accountSetId: data.accountSetId,
                numberUnit: true,
                unit: { $ne: '' }
            }
            if (data.subjectCode) {
                filter.code = data.subjectCode
                if (data.subjectCodeEnd) {
                    filter.code = { $gte: data.subjectCode, $lte: data.subjectCodeEnd }
                }
            }
            let sData = await Subject.find(filter)
            let cData = []
            if (data.post) {
                // 包含未过账
                let cFilter = {
                    accountSetId: data.accountSetId,
                    post: null,
                    invalid: {$ne: true }
                }
                if (data.accountingPeriod) {
                    let ap = new Date(data.accountingPeriod).toHawkDateString().split('-')
                    cFilter.accountingPeriod = ap[0] + '-' + parseInt(ap[1])

                    if (data.accountingPeriodEnd) {
                        let ape = new Date(data.accountingPeriodEnd).toHawkDateString().split('-')
                        cFilter.accountingPeriod = { $gte: ap[0] + '-' + parseInt(ap[1]), $lte:  ape[0] + '-' + parseInt(ape[1]) }
                    }
                }
                cData = await Credentials.find(cFilter)
            }
            let sCodeList = sData.map(s => s.code)
            res.status(200).json({
                subject: sData,
                credentials: cData.filter(v => v.child.find(c => sCodeList.includes(c.subjectCode)))
            });
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function dailyReport(req, res, next) {
    L('Calling API Credentials.dailyReport', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.time) {
            next(new errors.BadRequest('时间必填'));
        } else {
            let filter = { accountSetId: data.accountSetId }
            if (data.subjectCode) {
                filter.code = data.subjectCode
                if (data.subjectCodeEnd) {
                    filter.code = { $gte: data.subjectCode, $lte: data.subjectCodeEnd }
                }
            }
            let sData = await Subject.find(filter)

            let cFilter = {
                accountSetId: data.accountSetId,
                invalid: { $ne: true }
            }
            let lastFilter = {
                accountSetId: data.accountSetId,
                invalid: { $ne: true }
            }
            if (data.time && data.time[0]) {
                if (data.time[1]) {
                    cFilter.time = {
                        $gte: new Date(new Date(data.time[0]).toHawkDateString() + ' 00:00:00'),
                        $lte: new Date(new Date(data.time[1]).toHawkDateString() + ' 23:59:59.999'),
                    }
                } else {
                    cFilter.time = {
                        $gte: new Date(new Date(data.time[0]).toHawkDateString() + ' 00:00:00'),
                        $lte: new Date(new Date(data.time[0]).toHawkDateString() + ' 23:59:59.999')
                    }
                }
                lastFilter.time = {
                    $lt: new Date(new Date(data.time[0]).toHawkDateString() + ' 00:00:00')
                }
            }
            if (!data.post) {
                cFilter.post = { $ne: null }
                lastFilter.post = { $ne: null }
            }
            let cData = await Credentials.find(cFilter)
            let lastData = await Credentials.find(lastFilter)

            let result = []
            sData.forEach(s => {
                let borrower = 0
                let lender = 0
                let lastBalance = 0
                let balance = 0
                let borrowerNumber = 0
                let lenderNumber = 0
                cData.forEach(c => {
                    c.child.forEach(cc => {
                        if (cc.subjectCode.includes(s.code)) {
                            if (cc.borrower) {
                                borrowerNumber++
                                borrower = NP.plus(borrower, cc.borrower)
                            }
                            if (cc.lender) {
                                lenderNumber++
                                lender = NP.plus(lender, cc.lender)
                            }
                        }
                    })
                })
                let direction = s.balance === '借方'
                let beginningBalance = s.beginningBalance || 0
                lastBalance = lastData.reduce((total, r) => {
                    r.child.forEach(cc => {
                        if (cc.subjectCode.includes(s.code)) {
                            if (cc.borrower) total = NP[direction ? 'plus' : 'minus'](total, cc.borrower)
                            if (cc.lender) total = NP[direction ? 'minus' : 'plus'](total, cc.lender)
                        }
                    })
                    return total
                }, beginningBalance)
                if (direction) {
                    balance = NP.minus(NP.plus(lastBalance, borrower), lender)
                } else {
                    balance = NP.minus(NP.plus(lastBalance, lender), borrower)
                }
                if (
                    borrower ||
                    lender ||
                    lastBalance ||
                    balance ||
                    borrowerNumber ||
                    lenderNumber
                ) {
                    let obj = {
                        borrower,
                        lender,
                        lastBalance,
                        balance,
                        borrowerNumber,
                        lenderNumber,
                        direction: s.balance,
                        code: s.code,
                        name: s.name,
                        parentId: s.parentId
                    }
                    result.push(obj)
                }
            })
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function abstractQuery(req, res, next) {
    L('Calling API Credentials.abstractQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.time) {
            next(new errors.BadRequest('时间必填'));
        }  else if (!data.abstract) {
            next(new errors.BadRequest('摘要必填'));
        } else {
            let filter = { accountSetId: data.accountSetId }
            if (data.subjectCode) {
                filter.code = data.subjectCode
                if (data.subjectCodeEnd) {
                    filter.code = { $gte: data.subjectCode, $lte: data.subjectCodeEnd }
                }
            }
            let sData = await Subject.find(filter)

            let cFilter = {
                accountSetId: data.accountSetId,
                invalid: { $ne: true }
            }

            if (data.time && data.time[0]) {
                if (data.time[1]) {
                    cFilter.time = {
                        $gte: new Date(new Date(data.time[0]).toHawkDateString() + ' 00:00:00'),
                        $lte: new Date(new Date(data.time[1]).toHawkDateString() + ' 23:59:59.999'),
                    }
                } else {
                    cFilter.time = {
                        $gte: new Date(new Date(data.time[0]).toHawkDateString() + ' 00:00:00'),
                        $lte: new Date(new Date(data.time[0]).toHawkDateString() + ' 23:59:59.999')
                    }
                }
            }
            if (!data.post) {
                cFilter.post = { $ne: null }
            }
            let cData = await Credentials.find(cFilter)
            let sCodeList = sData.map(s => s.code)
            res.status(200).json({
                subject: sData,
                credentials: cData.filter(v => v.child.find(c => sCodeList.includes(c.subjectCode) && c.abstract.includes(data.abstract)))
            });
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function accountingItemBalance(req, res, next) {
    L('Calling API Credentials.accountingItemBalance', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let filter = {
                accountSetId: data.accountSetId,
                accountItem: { $in: [data.accountItem] }
            }
            if (data.subjectCode) {
                filter.code = data.subjectCode
                if (data.subjectCodeEnd) {
                    filter.code = { $gte: data.subjectCode, $lte: data.subjectCodeEnd }
                }
            }
            let sData = await Subject.find(filter)
            let cData = []
            if (data.post) {
                // 包含未过账
                let cFilter = {
                    accountSetId: data.accountSetId,
                    post: null,
                    invalid: {$ne: true }
                }
                if (data.accountingPeriod) {
                    let ap = new Date(data.accountingPeriod).toHawkDateString().split('-')
                    cFilter.accountingPeriod = ap[0] + '-' + parseInt(ap[1])

                    if (data.accountingPeriodEnd) {
                        let ape = new Date(data.accountingPeriodEnd).toHawkDateString().split('-')
                        cFilter.accountingPeriod = { $gte: ap[0] + '-' + parseInt(ap[1]), $lte:  ape[0] + '-' + parseInt(ape[1]) }
                    }
                }
                cData = await Credentials.find(cFilter)
            }
            let result = []
            cData.forEach(c => {
                c.child.forEach(cc => {
                    let subjectData = sData.find(s => s.code === cc.subjectCode)
                    if (subjectData) {
                        let pData = result.find(v => v.name === data.accountItem)
                        if (pData) {
                            let isFind = true
                            pData.child.forEach((r, rIndex) => {
                                if (r.accountingPeriod === c.accountingPeriod) {
                                    isFind = false
                                    r.borrower = NP.plus(r.borrower, cc.borrower|| 0)
                                    r.lender = NP.plus(r.lender, cc.borrower|| 0)
                                    if (subjectData.balance === '借方') {
                                        r.balance = NP.minus(NP.plus(r.beginningBalance,  r.borrower|| 0), r.lender || 0)
                                    } else {
                                        r.balance = NP.minus(NP.plus(r.beginningBalance, r.lender || 0), r.borrower || 0)
                                    }
                                }
                                if (rIndex === pData.child.length - 1 && isFind) {
                                    let beginningBalance = r.balance
                                    let balance = 0
                                    if (subjectData.balance === '借方') {
                                        balance = NP.minus(NP.plus(beginningBalance, cc.borrower|| 0), cc.lender || 0)
                                    } else {
                                        balance = NP.minus(NP.plus(beginningBalance, cc.lender || 0), cc.borrower || 0)
                                    }
                                    pData.child.push({
                                        accountingPeriod: c.accountingPeriod,
                                        beginningBalance: beginningBalance,
                                        borrower: cc.borrower || 0,
                                        lender:  cc.lender || 0,
                                        balance: balance
                                    })
                                }
                            })
                        } else {
                            let accounting = cc.accountingItem.find(f => f.type === data.accountItem)
                            let beginningBalance = 0
                            let balance = 0
                            if (subjectData.eachBalance && subjectData.eachBalance.length) {
                                let balance = subjectData.eachBalance.find(v => v.time === c.accountingPeriod)
                                beginningBalance = balance ? balance.beginningBalance : 0
                            } else {
                                if (subjectData.balance === '借方') {
                                    beginningBalance = NP.minus(NP.plus(subjectData.beginningBalance || 0, subjectData.yearBorrow || 0), subjectData.yearCredit || 0)
                                    balance = NP.minus(NP.plus(beginningBalance, cc.borrower|| 0), cc.lender || 0)
                                } else {
                                    beginningBalance = NP.minus(NP.plus(subjectData.beginningBalance || 0, subjectData.yearCredit || 0), subjectData.yearBorrow || 0)
                                    balance = NP.minus(NP.plus(beginningBalance, cc.lender || 0), cc.borrower || 0)
                                }
                            }
                            if (subjectData.balance === '借方') {
                                balance = NP.minus(NP.plus(beginningBalance, cc.borrower|| 0), cc.lender || 0)
                            } else {
                                balance = NP.minus(NP.plus(beginningBalance, cc.lender || 0), cc.borrower || 0)
                            }
                            if (accounting) {
                                result.push({
                                    code: accounting.code,
                                    name: accounting.name,
                                    direction: subjectData.balance,
                                    subjectCode: subjectData.code,
                                    subject: subjectData.name,
                                    child: [{
                                        accountingPeriod: c.accountingPeriod,
                                        beginningBalance: beginningBalance,
                                        borrower: cc.borrower || 0,
                                        lender:  cc.lender || 0,
                                        balance: balance
                                    }]
                                })
                            }
                        }
                    }
                })
            })
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function accountingItemDetail(req, res, next) {
    L('Calling API Credentials.accountingItemDetail', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let filter = {
                accountSetId: data.accountSetId,
                accountItem: { $in: [data.accountItem] }
            }
            if (data.subjectCode) {
                filter.code = data.subjectCode
            }
            let sData = await Subject.find(filter)
            let cFilter = {
                accountSetId: data.accountSetId,
                invalid: {$ne: true }
            }
            if (data.accountingPeriod) {
                let ap = new Date(data.accountingPeriod).toHawkDateString().split('-')
                cFilter.accountingPeriod = ap[0] + '-' + parseInt(ap[1])

                if (data.accountingPeriodEnd) {
                    let ape = new Date(data.accountingPeriodEnd).toHawkDateString().split('-')
                    cFilter.accountingPeriod = { $gte: ap[0] + '-' + parseInt(ap[1]), $lte:  ape[0] + '-' + parseInt(ape[1]) }
                }
            }
            if (!data.post) {
                // 包含未过账
                cFilter.post = {$ne: null }
            }
            let cData = await Credentials.find(cFilter)
            let sCodeList = sData.map(s => s.code)
            let result = cData.filter(v => v.child.find(c => sCodeList.includes(c.subjectCode)))
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function accountingItemSummary(req, res, next) {
    L('Calling API Credentials.accountingItemSummary', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let filter = {
                accountSetId: data.accountSetId,
                accountItem: { $in: data.accountItem }
            }
            if (data.subjectCode) {
                filter.code = data.subjectCode
            }
            let sData = await Subject.find(filter)
            let cFilter = {
                accountSetId: data.accountSetId,
                invalid: {$ne: true }
            }
            if (data.accountingPeriod) {
                let ap = new Date(data.accountingPeriod).toHawkDateString().split('-')
                cFilter.accountingPeriod = ap[0] + '-' + parseInt(ap[1])

                if (data.accountingPeriodEnd) {
                    let ape = new Date(data.accountingPeriodEnd).toHawkDateString().split('-')
                    cFilter.accountingPeriod = { $gte: ap[0] + '-' + parseInt(ap[1]), $lte:  ape[0] + '-' + parseInt(ape[1]) }
                }
            }
            if (!data.post) {
                // 包含未过账
                cFilter.post = {$ne: null }
            }
            let cData = await Credentials.find(cFilter)
            let result = []
            cData.forEach(c => {
                c.child.forEach(cc => {
                    let subjectData = sData.find(s => s.code === cc.subjectCode)
                    if (subjectData) {
                        let pData = result.find(v =>
                            v.subjectCode === subjectData.code &&
                            v.accountingItem.filter(ai => cc.accountingItem.find(a => a.code === ai.code)).length === v.accountItem.length
                        )
                        if (pData) {
                            let isFind = true
                            pData.child.forEach((r, rIndex) => {
                                if (r.accountingPeriod === c.accountingPeriod) {
                                    isFind = false
                                    r.borrower = NP.plus(r.borrower, cc.borrower|| 0)
                                    r.lender = NP.plus(r.lender, cc.borrower|| 0)
                                    if (subjectData.balance === '借方') {
                                        r.balance = NP.minus(NP.plus(r.beginningBalance,  r.borrower|| 0), r.lender || 0)
                                    } else {
                                        r.balance = NP.minus(NP.plus(r.beginningBalance, r.lender || 0), r.borrower || 0)
                                    }
                                }
                                if (rIndex === pData.child.length - 1 && isFind) {
                                    let beginningBalance = r.balance
                                    let balance = 0
                                    if (subjectData.balance === '借方') {
                                        balance = NP.minus(NP.plus(beginningBalance, cc.borrower|| 0), cc.lender || 0)
                                    } else {
                                        balance = NP.minus(NP.plus(beginningBalance, cc.lender || 0), cc.borrower || 0)
                                    }
                                    pData.child.push({
                                        accountingPeriod: c.accountingPeriod,
                                        beginningBalance: beginningBalance,
                                        borrower: cc.borrower || 0,
                                        lender:  cc.lender || 0,
                                        balance: balance
                                    })
                                }
                            })
                        } else {
                            let accounting = data.accountItem.filter(type => cc.accountingItem.find(a => a.type === type)).length === data.accountItem.length
                            if (accounting) {
                                let beginningBalance = 0
                                let balance = 0
                                if (subjectData.eachBalance && subjectData.eachBalance.length) {
                                    let balance = subjectData.eachBalance.find(v => v.time === c.accountingPeriod)
                                    beginningBalance = balance ? balance.beginningBalance : 0
                                } else {
                                    if (subjectData.balance === '借方') {
                                        beginningBalance = NP.minus(NP.plus(subjectData.beginningBalance || 0, subjectData.yearBorrow || 0), subjectData.yearCredit || 0)
                                        balance = NP.minus(NP.plus(beginningBalance, cc.borrower|| 0), cc.lender || 0)
                                    } else {
                                        beginningBalance = NP.minus(NP.plus(subjectData.beginningBalance || 0, subjectData.yearCredit || 0), subjectData.yearBorrow || 0)
                                        balance = NP.minus(NP.plus(beginningBalance, cc.lender || 0), cc.borrower || 0)
                                    }
                                }
                                if (subjectData.balance === '借方') {
                                    balance = NP.minus(NP.plus(beginningBalance, cc.borrower|| 0), cc.lender || 0)
                                } else {
                                    balance = NP.minus(NP.plus(beginningBalance, cc.lender || 0), cc.borrower || 0)
                                }
                                result.push({
                                    accountingItem: cc.accountingItem,
                                    direction: subjectData.balance,
                                    subjectCode: subjectData.code,
                                    subject: subjectData.name,
                                    child: [{
                                        accountingPeriod: c.accountingPeriod,
                                        beginningBalance: beginningBalance,
                                        borrower: cc.borrower || 0,
                                        lender:  cc.lender || 0,
                                        balance: balance
                                    }]
                                })
                            }
                        }
                    }
                })
            })
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function accountingItemCombination(req, res, next) {
    L('Calling API Credentials.accountingItemCombination', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.accountingPeriod) {
            next(new errors.BadRequest('会计期间必填'));
        } else if (data.accountItem.length !== 2) {
            next(new errors.BadRequest('必选两个核算项目'));
        } else if (!data.subjectCode) {
            next(new errors.BadRequest('科目必填'));
        } else if (!data.backType) {
            next(new errors.BadRequest('取数类型必填'));
        } else {
            let filter = {
                accountSetId: data.accountSetId,
                accountItem: { $in: data.accountItem }
            }
            if (data.subjectCode) {
                filter.code = data.subjectCode
            }
            let sData = await Subject.find(filter)
            let cFilter = {
                accountSetId: data.accountSetId,
                invalid: {$ne: true }
            }
            if (data.accountingPeriod) {
                let ap = new Date(data.accountingPeriod).toHawkDateString().split('-')
                cFilter.accountingPeriod = ap[0] + '-' + parseInt(ap[1])

                if (data.accountingPeriodEnd) {
                    let ape = new Date(data.accountingPeriodEnd).toHawkDateString().split('-')
                    cFilter.accountingPeriod = { $gte: ap[0] + '-' + parseInt(ap[1]), $lte:  ape[0] + '-' + parseInt(ape[1]) }
                }
            }
            if (!data.post) {
                // 包含未过账
                cFilter.post = {$ne: null }
            }
            let cData = await Credentials.find(cFilter)
            let sCodeList = sData.map(s => s.code)
            let result = cData.filter(v => v.child.find(c => sCodeList.includes(c.subjectCode)))
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function accountingItemSubject(req, res, next) {
    L('Calling API Credentials.accountingItemSubject', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.accountingPeriod) {
            next(new errors.BadRequest('会计期间必填'));
        } else if (!data.accountItem) {
            next(new errors.BadRequest('项目类别必填'));
        } else if (!data.backType) {
            next(new errors.BadRequest('取数类型必填'));
        } else {
            let filter = {
                accountSetId: data.accountSetId,
                accountItem: { $in: [data.accountItem] }
            }
            if (data.subjectCode) {
                filter.code = data.subjectCode
                if (data.subjectCodeEnd) {
                    filter.code = { $gte: data.subjectCode, $lte: data.subjectCodeEnd }
                }
            }
            let sData = await Subject.find(filter)
            let cFilter = {
                accountSetId: data.accountSetId,
                invalid: {$ne: true }
            }
            if (data.accountingPeriod) {
                let ap = new Date(data.accountingPeriod).toHawkDateString().split('-')
                cFilter.accountingPeriod = ap[0] + '-' + parseInt(ap[1])

                if (data.accountingPeriodEnd) {
                    let ape = new Date(data.accountingPeriodEnd).toHawkDateString().split('-')
                    cFilter.accountingPeriod = { $gte: ap[0] + '-' + parseInt(ap[1]), $lte:  ape[0] + '-' + parseInt(ape[1]) }
                }
            }
            if (!data.post) {
                // 包含未过账
                cFilter.post = {$ne: null }
            }
            let cData = await Credentials.find(cFilter)
            let sCodeList = sData.map(s => s.code)
            let result = cData.filter(v => v.child.find(c => sCodeList.includes(c.subjectCode)))
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function finalTuning(req, res, next) {
    L('Calling API Credentials.finalTuning', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.rateTypeId) {
            next(new errors.BadRequest('请选择汇率类型'));
        } else if (!data.lastData) {
            next(new errors.BadRequest('账套找不到会计期间'));
        } else {
            let currency = await Currency.find({
                accountSetId: data.accountSetId,
                name: { $ne: '人民币' }
            })
            let rateList = []
            if (data.isCustom) {
                rateList = data.rateCustomList
            } else {
                rateList = await ExchangeRate.find({
                    accountSetId: data.accountSetId,
                    typeId: data.rateTypeId
                })

                for (let i = 0; i < currency.length; i++) {
                    let fData = rateList.find(v => v.currencyId.toString() === currency[i]._id.toString())
                    if (!fData) {
                        next(new errors.BadRequest(`该汇率类型还没有设置${currency[i].name}币别的汇率，请前往添加`));
                        return
                    } else if (fData.rate <= 0) {
                        next(new errors.BadRequest(`${currency[i].name}币别的汇率不正确，请前往设置`));
                        return
                    } else if (
                        moment(fData.effectiveDate).format('YYYY-MM-DD') > data.lastData ||
                        moment(fData.expiryDate).format('YYYY-MM-DD') < data.lastData
                    ) {
                        next(new errors.BadRequest(`${currency[i].name}币别的汇率日期不正确，请前往设置`));
                        return
                    }
                }
            }

            let cFilter = {
                accountSetId: data.accountSetId,
                post: null,
                invalid: { $ne: true }
            }
            if (data.lastData) {
                let ap = new Date(data.lastData).toHawkDateString().split('-')
                cFilter.accountingPeriod = ap[0] + '-' + parseInt(ap[1])
            }
            let cData = await Credentials.find(cFilter)
            if (cData.length) {
                next(new errors.BadRequest(`${cFilter.accountingPeriod}期还有未过账凭证，无法期末调汇`));
                return
            }

            if (!data.isFirst) {
                if (!data.businessDate) {
                    next(new errors.BadRequest(`请选择调汇日期`));
                } else if (!data.subjectCode) {
                    next(new errors.BadRequest(`请选择汇兑损益科目`));
                } else if (!data.isGenerate) {
                    next(new errors.BadRequest(`请选择生成转账凭证`));
                } else if (data.category !== '汇兑损益') {
                    next(new errors.BadRequest(`请选择汇兑损益`));
                } else if (!data.time) {
                    next(new errors.BadRequest(`请选择凭证日期`));
                } else if (!data.proofWordId) {
                    next(new errors.BadRequest(`请选择凭证字`));
                } else if (!data.abstract) {
                    next(new errors.BadRequest(`请输入凭证摘要`));
                } else {
                    let cList = await Credentials.find({
                        accountSetId: data.accountSetId,
                        post: { $ne: null },
                        invalid: { $ne: true },
                        accountingPeriod: cFilter.accountingPeriod
                    })
                    let subject = await Subject.find({
                        accountSetId: data.accountSetId,
                        finalTuning: true
                    })
                    if (subject.length === 0) {
                        next(new errors.BadRequest(`${cFilter.accountingPeriod}期无需调汇`));
                    } else {
                        let formData = {
                            accountSetId: data.accountSetId,
                            time: data.time,
                            accountingPeriod: cFilter.accountingPeriod,
                            proofWordId: data.proofWordId,
                            proofWords: data.proofWords,
                            certificateNumber: data.certificateNumber,
                            child: [],
                            referenceInfo: '',
                            businessDate: data.businessDate,
                            voucher: data.voucher,
                            audit: null,
                            post: null,
                            examine: null,
                            cashier: null,
                            handle: '',
                            des: '',
                            paymentMode: '',
                            paymentNo: '',
                            currentBusiness: '',
                            files: 0,
                            serialNumber: data.serialNumber,
                            systemModule: '',
                            description: '',
                            invalid: false
                        }
                        cList.forEach(v => {
                            v.child.forEach(c => {
                                let sData = subject.find(s => s.code === c.subjectCode)
                                if (sData) {
                                    let currencyId = currency.find(f => f.name === c.currency)._id
                                    let rateInfo = rateList.find(f => f.currencyId.toString() === currencyId.toString())
                                    if (rateInfo && rateInfo.rate !== 1 && rateInfo.rate !== 0 && rateInfo.rate !== c.rate && c.rateType === data.rateType) {
                                        let money = NP.minus(NP.times(c.currencyAmount, rateInfo.rate), c.borrower || c.lender)
                                        let obj = {
                                            abstract: '',
                                            subjectCode: c.subjectCode,
                                            subject: c.subject,
                                            currency: c.currency,
                                            rateType: c.rateType,
                                            rate: rateInfo.rate,
                                            currencyAmount: null,
                                            unit: c.unit || null,
                                            number: c.number || null,
                                            price: c.price || null,
                                            borrower: null,
                                            lender: null,
                                            isAllC: c.isAllC,
                                            accountItem: c.accountItem,
                                            oldRate: c.rate,
                                            oldCurrencyAmount: c.currencyAmount,
                                            oldBorrower: c.borrower || null,
                                            oldLender: c.lender || null
                                        }
                                        let direction = sData.balance === '借方'
                                        if (money > 0) {
                                            obj[direction ? 'borrower' : 'lender'] = Math.abs(money)
                                        } else {
                                            obj[direction ? 'lender' : 'borrower'] = Math.abs(money)
                                        }
                                        obj.currencyAmount = NP.divide(Math.abs(money),  rateInfo.rate)
                                        if (formData.child.length === 0) {
                                            obj.abstract = data.abstract
                                        }
                                        formData.child.push(obj)
                                    }
                                }
                            })
                        })

                        if (formData.child.length) {
                            let borrower = formData.child.reduce((total, v) => {
                                if (v.borrower) total = NP.plus(total, v.borrower)
                                return total
                            }, 0)
                            let lender = formData.child.reduce((total, v) => {
                                if (v.lender) total = NP.plus(total, v.lender)
                                return total
                            }, 0)
                            let money = Math.abs(NP.minus(borrower, lender))
                            let obj = {
                                abstract: '',
                                subjectCode: data.subjectCode,
                                subject: data.subject,
                                currency: '人民币',
                                rateType: data.rateType,
                                rate: 1,
                                currencyAmount: money,
                                unit: null,
                                number: null,
                                price: null,
                                borrower: borrower > lender ? null : money,
                                lender: borrower > lender ? money : null,
                                isAllC: false,
                                accountItem: []
                            }
                            formData.child.push(obj)

                            await Credentials.create(formData)

                            for (let i = 0; i < formData.child.length; i++) {
                                let v = formData.child[i]
                                let sData = await Subject.findOne({
                                    accountSetId: data.accountSetId,
                                    code: v.subjectCode
                                })
                                let direction = sData.balance === '借方'
                                let accountingPeriod = cFilter.accountingPeriod

                                if (sData.eachBalance && sData.eachBalance.length) {
                                    let isPush = true
                                    let lastEach = null
                                    sData.eachBalance.forEach((e, i1) => {
                                        if (e.time === accountingPeriod) isPush = false
                                        if (i1 === sData.eachBalance.length - 1) lastEach = e
                                    })
                                    if (isPush) {
                                        let beginningBalance = 0
                                        if (accountingPeriod.split('-')[1] == 1) {
                                            let balance = sData.eachYearBalance.find(b => b.time === (accountingPeriod.split('-')[0] - 1))
                                            if (direction) {
                                                beginningBalance = NP.minus(NP.plus(balance && balance.beginningBalance || 0, balance && balance.borrower || 0), balance && balance.lender || 0)
                                            } else {
                                                beginningBalance = NP.minus(NP.plus(balance && balance.beginningBalance || 0, balance && balance.lender || 0), balance && balance.borrower || 0)
                                            }
                                        } else {
                                            if (direction) {
                                                beginningBalance = NP.minus(NP.plus(lastEach.beginningBalance || 0, lastEach.borrower || 0), lastEach.lender || 0)
                                            } else {
                                                beginningBalance = NP.minus(NP.plus(lastEach.beginningBalance || 0, lastEach.lender || 0), lastEach.borrower || 0)
                                            }
                                        }
                                        sData.eachBalance.push({
                                            time: accountingPeriod,
                                            borrower: 0,
                                            lender: 0,
                                            beginningBalance: beginningBalance
                                        })
                                    }
                                } else {
                                    let beginningBalance = 0
                                    if (direction) {
                                        beginningBalance = NP.minus(NP.plus(sData.beginningBalance || 0, sData.yearBorrow || 0), sData.yearCredit || 0)
                                    } else {
                                        beginningBalance = NP.minus(NP.plus(sData.beginningBalance || 0, sData.yearCredit || 0), sData.yearBorrow || 0)
                                    }
                                    sData.eachBalance = [{
                                        time: accountingPeriod,
                                        borrower: 0,
                                        lender: 0,
                                        beginningBalance: beginningBalance
                                    }]
                                }

                                // 科目余额
                                let balance = sData.subjectBalance !== null ? sData.subjectBalance : NP[direction ? 'minus' : 'plus'](NP[direction ? 'plus' : 'minus'](sData.beginningBalance || 0, sData.yearBorrow || 0), sData.yearCredit || 0)
                                if (v.borrower) {
                                    balance = NP[direction ? 'plus' : 'minus'](balance, v.borrower)
                                }
                                if (v.lender) {
                                    balance = NP[direction ? 'minus' : 'plus'](balance, v.lender)
                                }
                                sData.subjectBalance = balance
                                if (sData.parentId.length) {
                                    for (let p = 0; p < sData.parentId.length; p++) {
                                        await updateParentsSubject(sData.parentId[p], 0,0, accountingPeriod, v.accountingItem)
                                    }
                                }
                                await Subject.updateOne({_id: sData._id}, sData)
                                if (v.accountingItem && v.accountingItem.length) {
                                    await updateAccountingSubject(v.accountingItem, sData._id, 0, 0, accountingPeriod)
                                }
                            }
                            res.status(200).end();
                        } else {
                            next(new errors.BadRequest(`${cFilter.accountingPeriod}期无需调汇`));
                        }
                    }

                }
            } else {
                res.status(200).end();
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function finalTuningHistory(req, res, next) {
    L('Calling API Credentials.finalTuningHistory', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.accountingPeriod) {
            next(new errors.BadRequest('会计期间必填'));
        } else {
            let filter = {
                accountSetId: data.accountSetId
            }
            if (data.subjectCode) {
                filter.code = data.subjectCode
                if (data.subjectCodeEnd) {
                    filter.code = { $gte: data.subjectCode, $lte: data.subjectCodeEnd }
                }
            }

            let sData = await Subject.find(filter)
            let cFilter = {
                accountSetId: data.accountSetId,
                invalid: { $ne: true }
            }
            if (data.accountingPeriod) {
                let ap = new Date(data.accountingPeriod).toHawkDateString().split('-')
                cFilter.accountingPeriod = ap[0] + '-' + parseInt(ap[1])

                if (data.accountingPeriodEnd) {
                    let ape = new Date(data.accountingPeriodEnd).toHawkDateString().split('-')
                    cFilter.accountingPeriod = { $gte: ap[0] + '-' + parseInt(ap[1]), $lte:  ape[0] + '-' + parseInt(ape[1]) }
                }
            }
            let cData = await Credentials.find(cFilter)
            let result = []
            cData.forEach(v => {
                v.child.forEach(c => {
                    let fData = sData.find(s => s.code === c.subjectCode)
                    if (fData && c.oldRate && (data.currency === '所有币别' || data.currency === c.currency)) {
                        let fR = result.find(r => r.code === c.subjectCode)
                        let obj = {
                            ...c._doc,
                            accountingPeriod: v.accountingPeriod,
                            direction: fData.balance
                        }
                        if (fR) {
                            fR.child.push(obj)
                        } else {
                            result.push({
                                code: c.subjectCode,
                                child: [obj]
                            })
                        }
                    }
                })
            })
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function interest(req, res, next) {
    L('Calling API Credentials.interest', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let filter = {
                accountSetId: data.accountSetId,
                subjectDraw: true,
                draw: { $ne: 0 },
                currency: data.currency
            }
            if (data.subjectCode) {
                filter.code = data.subjectCode
                if (data.subjectCodeEnd) {
                    filter.code = { $gte: data.subjectCode, $lte: data.subjectCodeEnd }
                }
            }

            let sData = await Subject.find(filter)
            let cFilter = {
                accountSetId: data.accountSetId,
                invalid: { $ne: true },
                post: { $ne: null }
            }
            let cData = await Credentials.find(cFilter)
            let sCodeList = sData.map(s => s.code)
            res.status(200).json({
                subject: sData,
                credentials: cData.filter(v => v.child.find(c => sCodeList.includes(c.subjectCode)))
            });
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function carrForward(req, res, next) {
    L('Calling API Credentials.carrForward', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.time) {
            next(new errors.BadRequest(`请选择凭证日期`));
        } else if (!data.proofWordId) {
            next(new errors.BadRequest(`请选择凭证字`));
        } else if (!data.abstract) {
            next(new errors.BadRequest(`请输入凭证摘要`));
        } else {
            let cFilter = {
                accountSetId: data.accountSetId,
                post: null,
                invalid: { $ne: true }
            }
            if (data.time) {
                let ap = new Date(data.time).toHawkDateString().split('-')
                cFilter.accountingPeriod = ap[0] + '-' + parseInt(ap[1])
            }
            let cData = await Credentials.find(cFilter)
            if (cData.length) {
                next(new errors.BadRequest(`${cFilter.accountingPeriod}期还有未过账凭证，无法结转损益`));
            } else {
                let type = await SubjectType.find({
                    accountSetId: data.accountSetId,
                    type: 5
                })
                let tList = type.map(v => v.name)
                let subject = await Subject.find({
                    accountSetId: data.accountSetId,
                    type: { $in: tList }
                })
                let sList = subject.filter(v =>
                    subject.filter(f => {
                      return (f.parentId.length && f.parentId.includes(v._id.toString()))
                    }).length === 0 &&
                    (v.beginningBalance || v.yearBorrow || v.yearCredit)
                )

                if (sList.length) {
                    let formData = {
                        accountSetId: data.accountSetId,
                        time: data.time,
                        accountingPeriod: cFilter.accountingPeriod,
                        proofWordId: data.proofWordId,
                        proofWords: data.proofWords,
                        certificateNumber: data.certificateNumber,
                        child: [],
                        referenceInfo: '',
                        businessDate: data.time,
                        voucher: data.voucher,
                        audit: null,
                        post: null,
                        examine: null,
                        cashier: null,
                        handle: '',
                        des: '',
                        paymentMode: '',
                        paymentNo: '',
                        currentBusiness: '',
                        files: 0,
                        serialNumber: data.serialNumber,
                        systemModule: '',
                        description: '',
                        invalid: false
                    }

                    sList.forEach(v => {
                        let direction = v.balance === '借方'
                        let balance = v.subjectBalance  !== null ? v.subjectBalance : NP[direction ? 'minus' : 'plus'](NP[direction ? 'plus' : 'minus'](v.beginningBalance || 0, v.yearBorrow || 0), v.yearCredit || 0)
                        let obj = {
                            abstract: '',
                            subjectCode: v.code,
                            subject: v.name,
                            currency: v.currency !== '不核算' && v.currency !== '所有币别' ? v.currency : '人民币',
                            rateType: '公司汇率',
                            rate: '1',
                            currencyAmount: Math.abs(balance),
                            unit: null,
                            number: null,
                            price: null,
                            borrower: null,
                            lender: null,
                            isAllC: v.currency === '所有币别',
                            accountItem: []
                        }
                        if (balance > 0) {
                            obj[direction ? 'lender' : 'borrower'] = Math.abs(balance)
                        } else {
                            obj[direction ? 'borrower' : 'lender'] = Math.abs(balance)
                        }
                        if (formData.child.length === 0) {
                            obj.abstract = data.abstract
                        }
                        formData.child.push(obj)
                    })

                    if (formData.child.length) {
                        let borrower = formData.child.reduce((total, v) => {
                            if (v.borrower && v.subjectCode !== '6901') total = NP.plus(total, v.borrower)
                            return total
                        }, 0)
                        let lender = formData.child.reduce((total, v) => {
                            if (v.lender && v.subjectCode !== '6901') total = NP.plus(total, v.lender)
                            return total
                        }, 0)
                        let borrower1 = formData.child.reduce((total, v) => {
                            if (v.borrower && v.subjectCode === '6901') total = NP.plus(total, v.borrower)
                            return total
                        }, 0)
                        let lender1 = formData.child.reduce((total, v) => {
                            if (v.lender && v.subjectCode === '6901') total = NP.plus(total, v.lender)
                            return total
                        }, 0)
                        let balance = Math.abs(NP.minus(borrower1, lender1))
                        if (borrower !== 0) {
                            formData.child.push({
                                abstract: '',
                                subjectCode: '4103',
                                subject: '本年利润',
                                currency: '人民币',
                                rateType: '公司汇率',
                                rate: 1,
                                currencyAmount: Math.abs(borrower),
                                unit: null,
                                number: null,
                                price: null,
                                borrower: borrower > 0 ? null : borrower,
                                lender: borrower > 0 ? borrower : null,
                                isAllC: false,
                                accountItem: []
                            })
                        }
                        if (lender !== 0) {
                            formData.child.push({
                                abstract: '',
                                subjectCode: '4103',
                                subject: '本年利润',
                                currency: '人民币',
                                rateType: '公司汇率',
                                rate: 1,
                                currencyAmount: Math.abs(lender),
                                unit: null,
                                number: null,
                                price: null,
                                borrower: lender > 0 ? lender : null,
                                lender: lender > 0 ? null : lender,
                                isAllC: false,
                                accountItem: []
                            })
                        }
                        if (balance !== 0) {
                            formData.child.push({
                                abstract: '',
                                subjectCode: '4104.01',
                                subject: '提取法定盈余公积',
                                currency: '人民币',
                                rateType: '公司汇率',
                                rate: 1,
                                currencyAmount: balance,
                                unit: null,
                                number: null,
                                price: null,
                                borrower: borrower1 > lender1 ? null : balance,
                                lender: borrower1 > lender1 ? balance : null,
                                isAllC: false,
                                accountItem: []
                            })
                        }

                        // console.log(formData)
                        await Credentials.create(formData)

                        for (let i = 0; i < formData.child.length; i++) {
                            let v = formData.child[i]
                            let sData = await Subject.findOne({
                                accountSetId: data.accountSetId,
                                code: v.subjectCode
                            })
                            let direction = sData.balance === '借方'
                            let accountingPeriod = cFilter.accountingPeriod

                            if (sData.eachBalance && sData.eachBalance.length) {
                                let isPush = true
                                let lastEach = null
                                sData.eachBalance.forEach((e, i1) => {
                                    if (e.time === accountingPeriod) isPush = false
                                    if (i1 === sData.eachBalance.length - 1) lastEach = e
                                })
                                if (isPush) {
                                    let beginningBalance = 0
                                    if (accountingPeriod.split('-')[1] == 1) {
                                        let balance = sData.eachYearBalance.find(b => b.time === (accountingPeriod.split('-')[0] - 1))
                                        if (direction) {
                                            beginningBalance = NP.minus(NP.plus(balance && balance.beginningBalance || 0, balance && balance.borrower || 0), balance && balance.lender || 0)
                                        } else {
                                            beginningBalance = NP.minus(NP.plus(balance && balance.beginningBalance || 0, balance && balance.lender || 0), balance && balance.borrower || 0)
                                        }
                                    } else {
                                        if (direction) {
                                            beginningBalance = NP.minus(NP.plus(lastEach.beginningBalance || 0, lastEach.borrower || 0), lastEach.lender || 0)
                                        } else {
                                            beginningBalance = NP.minus(NP.plus(lastEach.beginningBalance || 0, lastEach.lender || 0), lastEach.borrower || 0)
                                        }
                                    }
                                    sData.eachBalance.push({
                                        time: accountingPeriod,
                                        borrower: 0,
                                        lender: 0,
                                        beginningBalance: beginningBalance
                                    })
                                }
                            } else {
                                let beginningBalance = 0
                                if (direction) {
                                    beginningBalance = NP.minus(NP.plus(sData.beginningBalance || 0, sData.yearBorrow || 0), sData.yearCredit || 0)
                                } else {
                                    beginningBalance = NP.minus(NP.plus(sData.beginningBalance || 0, sData.yearCredit || 0), sData.yearBorrow || 0)
                                }
                                sData.eachBalance = [{
                                    time: accountingPeriod,
                                    borrower: 0,
                                    lender: 0,
                                    beginningBalance: beginningBalance
                                }]
                            }

                            // 科目余额
                            let balance = sData.subjectBalance !== null ? sData.subjectBalance : NP[direction ? 'minus' : 'plus'](NP[direction ? 'plus' : 'minus'](sData.beginningBalance || 0, sData.yearBorrow || 0), sData.yearCredit || 0)
                            if (v.borrower) {
                                balance = NP[direction ? 'plus' : 'minus'](balance, v.borrower)
                            }
                            if (v.lender) {
                                balance = NP[direction ? 'minus' : 'plus'](balance, v.lender)
                            }
                            sData.subjectBalance = balance
                            if (sData.parentId.length) {
                                for (let p = 0; p < sData.parentId.length; p++) {
                                    await updateParentsSubject(sData.parentId[p], 0,0, accountingPeriod, v.accountingItem)
                                }
                            }
                            await Subject.updateOne({_id: sData._id}, sData)
                            if (v.accountingItem && v.accountingItem.length) {
                                await updateAccountingSubject(v.accountingItem, sData._id, 0, 0, accountingPeriod)
                            }
                        }
                        res.status(200).end();
                    } else {
                        next(new errors.BadRequest(`${cFilter.accountingPeriod}期无需结转损益`));
                    }
                } else {
                    next(new errors.BadRequest(`${cFilter.accountingPeriod}期无需结转损益`));
                }
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function invoicing(req, res, next) {
    L('Calling API Credentials.invoicing', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.accountingPeriod) {
            next(new errors.BadRequest('会计期间必填'));
        } else {
            if (data.isInvoicing === '结账') {
                let cData = await Credentials.find({
                    accountSetId: data.accountSetId,
                    post: null,
                    invalid: { $ne: true },
                    accountingPeriod: data.accountingPeriod
                })

                if (cData.length) {
                    next(new errors.BadRequest(`${data.accountingPeriod}还有未过账凭证，无法期末结账`));
                } else {
                    let sData = await Subject.find({ accountSetId: data.accountSetId })
                    let cList = await Credentials.find({
                        accountSetId: data.accountSetId,
                        post: { $ne: null },
                        invalid: { $ne: true },
                        accountingPeriod: data.accountingPeriod
                    })

                    if (cList.length === 0) {
                        next(new errors.BadRequest(`${data.accountingPeriod}没有过账凭证，无法期末结账`));
                    } else {
                        let result = []
                        let resultA = []
                        cList.forEach(v => {
                            v.child.forEach(c => {
                                let isFind = false
                                result.forEach(f => {
                                    if (f.code === c.subjectCode) {
                                        isFind = true
                                        if (c.borrower) f.borrower = NP.plus(f.borrower, c.borrower)
                                        if (c.lender) f.lender = NP.plus(f.lender, c.lender)
                                    }
                                })
                                if (!isFind) {
                                    result.push({
                                        code: c.subjectCode,
                                        borrower: c.borrower || 0,
                                        lender: c.lender || 0
                                    })
                                }
                                if (c.accountItem.length) {
                                    let isAFind = false
                                    let code = c.accountingItem.map(a => a.code).join('_')
                                    let name = c.accountingItem.map(a => a.name).join('_')
                                    resultA.forEach(f => {
                                        if (f.sCode === c.subjectCode && f.code === code && f.name === name) {
                                            isFind = true
                                            if (c.borrower) f.borrower = NP.plus(f.borrower, c.borrower)
                                            if (c.lender) f.lender = NP.plus(f.lender, c.lender)
                                        }
                                    })
                                    if (!isAFind) {
                                        resultA.push({
                                            sCode: c.subjectCode,
                                            code: code,
                                            name: name,
                                            borrower: c.borrower || 0,
                                            lender: c.lender || 0
                                        })
                                    }
                                }
                            })
                        })

                        let ap = data.accountingPeriod.split('-')
                        let pushTime = ap[1] === 12 ? (parseInt(ap[0]) + 1) + '-1' : ap[0] + '-' + (parseInt(ap[1]) + 1)

                        for (let i = 0; i < sData.length; i++) {
                            let v = sData[i]
                            let fData = result.find(r => r.code === v.code)
                            if (fData) {
                                let direction = v.balance === '借方'
                                let allBorrower = 0
                                let allLender = 0

                                v.eachBalance.forEach(f => {
                                    if (f.time === data.accountingPeriod) {
                                        if (f.borrower !== fData.borrower || f.lender !== fData.lender) {
                                            f.borrower = fData.borrower
                                            f.lender = fData.lender
                                        }
                                    }
                                    if (f.time.includes(ap[0])) {
                                        allBorrower = NP.plus(allBorrower,  f.borrower || 0)
                                        allLender = NP.plus(allLender,  f.lender || 0)
                                    }
                                })
                                if (v.yearBorrow !== allBorrower || v.yearCredit !== allLender) {
                                    v.yearBorrow = allBorrower
                                    v.yearCredit = allLender
                                }
                                let balance = NP[direction ? 'minus' : 'plus'](NP[direction ? 'plus' : 'minus'](v.beginningBalance || 0, v.yearBorrow || 0), v.yearCredit || 0)
                                if (v.subjectBalance !== balance) {
                                    v.subjectBalance = balance
                                }

                                let isEFind = false
                                v.eachBalance.forEach(f => {
                                    if (f.time === pushTime) {
                                        f.beginningBalance = v.subjectBalance
                                        isEFind = true
                                    }
                                })
                                if (!isEFind) {
                                    v.eachBalance.push({
                                        time: pushTime,
                                        borrower: 0,
                                        lender: 0,
                                        beginningBalance: v.subjectBalance
                                    })
                                }

                                let isYFind = false
                                v.eachYearBalance.forEach(f => {
                                    if (f.time === ap[0]) {
                                        isYFind = true
                                        if (f.borrower !== allBorrower || f.lender !== allLender) {
                                            f.borrower = allBorrower
                                            f.lender = allLender
                                        }
                                    }
                                })
                                if (!isYFind) {
                                    v.eachYearBalance.push({
                                        time: ap[0],
                                        borrower: allBorrower,
                                        lender: allLender,
                                        beginningBalance: v.beginningBalance
                                    })
                                }
                                if (ap[1] === 12) {
                                    v.eachYearBalance.push({
                                        time: parseInt(ap[0]) + 1,
                                        borrower: 0,
                                        lender: 0,
                                        beginningBalance: v.subjectBalance
                                    })
                                    v.beginningBalance = v.subjectBalance
                                }
                                // console.log(v)
                                if (v.child && v.child.length) {
                                    v.child.forEach(cf => {
                                        let cFData = resultA.find(r => r.sCode === v.code && r.code === cf.code && r.name === cf.name )
                                        if (cFData) {
                                            let cFAllBorrower = 0
                                            let cFAllLender = 0

                                            cf.eachBalance.forEach(f => {
                                                if (f.time === data.accountingPeriod) {
                                                    if (f.borrower !== cFData.borrower || f.lender !== cFData.lender) {
                                                        f.borrower = cFData.borrower
                                                        f.lender = cFData.lender
                                                    }
                                                }
                                                if (f.time.includes(ap[0])) {
                                                    cFAllBorrower = NP.plus(cFAllBorrower, f.borrower || 0)
                                                    cFAllLender = NP.plus(cFAllLender, f.lender || 0)
                                                }
                                            })
                                            if (cf.yearBorrow !== cFAllBorrower || cf.yearCredit !== cFAllLender) {
                                                cf.yearBorrow = cFAllBorrower
                                                cf.yearCredit = cFAllLender
                                            }
                                            let cFBalance = NP[direction ? 'minus' : 'plus'](NP[direction ? 'plus' : 'minus'](cf.beginningBalance || 0, cf.yearBorrow || 0), cf.yearCredit || 0)

                                            let isCFEFind = false
                                            cf.eachBalance.forEach(f => {
                                                if (f.time === pushTime) {
                                                    f.beginningBalance = cFBalance
                                                    isCFEFind = true
                                                }
                                            })
                                            if (!isCFEFind) {
                                                cf.eachBalance.push({
                                                    time: pushTime,
                                                    borrower: 0,
                                                    lender: 0,
                                                    beginningBalance: cFBalance
                                                })
                                            }

                                            let isCFYFind = false
                                            cf.eachYearBalance.forEach(f => {
                                                if (f.time === ap[0]) {
                                                    isCFYFind = true
                                                    if (f.borrower !== cFAllBorrower || f.lender !== cFAllLender) {
                                                        f.borrower = cFAllBorrower
                                                        f.lender = cFAllLender
                                                    }
                                                }
                                            })
                                            if (!isCFYFind) {
                                                cf.eachYearBalance.push({
                                                    time: ap[0],
                                                    borrower: cFAllBorrower,
                                                    lender: cFAllLender,
                                                    beginningBalance: cf.beginningBalance
                                                })
                                            }
                                            if (ap[1] === 12) {
                                                cf.eachYearBalance.push({
                                                    time: parseInt(ap[0]) + 1,
                                                    borrower: 0,
                                                    lender: 0,
                                                    beginningBalance: cFBalance
                                                })
                                                cf.beginningBalance = cFBalance
                                            }
                                        }
                                    })
                                }
                                await Subject.updateOne({_id: v._id}, v)
                            }
                        }
                        // console.log(pushTime)
                        await AccountSet.updateOne({_id: data.accountSetId}, {$set: {currentAccountingPeriod: pushTime}})
                        res.status(200).end();
                    }
                }
            } else {
                let accountData = await AccountSet.findOne({_id: data.accountSetId})
                let accountingPeriod = accountData.accountingYear + '-' + accountData.accountingPeriod
                let ap = data.accountingPeriod.split('-')
                let lastPeriod = ap[1] === 1 ? (parseInt(ap[0]) - 1) + '-12' : ap[0] + '-' + (parseInt(ap[1]) - 1)
                if (data.accountingPeriod === accountingPeriod) {
                    next(new errors.BadRequest(`${accountingPeriod}期凭证还没结账，无需反结账`));
                } else {
                    let cData = await Credentials.find({
                        accountSetId: data.accountSetId,
                        accountingPeriod: data.accountingPeriod
                    })
                    if (cData.length) {
                        next(new errors.BadRequest(`${data.accountingPeriod}期还有凭证，无法反结账上期凭证`));
                    } else {
                        await AccountSet.updateOne({_id: data.accountSetId}, {$set: {currentAccountingPeriod: lastPeriod}})
                        res.status(200).end();
                    }
                }
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}


async function automaticTransfer(req, res, next) {
    L('Calling API Credentials.automaticTransfer', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('自动转账模板名称必填'));
        } else if (!data.mechanism) {
            next(new errors.BadRequest('自动转账模板机制凭证必填'));
        } else if (!data.period.length) {
            next(new errors.BadRequest('自动转账模板转账期间必填'));
        } else if (!data.proofWords) {
            next(new errors.BadRequest('自动转账模板凭证字必填'));
        } else if (data.child.length < 2) {
            next(new errors.BadRequest('自动转账模板内容至少两条'));
        }  else {
            let accountSet = await AccountSet.findOne({_id: data.accountSetId})
            let period = accountSet.currentAccountingPeriod || accountSet.accountingYear + '-' + accountSet.accountingPeriod
            if (!data.period.includes(parseInt(period.split('-')[1]))) {
                next(new errors.BadRequest(`该转账模板不包含${period}期凭证自动转账`));
            } else if (data.child.filter(c => c.mode === '转入').length !== 1) {
                next(new errors.BadRequest(`该转账模板内容必须只能有一条转入的转账方式，无法自动转账`));
            } else if (!data.child.filter(c => c.mode !== '转入').length) {
                next(new errors.BadRequest(`该转账模板内容没有转出选项，无法自动转账`));
            } else {
                let sData = await Subject.find({
                    accountSetId: data.accountSetId,
                    code: { $in: data.child.map(v => v.subjectCode) }
                })
                let cData = await Credentials.find({
                    accountSetId: data.accountSetId,
                    post: null,
                    invalid: { $ne: true },
                    accountingPeriod: period
                })
                let result = []
                let isDo = true
                let lastMode = ''
                for (let i = 0; i < data.child.length; i++) {
                    let item = data.child[i]
                    let fData = sData.find(v => v.code === item.subjectCode)
                    let direction = fData.balance === '借方'
                    let rateType =  await ExchangeRateType.find({
                        accountSetId: data.accountSetId,
                        name: item.rateType
                    })
                    let rateData = await ExchangeRate.findOne({
                        accountSetId: data.accountSetId,
                        typeId: rateType._id,
                        currency: item.currency
                    })
                    if (item.currency !== accountSet.unit) {
                        if (!rateData) {
                            next(new errors.BadRequest(`汇率体系-${item.rateType}找不到${item.currency}的汇率`));
                            isDo = false
                            return
                        } else {
                            if (
                                moment(rateData.effectiveDate).format('YYYY-MM-DD').isAfter(new Date(period)) ||
                                moment(rateData.expiryDate).format('YYYY-MM-DD').isBefore(new Date(period))
                            ) {
                                next(new errors.BadRequest(`汇率体系${item.rateType}中的${item.currency}汇率的日期设置不正确`));
                                isDo = false
                                return
                            }
                        }
                    }
                    let obj = {
                        abstract: item.abstract || '',
                        subjectCode: item.subjectCode,
                        subject: item.subject,
                        currency: item.currency,
                        rateType: item.rateType,
                        rate: item.currency === accountSet.unit ? 1 : rateData.rate,
                        currencyAmount: null,
                        unit: null,
                        number: null,
                        price: null,
                        borrower: null,
                        lender: null,
                        isAllC: false,
                        accountItem: item.accountingItem
                    }
                    let borrower = 0
                    let lender = 0
                    if (item.isPost) {
                        cData.forEach(c => {
                            c.child.forEach(cc => {
                                if (cc.subjectCode.includes(item.subjectCode)) {
                                    if (cc.borrower) {
                                        borrower = NP.plus(borrower, cc.borrower)
                                    }
                                    if (cc.lender) {
                                        lender = NP.plus(lender, cc.lender)
                                    }
                                }
                            })
                        })
                    }

                    if (item.mode === '按比例转出余额') {
                        let balance = item.isPost ? fData.subjectBalance || 0 : NP[direction ? 'minus' : 'plus'](NP[direction ? 'plus' : 'minus'](fData.beginningBalance || 0, fData.yearBorrow || 0), fData.yearCredit || 0)
                        if (balance > 0) {
                            obj.lender = balance
                            obj.currencyAmount = NP.divide(balance, obj.rate)
                            result.push(obj)
                        }
                        lastMode = item.mode
                    } else if (item.mode === '按比例转出借方发生额') {
                        let allBorrower = NP.plus(fData.yearBorrow || 0, borrower)
                        if (allBorrower > 0) {
                            obj.lender = allBorrower
                            obj.currencyAmount = NP.divide(allBorrower, obj.rate)
                            result.push(obj)
                        }
                        lastMode = item.mode
                    } else if (item.mode === '按比例转出贷方发生额') {
                        let allLender = NP.plus(fData.yearCredit || 0, lender)
                        if (allLender > 0) {
                            obj.lender = allLender
                            obj.currencyAmount = NP.divide(allLender, obj.rate)
                            result.push(obj)
                        }
                        lastMode = item.mode
                    }
                }

                if (result.length > 0 && isDo) {
                    let lastData = await Credentials.find({
                        accountSetId: data.accountSetId
                    }).sort({createdAt: -1})
                    let number = lastData.filter(r => r.proofWordId.toString() === data.proofWordId.toString()).length + 1
                    let lastDataTime = moment(new Date(period)).endOf('month').format('YYYY-MM-DD')
                    let formData = {
                        accountSetId: data.accountSetId,
                        time: lastDataTime,
                        accountingPeriod: period,
                        proofWordId: data.proofWordId,
                        proofWords: data.proofWords,
                        certificateNumber: number,
                        child: result,
                        referenceInfo: '',
                        businessDate: lastDataTime,
                        voucher: req.user.sub,
                        audit: null,
                        post: null,
                        examine: null,
                        cashier: null,
                        handle: '',
                        des: '',
                        paymentMode: '',
                        paymentNo: '',
                        currentBusiness: '',
                        files: 0,
                        serialNumber: lastData.length + 1,
                        systemModule: '',
                        description: '',
                        invalid: false
                    }

                    let borrower = formData.child.reduce((total, v) => {
                        if (v.lender) total = NP.plus(total, v.lender)
                        return total
                    }, 0)
                    let fData = data.child.find(v => v.mode === '转入')
                    let rateType =  await ExchangeRateType.find({
                        accountSetId: data.accountSetId,
                        name: fData.rateType
                    })
                    let rateData = await ExchangeRate.findOne({
                        accountSetId: data.accountSetId,
                        typeId: rateType._id,
                        currency: fData.currency
                    })
                    if (fData.currency !== accountSet.unit ) {
                        if (!rateData) {
                            next(new errors.BadRequest(`汇率体系-${fData.rateType}找不到${fData.currency}的汇率`));
                            return
                        } else {
                            if (
                                moment(rateData.effectiveDate).format('YYYY-MM-DD').isAfter(new Date(period)) ||
                                moment(rateData.expiryDate).format('YYYY-MM-DD').isBefore(new Date(period))
                            ) {
                                next(new errors.BadRequest(`汇率体系${fData.rateType}中的${fData.currency}汇率的日期设置不正确`));
                                return
                            }
                        }
                    }
                    let obj = {
                        abstract: fData.abstract || '',
                        subjectCode: fData.subjectCode,
                        subject: fData.subject,
                        currency: fData.currency,
                        rateType: fData.rateType,
                        rate: fData.currency === accountSet.unit ? 1 : rateData.rate,
                        currencyAmount: null,
                        unit: null,
                        number: null,
                        price: null,
                        borrower: borrower,
                        lender: null,
                        isAllC: false,
                        accountItem: fData.accountingItem
                    }
                    obj.currencyAmount = NP.divide(borrower, obj.rate)
                    formData.child.push(obj)

                    await Credentials.create(formData)

                    await AutomaticTransfer.updateOne({
                        _id: data._id
                    }, {
                        $set: {
                            lastTime: new Date(),
                            lastMode: lastMode
                        }
                    })

                    for (let i = 0; i < formData.child.length; i++) {
                        let v = formData.child[i]
                        let subjectData = sData.find(f => f.code === v.subjectCode)
                        let direction = subjectData.balance === '借方'
                        let accountingPeriod = period

                        if (subjectData.eachBalance && subjectData.eachBalance.length) {
                            let isPush = true
                            let lastEach = null
                            subjectData.eachBalance.forEach((e, i1) => {
                                if (e.time === accountingPeriod) isPush = false
                                if (i1 === subjectData.eachBalance.length - 1) lastEach = e
                            })
                            if (isPush) {
                                let beginningBalance = 0
                                if (accountingPeriod.split('-')[1] == 1) {
                                    let balance = subjectData.eachYearBalance.find(b => b.time === (accountingPeriod.split('-')[0] - 1))
                                    if (direction) {
                                        beginningBalance = NP.minus(NP.plus(balance && balance.beginningBalance || 0, balance && balance.borrower || 0), balance && balance.lender || 0)
                                    } else {
                                        beginningBalance = NP.minus(NP.plus(balance && balance.beginningBalance || 0, balance && balance.lender || 0), balance && balance.borrower || 0)
                                    }
                                } else {
                                    if (direction) {
                                        beginningBalance = NP.minus(NP.plus(lastEach.beginningBalance || 0, lastEach.borrower || 0), lastEach.lender || 0)
                                    } else {
                                        beginningBalance = NP.minus(NP.plus(lastEach.beginningBalance || 0, lastEach.lender || 0), lastEach.borrower || 0)
                                    }
                                }
                                subjectData.eachBalance.push({
                                    time: accountingPeriod,
                                    borrower: 0,
                                    lender: 0,
                                    beginningBalance: beginningBalance
                                })
                            }
                        } else {
                            let beginningBalance = 0
                            if (direction) {
                                beginningBalance = NP.minus(NP.plus(subjectData.beginningBalance || 0, subjectData.yearBorrow || 0), subjectData.yearCredit || 0)
                            } else {
                                beginningBalance = NP.minus(NP.plus(subjectData.beginningBalance || 0, subjectData.yearCredit || 0), subjectData.yearBorrow || 0)
                            }
                            subjectData.eachBalance = [{
                                time: accountingPeriod,
                                borrower: 0,
                                lender: 0,
                                beginningBalance: beginningBalance
                            }]
                        }

                        // 科目余额
                        let balance = subjectData.subjectBalance !== null ? subjectData.subjectBalance : NP[direction ? 'minus' : 'plus'](NP[direction ? 'plus' : 'minus'](subjectData.beginningBalance || 0, sData.yearBorrow || 0), sData.yearCredit || 0)
                        if (v.borrower) {
                            balance = NP[direction ? 'plus' : 'minus'](balance, v.borrower)
                        }
                        if (v.lender) {
                            balance = NP[direction ? 'minus' : 'plus'](balance, v.lender)
                        }
                        subjectData.subjectBalance = balance
                        await Subject.updateOne({_id: subjectData._id}, subjectData)
                        if (v.accountingItem && v.accountingItem.length) {
                            await updateAccountingSubject(v.accountingItem, subjectData._id, 0, 0, accountingPeriod)
                        }
                    }
                    res.status(200).json(`${formData.proofWords}-${formData.certificateNumber}`);
                } else {
                    next(new errors.BadRequest(`当前期间${period}不需要生成转账凭证，没有生成转账凭证`));
                }
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function moreColumn(req, res, next) {
    L('Calling API Credentials.moreColumn', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.subjectCode) {
            next(new errors.BadRequest('科目必填'));
        } else {
            let filter = {
                accountSetId: data.accountSetId,
                invalid: {$ne: true }
            }
            if (!data.post) filter.post = { $ne: null }
            if (data.accountingPeriod) {
                let ap = new Date(data.accountingPeriod).toHawkDateString().split('-')
                filter.accountingPeriod = ap[0] + '-' + parseInt(ap[1])

                if (data.accountingPeriodEnd) {
                    let ape = new Date(data.accountingPeriodEnd).toHawkDateString().split('-')
                    filter.accountingPeriod = { $gte: ap[0] + '-' + parseInt(ap[1]), $lte:  ape[0] + '-' + parseInt(ape[1]) }
                }
            }

            let cData = await Credentials.find(filter)
            let sData = await Subject.findOne({
                accountSetId: data.accountSetId,
                code: data.subjectCode
            })
            let list = cData.filter(v => v.child.filter(f => f.subjectCode.includes(data.subjectCode)).length)
            let subjectList = []
            let accountItem = []
            if (data.accountItem) {
                switch (data.accountItem) {
                    case '客户':
                        accountItem = await Customer.find({accountSetId: data.accountSetId})
                        break
                    case '部门':
                        accountItem = await Department.find({accountSetId: data.accountSetId})
                        break
                    case '职员':
                        accountItem = await Clerk.find({accountSetId: data.accountSetId})
                        break
                    case '供应商':
                        accountItem = await Supplier.find({accountSetId: data.accountSetId})
                        break
                    case '费用':
                        accountItem = await Cost.find({accountSetId: data.accountSetId})
                        break
                    case '银行账户':
                        accountItem = await BankAccount.find({accountSetId: data.accountSetId})
                        break
                    case '现金流量项目':
                        accountItem = await CashFlow.find({accountSetId: data.accountSetId})
                        break
                }
            } else {
                subjectList = await Subject.find({
                    accountSetId: data.accountSetId,
                    parentId: { $in: [sData._id.toString()] }
                })
            }
            let obj = {
                accountItem,
                list,
                subjectList
            }
            if (sData.eachBalance && sData.eachBalance.length) {
                let ap = new Date(data.accountingPeriod).toHawkDateString().split('-')
                let time = ap[0] + '-' + parseInt(ap[1])
                let balance = sData.eachBalance.find(v => v.time === time)
                obj.balance = {
                    time: time,
                    balance: sData.balance,
                    borrower: 0,
                    lender: 0,
                    beginningBalance: balance ? balance.beginningBalance : 0
                }
            } else {
                let beginningBalance = 0
                if (sData.balance === '借方') {
                    beginningBalance = NP.minus(NP.plus(sData.beginningBalance || 0, sData.yearBorrow || 0), sData.yearCredit || 0)
                } else {
                    beginningBalance = NP.minus(NP.plus(sData.beginningBalance || 0, sData.yearCredit || 0), sData.yearBorrow || 0)
                }
                obj.balance = {
                    time: data.accountingPeriod,
                    balance: sData.balance,
                    borrower: 0,
                    lender: 0,
                    beginningBalance: beginningBalance
                }
            }
            res.status(200).json(obj);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function credentialsUnPost(req, res, next) {
    L('Calling API Credentials.credentialsUnPost', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let unPost = async (unPostData, accountingPeriod, isEnd) => {
                await Credentials.updateOne({
                    _id: unPostData.id
                }, {$set: {post: null}})
                for (let index = 0; index < unPostData.child.length; index++) {
                    let c = unPostData.child[index]
                    let sData = await Subject.findOne({
                        accountSetId: data.accountSetId,
                        code: c.subjectCode
                    })
                    if (sData.eachBalance && sData.eachBalance.length) {
                        sData.eachBalance.forEach((v, i) => {
                            if (v.time === accountingPeriod) {
                                v.borrower = NP.minus(v.borrower || 0, c.borrower || 0)
                                v.lender = NP.minus(v.lender || 0, c.lender || 0)
                            }
                        })
                        sData.yearBorrow = NP.minus(sData.yearBorrow || 0, c.borrower || 0)
                        sData.yearCredit = NP.minus(sData.yearCredit || 0, c.lender || 0)
                        await Subject.updateOne({_id: sData._id}, sData)
                        if (sData.parentId.length) {
                            for (let p = 0; p < sData.parentId.length; p++) {
                                let fData = await Subject.findOne({_id: sData.parentId[p]})
                                if (fData.eachBalance && fData.eachBalance.length) {
                                    fData.eachBalance.forEach((v, i) => {
                                        if (v.time === accountingPeriod) {
                                            v.borrower = NP.minus(v.borrower || 0, c.borrower || 0)
                                            v.lender = NP.minus(v.lender || 0, c.lender || 0)
                                        }
                                    })
                                    fData.yearBorrow = NP.minus(fData.yearBorrow || 0, c.borrower || 0)
                                    fData.yearCredit = NP.minus(fData.yearCredit || 0, c.lender || 0)
                                    await Subject.updateOne({_id: fData._id}, fData)
                                    if (c.accountingItem.length) {
                                        await updateAccountingSubject(c.accountingItem, sData.parentId[p], c.borrower, c.lender, accountingPeriod, true)
                                    }
                                }
                            }
                        }
                        if (c.accountingItem.length) {
                            await updateAccountingSubject(c.accountingItem, sData._id, c.borrower, c.lender, accountingPeriod, true)
                        }
                    }
                }
                if (isEnd) res.status(200).end();
            }
            if (data.id) {
                // 反过账当前所选
                let accountData = await AccountSet.findOne({_id: data.accountSetId})
                let accountingPeriod = accountData.currentAccountingPeriod || accountData.accountingYear + '-' + accountData.accountingPeriod
                let cData = await Credentials.findOne({_id: data.id})
                if (cData.accountingPeriod === accountingPeriod) {
                    await unPost(cData, accountingPeriod, true)
                } else {
                    if (cData.accountingPeriod > accountingPeriod) {
                        next(new errors.BadRequest(`${accountingPeriod}期凭证还没结账，无法反过账${cData.accountingPeriod}期凭证`));
                    } else {
                        next(new errors.BadRequest(`${accountingPeriod}期凭证已结账，无法反过账${cData.accountingPeriod}期凭证`));
                    }
                }
            } else if (data.accountingPeriod) {
                // 反过账当期所有凭证
                let cList = await Credentials.find({
                    accountingPeriod: data.accountingPeriod,
                    post: { $ne: null }
                })
                if (cList.length) {
                    for (let i = 0; i < cList.length; i++) {
                        await unPost(cList[i], data.accountingPeriod, i === (cList.length - 1))
                    }
                } else {
                    next(new errors.BadRequest(`${data.accountingPeriod}期没有过账凭证，无需反过账`));
                }

            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function credentialsBroken(req, res, next) {
    L('Calling API Credentials.credentialsBroken', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let accountData = await AccountSet.findOne({_id: data.accountSetId})
            let accountingPeriod = accountData.currentAccountingPeriod || accountData.accountingYear + '-' + accountData.accountingPeriod
            let list = await Credentials.find({
                accountSetId: data.accountSetId,
                accountingPeriod: accountingPeriod
            })
            let lastList = await Credentials.find({
                accountSetId: data.accountSetId,
                accountingPeriod: {$lt: accountingPeriod}
            })
            let proof = await ProofWords.find({
                accountSetId: data.accountSetId
            })
            for (let index = 1; index < proof.length; index++) {
                let p = proof[index]
                let pList = list.filter(l => l.proofWordId.toString() === p._id.toString()).sort((x, y) => x.certificateNumber - y.certificateNumber)
                let pLastList = lastList.filter(l => l.proofWordId.toString() === p._id.toString()).sort((x, y) => x.certificateNumber - y.certificateNumber)
                for (let i = 0; i < pList.length; i++) {
                    if (i === 0) {
                        let lastCertificateNumber = pLastList.length ? pLastList[pLastList.length - 1].certificateNumber + 1 : 1
                        if (pList[i].certificateNumber !== lastCertificateNumber) {
                            pList[i].certificateNumber = lastCertificateNumber
                        }
                    } else {
                        if (pList[i].certificateNumber !== (pList[i - 1].certificateNumber + 1)) {
                            pList[i].certificateNumber = pList[i - 1].certificateNumber + 1
                        }
                    }
                    await Credentials.updateOne({_id: pList[i]._id}, {$set: {certificateNumber: pList[i].certificateNumber}})
                }
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

// 凭证批量更新（只用于前端批量审核等操作）
async function credentialsListUpdate(req, res, next) {
    L('Calling API Credentials.credentialsListUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.type) {
            next(new errors.BadRequest('批量操作必填'));
        } else {
            if (data.type === 'audit') {
                await Credentials.updateMany({
                    accountSetId: data.accountSetId,
                    voucher: { $ne: req.user.sub },
                    audit: null,
                    post: null
                }, {
                    $set: { audit: req.user.sub }
                })
            } else if (data.type === 'unAudit') {
                await Credentials.updateMany({
                    accountSetId: data.accountSetId,
                    audit: req.user.sub,
                    post: null
                }, {
                    $set: { audit: null }
                })
            } else if (data.type === 'cashier') {
                await Credentials.updateMany({
                    accountSetId: data.accountSetId,
                    cashier: null,
                    post: null
                }, {
                    $set: { cashier: req.user.sub }
                })
            } else if (data.type === 'unCashier') {
                await Credentials.updateMany({
                    accountSetId: data.accountSetId,
                    cashier: req.user.sub,
                    post: null
                }, {
                    $set: { cashier: null }
                })
            } else if (data.type === 'examine') {
                await Credentials.updateMany({
                    accountSetId: data.accountSetId,
                    examine: null,
                    post: null
                }, {
                    $set: { examine: req.user.sub }
                })
            } else if (data.type === 'unExamine') {
                await Credentials.updateMany({
                    accountSetId: data.accountSetId,
                    examine: req.user.sub,
                    post: null
                }, {
                    $set: { examine: null }
                })
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
