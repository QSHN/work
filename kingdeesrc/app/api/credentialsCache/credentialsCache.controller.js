const errors = require('@lib/errors');
const L = require('debug')('app:api');

const CredentialsCache = require('./credentialsCache.model');
const Credentials = require('../credentials/credentials.model');
const PurchaseWarehouse = require('../purchaseWarehouse/purchaseWarehouse.model');
const PurchaseReturn = require('../purchaseReturn/purchaseReturn.model');
const SalesWarehouse = require('../salesWarehouse/salesWarehouse.model');
const SalesReturn = require('../salesReturn/salesReturn.model');
const WarehouseIn = require('../warehouseIn/warehouseIn.model');
const WarehouseOut = require('../warehouseOut/warehouseOut.model');
const WarehouseAllocatingIn = require('../warehouseAllocatingIn/warehouseAllocatingIn.model');
const WarehouseAllocatingOut = require('../warehouseAllocatingOut/warehouseAllocatingOut.model');
const WarehouseDiskDeficient = require('../warehouseDiskDeficient/warehouseDiskDeficient.model');
const WarehouseDiskSurplus = require('../warehouseDiskSurplus/warehouseDiskSurplus.model');
const ReceivableCollection = require('../receivableCollection/receivableCollection.model');
const ReceivablePayments = require('../receivablePayments/receivablePayments.model');
const ReceivableRefund = require('../receivableRefund/receivableRefund.model');
const ReceivableOther = require('../receivableOther/receivableOther.model');
const ReceivableVerification = require('../receivableVerification/receivableVerification.model');
const PayableCollection = require('../payableCollection/payableCollection.model');
const PayablePayments = require('../payablePayments/payablePayments.model');
const PayableRefund = require('../payableRefund/payableRefund.model');
const PayableOther = require('../payableOther/payableOther.model');

const CredentialsOrder = require('../credentialsOrder/credentialsOrder.model');
const ProofWords = require('../proofWords/proofWords.model');
const Customer = require('../customer/customer.model');
const Supplier = require('../supplier/supplier.model');
const CommodityInfo = require('../commodityInfo/commodityInfo.model');
const IncomeCategory = require('../incomeCategory/incomeCategory.model');
const SpendingCategory = require('../spendingCategory/spendingCategory.model');
const Department = require('../department/department.model');
const BankAccount = require('../bankAccount/bankAccount.model');
const FeeDiscount = require('../feeDiscount/feeDiscount.model');
const Subject = require('../subject/subject.model');

const pushMsg = require('../message/message.controller').pushMsg;
const NP = require('number-precision');

const getAccountingItemInfo = async (type, v) => {
    let fData = null
    if (type === '客户') {
        fData = await Customer.findOne({_id: v.customerId})
    } else if (type === '部门') {
        let departmentId = v.departmentId ||  v.customerDepartmentId
        fData = await Department.findOne({_id: departmentId})
    } else if (type === '供应商') {
        fData = await Supplier.findOne({_id: v.supplierId})
    }
    return {
        type: type,
        code: fData ? fData.code : null,
        name: fData ? fData.name : null,
        _id: fData ? fData._id : null
    }
}
const getMoney = (type, v, commodityIndex = null, orderType, category) => {
    let money = 0
    if (orderType === '采购入库单') {
        switch (type) {
            case '入库成本' :
                let purchase = v.purchaseExpense.reduce((total, r) => (total = NP.plus(total, r.money || 0)), 0)
                if (commodityIndex !== null) {
                    let p = (NP.divide(purchase, v.list.length)).toFixed(2)
                    money = NP.plus(v.list[commodityIndex].deliveryCost, parseFloat(p))
                } else {
                    let total = v.list.reduce((total, r) => (total = NP.plus(total, r.deliveryCost || 0)), 0)
                    money = NP.plus(total, purchase)
                }
                break
            case '本单付款合计' :
                money = v.orderMoney
                break
            case '整单折扣额' :
                money = v.discount || 0
                break
            case '采购费用' :
                money = v.purchaseExpense.reduce((total, r) => (total = NP.plus(total, r.money || 0)), 0)
                break
            case '税额' :
                money = v.list.reduce((total, r) => (total = NP.plus(total, r.payable || 0)), 0)
                break
        }
    } else if (orderType === '采购退货单') {
        switch (type) {
            case '实际不含税金额' :
                if (commodityIndex !== null) {
                    money = NP.times(v.list[commodityIndex].reStorage || 0, v.list[commodityIndex].price || 0)
                } else {
                    money = v.list.reduce((total, r) => (total = NP.plus(total, NP.times(r.reStorage || 0, r.price || 0))), 0)
                }
                break
            case '本单应退账款' :
                money = v.orderMoney
                break
            case '整单折扣额' :
                money = v.discount || 0
                break
            case '税额' :
                money = v.list.reduce((total, r) => (total = NP.plus(total, r.payable || 0)), 0)
                break
        }
    } else if (orderType === '销售出库单') {
        switch (type) {
            case '出库成本' :
                let purchase = v.purchaseExpense.reduce((total, r) => (total = NP.plus(total, r.money || 0)), 0)
                if (commodityIndex !== null) {
                    let p = (NP.divide(purchase, v.list.length)).toFixed(2)
                    money = NP.plus(v.list[commodityIndex].deliveryCost, parseFloat(p))
                } else {
                    let total = v.list.reduce((total, r) => (total = NP.plus(total, r.deliveryCost || 0)), 0)
                    money = NP.plus(total, purchase)
                }
                break
            case '本单收款合计' :
                money = v.orderMoney
                break
            case '整单折扣额' :
                money = v.discount || 0
                break
            case '销售费用' :
                money = v.purchaseExpense.reduce((total, r) => (total = NP.plus(total, r.money || 0)), 0)
                break
            case '税额' :
                money = v.list.reduce((total, r) => (total = NP.plus(total, r.payable || 0)), 0)
                break
        }
    } else if (orderType === '销售退货单') {
        switch (type) {
            case '实际不含税金额' :
                if (commodityIndex !== null) {
                    money = NP.times(v.list[commodityIndex].reStorage || 0, v.list[commodityIndex].price || 0)
                } else {
                    money = v.list.reduce((total, r) => (total = NP.plus(total, NP.times(r.reStorage || 0, r.price || 0))), 0)
                }
                break
            case '本单应退账款' :
                money = v.orderMoney
                break
            case '整单折扣额' :
                money = v.discount || 0
                break
            case '税额' :
                money = v.list.reduce((total, r) => (total = NP.plus(total, r.payable || 0)), 0)
                break
        }
    } else if (category === '库存管理') {
        if (commodityIndex !== null) {
            money = NP.times(v.list[commodityIndex].number || 0, v.list[commodityIndex].unitDelivery || 0)
        } else {
            money = v.list.reduce((total, r) => (total = NP.plus(total, NP.times(r.number || 0, r.unitDelivery || 0))), 0)
        }
    } else if (orderType === '收款单') {
        switch (type) {
            case '收款金额合计' :
                money = v.order.total
                break
            case '优惠金额' :
                money = v.main.preferential || 0
                break
            case '实际收款金额合计' :
                if (commodityIndex !== null) {
                    money = v.list[commodityIndex].advanceMoney
                } else {
                    money = v.main.total
                }
                break
        }
    } else if (orderType === '付款单') {
        switch (type) {
            case '付款金额合计' :
                money = v.order.total
                break
            case '优惠金额' :
                money = v.main.preferential || 0
                break
            case '实际付款金额合计' :
                if (commodityIndex !== null) {
                    money = v.list[commodityIndex].advanceMoney
                } else {
                    money = v.main.total
                }
                break
        }
    } else if (orderType === '预收款单' || orderType === '预付款单' || orderType === '预收退款单' || orderType === '预付退款单') {
        if (commodityIndex !== null) {
            money = v.list[commodityIndex].advanceMoney
        } else {
            money = v.main.total
        }
    } else if (orderType === '其他应收单') {
        switch (type) {
            case '应收金额合计' :
                money = v.order.total
                break
            case '优惠金额' :
                money = v.main.preferential || 0
                break
            case '实际收款金额合计' :
                if (commodityIndex !== null) {
                    money = v.list[commodityIndex].advanceMoney
                } else {
                    money = v.main.total
                }
                break
        }
    } else if (orderType === '其他应付单') {
        switch (type) {
            case '应付金额合计' :
                money = v.order.total
                break
            case '优惠金额' :
                money = v.main.preferential || 0
                break
            case '实际付款金额合计' :
                if (commodityIndex !== null) {
                    money = v.list[commodityIndex].advanceMoney
                } else {
                    money = v.main.total
                }
                break
        }
    } else if (orderType === '核销单') {
        money = v.main.total
    }
    money = money.toFixed(2)
    return parseFloat(money)
}
const getSubject = async (f, i, v, accountSetId, orderType, category) => {
    let arr = []
    const addFun = async (code, lIndex = null) => {
        let fData = await Subject.findOne({
            accountSetId: accountSetId,
            code: code
        })
        let money = getMoney(f.money, v, lIndex, orderType, category)
        money = fData.balance.includes(f.balance) ? money : -money
        arr.push({
            abstract: i === 0 && (lIndex === 0 || lIndex === null) ? `${orderType}-${v.code}` : '',
            subjectCode: fData ? fData.code : null,
            subject: fData ? fData.name : null,
            currency: fData ? fData.currency === '所有币别' || fData.currency === '不核算' ? '人民币' : fData.currency : '人民币',
            rateType: '公司汇率',
            rate: f.rate,
            currencyAmount: NP.times(f.rate, money),
            borrower: f.balance === '借' ? money : null,
            lender: f.balance === '贷' ? money : null,
            isAllC: fData ? fData.currency === '所有币别' : false,
            accountingItem: fData ? fData.accountItem.map(async a => {
                return await getAccountingItemInfo(a, v)
            }) : []
        })
    }
    switch (f.subjectForm) {
        case '模板自定义科目':
            await addFun(f.subjectCode)
            break
        case '费用.对应科目':
            let fee = await FeeDiscount.findOne({accountSetId: accountSetId})
            await addFun(fee.feeSubjectCode)
            break
        case '折扣.对应科目':
            let discount = await FeeDiscount.findOne({accountSetId: accountSetId})
            await addFun(discount.discountSubjectCode)
            break
        case '供应商.对应科目':
            let supplier = await Supplier.findOne({accountSetId: accountSetId, _id: v.supplierId})
            await addFun(supplier.subjectCode)
            break
        case '客户.对应科目':
            let customer = await Customer.findOne({accountSetId: accountSetId, _id: v.customerId})
            await addFun(customer.subjectCode)
            break
        case '部门.对应科目':
            let departmentId = v.departmentId ||  v.customerDepartmentId
            let department = await Department.findOne({accountSetId: accountSetId, _id: departmentId})
            await addFun(department.subjectCode)
            break
        case '商品.库存对应科目':
            for (let l = 0; l < v.list.length; l++) {
                let commodity = await CommodityInfo.findOne({accountSetId: accountSetId, _id: v.list[l].commodityId})
                await addFun(commodity.subjectCode, l)
            }
            break
        case '商品.收入对应科目':
            for (let l = 0; l < v.list.length; l++) {
                let commodity = await CommodityInfo.findOne({accountSetId: accountSetId, _id: v.list[l].commodityId})
                await addFun(commodity.incomeSubjectCode, l)
            }
            break
        case '商品.成本对应科目':
            for (let l = 0; l < v.list.length; l++) {
                let commodity = await CommodityInfo.findOne({accountSetId: accountSetId, _id: v.list[l].commodityId})
                await addFun(commodity.costSubjectCode, l)
            }
            break
        case '收入类别.对应科目':
            for (let l = 0; l < v.main.list.length; l++) {
                let incomeCategory = await IncomeCategory.findOne({accountSetId: accountSetId, _id: v.main.list[l].advanceType})
                await addFun(incomeCategory.subjectCode, l)
            }
            break
        case '支出类别.对应科目':
            for (let l = 0; l < v.main.list.length; l++) {
                let spendingCategory = await SpendingCategory.findOne({accountSetId: accountSetId, _id: v.main.list[l].advanceType})
                await addFun(spendingCategory.subjectCode, l)
            }
            break
        case '银行账号.对应科目':
            for (let l = 0; l < v.main.list.length; l++) {
                let bankAccount = await BankAccount.findOne({accountSetId: accountSetId, _id: v.main.list[l].advanceAccountId})
                await addFun(bankAccount.subjectCode, l)
            }
            break
    }
    return arr
}

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
const updateSubject = async (list, isMinus, isAdd, cb, data) => {
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

module.exports = {
    updateCredentialsCache,
    editCredentialsCache,
    queryCredentialsCache,
    batchCredentialsCache,
    deleteCredentialsCache
};

async function deleteCredentialsCache(_id) {
    let cache = await CredentialsCache.findOne({credentialsId: _id})
    switch (cache.orderType) {
        case '采购入库单':
            await PurchaseWarehouse.updateOne({_id: cache.orderId }, { $set: { credentialsId: null} })
            break
        case '采购退货单':
            await PurchaseReturn.updateOne({_id: cache.orderId }, { $set: { credentialsId: null} })
            break
        case '销售出库单':
            await SalesWarehouse.updateOne({_id: cache.orderId }, { $set: { credentialsId: null} })
            break
        case '销售退货单':
            await SalesReturn.updateOne({_id: cache.orderId }, { $set: { credentialsId: null} })
            break
        case '盘盈单':
            await WarehouseDiskSurplus.updateOne({_id: cache.orderId }, { $set: { credentialsId: null} })
            break
        case '盘亏单':
            await WarehouseDiskDeficient.updateOne({_id: cache.orderId }, { $set: { credentialsId: null} })
            break
        case '其他入库单':
            await WarehouseIn.updateOne({_id: cache.orderId }, { $set: { credentialsId: null} })
            break
        case '其他出库单':
            await WarehouseOut.updateOne({_id: cache.orderId }, { $set: { credentialsId: null} })
            break
        case '调拨入库单':
            await WarehouseAllocatingIn.updateOne({_id: cache.orderId }, { $set: { credentialsId: null} })
            break
        case '调拨出库单':
            await WarehouseAllocatingOut.updateOne({_id: cache.orderId }, { $set: { credentialsId: null} })
            break
        case '收款单':
            await ReceivableCollection.updateOne({_id: cache.orderId }, { $set: { credentialsId: null} })
            break
        case '付款单':
            await PayableCollection.updateOne({_id: cache.orderId }, { $set: { credentialsId: null} })
            break
        case '预收款单':
            await ReceivablePayments.updateOne({_id: cache.orderId }, { $set: { credentialsId: null} })
            break
        case '预付款单':
            await PayablePayments.updateOne({_id: cache.orderId }, { $set: { credentialsId: null} })
            break
        case '预收退款单':
            await ReceivableRefund.updateOne({_id: cache.orderId }, { $set: { credentialsId: null} })
            break
        case '预付退款单':
            await PayableRefund.updateOne({_id: cache.orderId }, { $set: { credentialsId: null} })
            break
        case '其他应收单':
            await ReceivableOther.updateOne({_id: cache.orderId }, { $set: { credentialsId: null} })
            break
        case '其他应付单':
            await PayableOther.updateOne({_id: cache.orderId }, { $set: { credentialsId: null} })
            break
        case '核销单':
            await ReceivableVerification.updateOne({_id: cache.orderId }, { $set: { credentialsId: null} })
            break
    }
    await CredentialsCache.deleteOne({ _id: cache._id })
}

async function updateCredentialsCache(req, res, next) {
    L('Calling API CredentialsCache.updateCredentialsCache', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.accountingPeriod) {
            next(new errors.BadRequest('账套期间必填'));
        } else if (!data.list || !data.list.length) {
            next(new errors.BadRequest('生成ids必填'));
        } else {
            let fail = 0
            let success = 0
            let orderList = []
            for (let l = 0; l < data.list.length; l++) {
                let order = null
                switch (data.list[l].orderType) {
                    case '采购入库单':
                        order = await PurchaseWarehouse.findOne({_id: data.list[l]._id })
                        break
                    case '采购退货单':
                        order = await PurchaseReturn.findOne({_id: data.list[l]._id })
                        break
                    case '销售出库单':
                        order = await SalesWarehouse.findOne({_id: data.list[l]._id })
                        break
                    case '销售退货单':
                        order = await SalesReturn.findOne({_id: data.list[l]._id })
                        break
                    case '盘盈单':
                        order = await WarehouseDiskSurplus.findOne({_id: data.list[l]._id })
                        break
                    case '盘亏单':
                        order = await WarehouseDiskDeficient.findOne({_id: data.list[l]._id })
                        break
                    case '其他入库单':
                        order = await WarehouseIn.findOne({_id: data.list[l]._id })
                        break
                    case '其他出库单':
                        order = await WarehouseOut.findOne({_id: data.list[l]._id })
                        break
                    case '调拨入库单':
                        order = await WarehouseAllocatingIn.findOne({_id: data.list[l]._id })
                        break
                    case '调拨出库单':
                        order = await WarehouseAllocatingOut.findOne({_id: data.list[l]._id })
                        break
                    case '收款单':
                        order = await ReceivableCollection.findOne({_id: data.list[l]._id })
                        break
                    case '付款单':
                        order = await PayableCollection.findOne({_id: data.list[l]._id })
                        break
                    case '预收款单':
                        order = await ReceivablePayments.findOne({_id: data.list[l]._id })
                        break
                    case '预付款单':
                        order = await PayablePayments.findOne({_id: data.list[l]._id })
                        break
                    case '预收退款单':
                        order = await ReceivableRefund.findOne({_id: data.list[l]._id })
                        break
                    case '预付退款单':
                        order = await PayableRefund.findOne({_id: data.list[l]._id })
                        break
                    case '其他应收单':
                        order = await ReceivableOther.findOne({_id: data.list[l]._id })
                        break
                    case '其他应付单':
                        order = await PayableOther.findOne({_id: data.list[l]._id })
                        break
                    case '核销单':
                        order = await ReceivableVerification.findOne({_id: data.list[l]._id })
                        break
                }
                let temp = await CredentialsOrder.findOne({_id: data.list[l].templateId })
                if (order && temp) {
                    let proofWords = await ProofWords.findOne({_id: temp.proofWordId })
                    let files = 0
                    if (temp.filesType === '业务单据数') {
                        files = order.filesNum || 0
                    } else {
                        if (temp.orderType === '其他出库单' || temp.orderType === '调拨入库单') {
                            let arr = Array.from(new Set(order.list.filter(f => f.pId).map(m => m.pId)))
                            files = arr.length
                        } else if (temp.orderType === '收款单' || temp.orderType === '付款单' || temp.orderType === '预收退款单' || temp.orderType === '预付退款单') {
                            files = order.order.list.length
                        } else if (temp.orderType === '其他收款单' || temp.orderType === '其他付款单') {
                            let arr = Array.from(new Set(order.order.payList.filter(f => f.orderId).map(m => m.orderId)))
                            files = arr.length
                        } else if (temp.orderType === '核销单') {
                            files = order.main.list.length + order.blunt.list.length
                        }
                    }
                    let child = []
                    for (let c = 0; c < temp.list.length; c++) {
                        let list = await getSubject(temp.list[c], c, order._doc, data.accountSetId, temp.orderType, temp.category)
                        if (
                          temp.list[c].money === '优惠金额' ||
                          temp.list[c].money === '整单折扣额' ||
                          temp.list[c].money === '采购费用' ||
                          temp.list[c].money === '销售费用'
                        ) {
                            list = list.filter(f => f.borrower || f.lender)
                        }
                        child = child.concat(list)
                    }
                    orderList.push({
                        accountSetId: data.accountSetId,
                        time: temp.dateTime === '单据日期' ? order.dateTime : new Date(),
                        accountingPeriod: data.accountingPeriod,
                        proofWordId: temp.proofWordId,
                        proofWords: proofWords ? proofWords.name : null,
                        child: child,
                        voucher: req.user.sub,
                        files: files,
                        orderType: temp.orderType,
                        orderCode: order.code,
                        orderId: order._id,
                        credentialsId: null,
                        certificateNumber: null,
                        result: null
                    })
                } else {
                    fail++
                }
            }

            for (let o = 0; o < orderList.length; o++) {
                let item = orderList[o]
                let error = ''
                if (!item.accountSetId) {
                    error += `<div>账套Id必填</div>`
                } else if (!item.time) {
                    error += `<div>日期必填</div>`
                } else if (!item.accountingPeriod) {
                    error += `<div>会计期间必填</div>`
                } else if (!item.proofWordId) {
                    error += `<div>凭证字id必填</div>`
                } else if (!item.child.length) {
                    error += `<div>凭证录入数据不能为空</div>`
                } else if (!item.orderType) {
                    error += `<div>业务单据类型必填</div>`
                } else if (!item.orderId) {
                    error += `<div>业务单据id必填</div>`
                } else {
                    let fData = await CredentialsCache.findOne({
                        accountSetId: item.accountSetId,
                        orderId: item.orderId
                    })
                    let _id = null
                    if (fData) {
                        _id = fData._id
                        await CredentialsCache.updateOne({_id}, { $set: item })
                    } else {
                        let cache = await CredentialsCache.create(item)
                        _id = cache._id
                    }
                    let result = JSON.parse(JSON.stringify(item))
                    let borrower = 0
                    let lender = 0
                    result.child.forEach((v, i) => {
                        if (i === 0 && !v.abstract) {
                            error += `<div>第1行凭证摘要必填</div>`
                        }
                        if (!v.subject || !v.subjectCode) {
                            error += `<div>第${i + 1}行请选择科目</div>`
                        }
                        if (!v.rate) {
                            error += `<div>第${i + 1}行请输入汇率</div>`
                        }
                        if (!v.currencyAmount) {
                            error += `<div>第${i + 1}行请输入原币金额</div>`
                        }
                        if (!v.borrower && !v.lender) {
                            error += `<div>第${i + 1}行请输入借方或贷方</div>`
                        }
                        if (v.accountingItem.filter(a => !a._id).length) {
                            error += `<div>第${i + 1}行科目核算项目未设置</div>`
                        }
                        if (v.borrower) borrower = NP.plus(borrower, v.borrower || 0)
                        if (v.lender) lender = NP.plus(lender, v.lender || 0)
                    })
                    if (borrower !== lender) {
                        error += `<div>借贷不平衡</div>`
                        if (borrower === 0) {
                            error += `<div>借方金额不能等于0</div>`
                        }
                    }
                    if (error) {
                        fail++
                        await CredentialsCache.updateOne({_id}, { $set: { result: error} })
                    } else {
                        success++
                        let credentials = await Credentials.findOne({
                            accountSetId: item.accountSetId,
                            proofWordId: item.proofWordId
                        }).sort({createdAt: -1})
                        let serialNumber = credentials ? credentials.serialNumber + 1 : 1
                        let certificateNumber = credentials ? credentials.certificateNumber + 1 : 1

                        let cData = await Credentials.create(Object.assign(result, {
                            certificateNumber: certificateNumber,
                            serialNumber: serialNumber,
                            cacheId: _id,
                            businessDate: data.time
                        }))
                        await updateSubject(cData.child, false, true, null, cData)

                        await CredentialsCache.updateOne({_id}, {
                            $set: {
                                credentialsId: cData._id,
                                certificateNumber: certificateNumber
                            }
                        })

                        switch (cData.orderType) {
                            case '采购入库单':
                                await PurchaseWarehouse.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                                break
                            case '采购退货单':
                                await PurchaseReturn.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                                break
                            case '销售出库单':
                                await SalesWarehouse.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                                break
                            case '销售退货单':
                                await SalesReturn.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                                break
                            case '盘盈单':
                                await WarehouseDiskSurplus.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                                break
                            case '盘亏单':
                                await WarehouseDiskDeficient.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                                break
                            case '其他入库单':
                                await WarehouseIn.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                                break
                            case '其他出库单':
                                await WarehouseOut.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                                break
                            case '调拨入库单':
                                await WarehouseAllocatingIn.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                                break
                            case '调拨出库单':
                                await WarehouseAllocatingOut.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                                break
                            case '收款单':
                                await ReceivableCollection.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                                break
                            case '付款单':
                                await PayableCollection.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                                break
                            case '预收款单':
                                await ReceivablePayments.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                                break
                            case '预付款单':
                                await PayablePayments.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                                break
                            case '预收退款单':
                                await ReceivableRefund.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                                break
                            case '预付退款单':
                                await PayableRefund.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                                break
                            case '其他应收单':
                                await ReceivableOther.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                                break
                            case '其他应付单':
                                await PayableOther.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                                break
                            case '核销单':
                                await ReceivableVerification.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                                break
                        }
                    }
                }
            }

            res.status(200).json({
                fail,
                success
            });
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function editCredentialsCache(req, res, next) {
    L('Calling API CredentialsCache.editCredentialsCache', req.body);

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
        } else if (!data.child || !data.child.length) {
            next(new errors.BadRequest('凭证录入数据不能为空'));
        } else if (!data.orderType) {
            next(new errors.BadRequest('业务单据类型必填'));
        } else if (!data.orderId) {
            next(new errors.BadRequest('业务单据id必填'));
        } else if (!data._id) {
            next(new errors.BadRequest('id必填'));
        } else {
            let _id = data._id
            delete data._id
            await CredentialsCache.updateOne({_id}, { $set: data })
            let result = JSON.parse(JSON.stringify(data))
            let borrower = 0
            let lender = 0
            let error = ''
            result.child.forEach((v, i) => {
                if (i === 0 && !v.abstract) {
                    error += `<div>第1行凭证摘要必填</div>`
                }
                if (!v.subject || !v.subjectCode) {
                    error += `<div>第${i + 1}行请选择科目</div>`
                }
                if (!v.rate) {
                    error += `<div>第${i + 1}行请输入汇率</div>`
                }
                if (!v.currencyAmount) {
                    error += `<div>第${i + 1}行请输入原币金额</div>`
                }
                if (!v.borrower && !v.lender) {
                    error += `<div>第${i + 1}行请输入借方或贷方</div>`
                }
                if (v.accountingItem.filter(a => !a._id).length) {
                    error += `<div>第${i + 1}行科目核算项目未设置</div>`
                }
                if (v.borrower) borrower = NP.plus(borrower, v.borrower || 0)
                if (v.lender) lender = NP.plus(lender, v.lender || 0)
            })
            if (borrower !== lender) {
                error += `<div>借贷不平衡</div>`
                if (borrower === 0) {
                    error += `<div>借方金额不能等于0</div>`
                }
            }
            if (error) {
                await CredentialsCache.updateOne({_id}, { $set: { result: error} })
            } else {
                let credentials = await Credentials.findOne({
                    accountSetId: result.accountSetId,
                    proofWordId: result.proofWordId
                }).sort({createdAt: -1})
                let serialNumber = credentials ? credentials.serialNumber + 1 : 1
                let certificateNumber = credentials ? credentials.certificateNumber + 1 : 1
                console.log(
                  Object.assign(result, {
                      certificateNumber: certificateNumber,
                      serialNumber: serialNumber,
                      cacheId: _id,
                      businessDate: data.time
                  })
                )
                let cData = await Credentials.create(Object.assign(result, {
                    certificateNumber: certificateNumber,
                    serialNumber: serialNumber,
                    cacheId: _id,
                    businessDate: data.time
                }))
                await updateSubject(cData.child, false, true, null, cData)

                await CredentialsCache.updateOne({_id}, {
                    $set: {
                        credentialsId: cData._id,
                        certificateNumber: certificateNumber
                    }
                })

                switch (cData.orderType) {
                    case '采购入库单':
                        await PurchaseWarehouse.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                        break
                    case '采购退货单':
                        await PurchaseReturn.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                        break
                    case '销售出库单':
                        await SalesWarehouse.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                        break
                    case '销售退货单':
                        await SalesReturn.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                        break
                    case '盘盈单':
                        await WarehouseDiskSurplus.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                        break
                    case '盘亏单':
                        await WarehouseDiskDeficient.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                        break
                    case '其他入库单':
                        await WarehouseIn.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                        break
                    case '其他出库单':
                        await WarehouseOut.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                        break
                    case '调拨入库单':
                        await WarehouseAllocatingIn.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                        break
                    case '调拨出库单':
                        await WarehouseAllocatingOut.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                        break
                    case '收款单':
                        await ReceivableCollection.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                        break
                    case '付款单':
                        await PayableCollection.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                        break
                    case '预收款单':
                        await ReceivablePayments.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                        break
                    case '预付款单':
                        await PayablePayments.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                        break
                    case '预收退款单':
                        await ReceivableRefund.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                        break
                    case '预付退款单':
                        await PayableRefund.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                        break
                    case '其他应收单':
                        await ReceivableOther.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                        break
                    case '其他应付单':
                        await PayableOther.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                        break
                    case '核销单':
                        await ReceivableVerification.updateOne({_id: cData.orderId }, { $set: { credentialsId: cData._id, credentialsCaseId: _id } })
                        break
                }
            }

            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function queryCredentialsCache(req, res, next) {
    L('Calling API CredentialsCache.queryCredentialsCache', req.body);

    try {
        let data = req.body;
        if (!data.filter || !data.filter.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            if (data.isOne) {
                let result = await CredentialsCache.findOne(data.filter).sort({createdAt: -1})
                res.status(200).json(result);
            } else {
                if (!data.pageInfo || !data.pageInfo.page || !data.pageInfo.limit) {
                    next(new errors.BadRequest('分页参数必填'));
                } else {
                    let result = await CredentialsCache.find(data.filter).sort({createdAt: -1})
                      .limit(parseInt(data.pageInfo.limit))
                      .skip(data.pageInfo.limit * (data.pageInfo.page - 1));
                    let total = await CredentialsCache.find(data.filter).countDocuments();
                    res.status(200).json({
                        total,
                        list: result
                    });
                }
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function batchCredentialsCache(req, res, next) {
    L('Calling API CredentialsCache.batchCredentialsCache', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('业务凭证模板Ids必填'));
        } else  if (!data.action) {
            next(new errors.BadRequest('批量操作必填'));
        } else {
            if (data.action === '删除') {
                await CredentialsCache.deleteMany({ _id: {$in: data.ids} }, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    }
                })
                res.status(200).end();
            } else {
                next(new errors.BadRequest('该功能在紧急开发中'));
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
