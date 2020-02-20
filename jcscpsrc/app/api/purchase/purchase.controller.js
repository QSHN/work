const errors = require('@lib/errors');
const L = require('debug')('app:api');
const NP = require('number-precision');
const moment = require('moment');
const xlsx = require('node-xlsx');
const fs = require('fs');

const PurchaseContract = require('./purchaseContract.model');
const PurchaseOrder = require('./purchaseOrder.model');
const PurchaseTemp = require('./purchaseTemp.model');
const PurchaseSelfTemp = require('./purchaseSelfTemp.model');

module.exports = {
    updatePurchaseTemp,
    updatePurchaseContract,
    updatePurchaseOrder,
    queryPurchaseTemp,
    queryPurchaseContract,
    queryPurchaseOrder,
    deletePurchaseContract,
    deletePurchaseOrder,
    summarySheet,
    updatePurchaseSelfTemp,
    queryPurchaseSelfTemp,
    queryContractOrOrder,
    exportData
};

async function updatePurchaseTemp(req, res, next) {
    L('Calling API Purchase.updatePurchaseTemp', req.body);

    try {
        let data = req.body
        if (data._id) {
            let _id = data._id
            delete data._id
            await PurchaseTemp.updateOne({_id}, data)
            res.status(200).end();
        } else {
            next(new errors.BadRequest('缺少id'));
        }
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function updatePurchaseContract(req, res, next) {
    L('Calling API Purchase.updatePurchaseContract', req.body);

    try {
        let data = req.body
        if (data._id) {
            let _id = data._id
            delete data._id
            if (data.temp.supplier.contractNumber) {
                let result = await PurchaseContract.findOne({
                    _id: { $ne: _id },
                    'temp.supplier.contractNumber': data.temp.supplier.contractNumber
                })
                if (result) {
                    next(new errors.BadRequest('已存在该合同号'));
                } else {
                    let contract = await PurchaseContract.findOne({_id})
                    if (contract.temp.supplier.contractNumber !== data.temp.supplier.contractNumber) {
                        await PurchaseOrder.updateMany({
                            'temp.order.contractNumber': contract.temp.supplier.contractNumber
                        }, {
                            $set: { 'temp.order.contractNumber': data.temp.supplier.contractNumber }
                        })
                    }
                    await PurchaseContract.updateOne({_id}, data)
                    res.status(200).json({_id: _id});
                }
            } else {
                next(new errors.BadRequest('缺少合同号'));
            }
        } else {
            if (data.temp.supplier.contractNumber) {
                let result =  await PurchaseContract.findOne({
                    'temp.supplier.contractNumber': data.temp.supplier.contractNumber
                })
                if (result) {
                    next(new errors.BadRequest('已存在该合同号'));
                } else {
                    let result = await PurchaseContract.create(data)
                    res.status(200).json({_id: result._id});
                }
            } else {
                next(new errors.BadRequest('缺少合同号'));
            }
        }
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function updatePurchaseOrder(req, res, next) {
    L('Calling API Purchase.updatePurchaseOrder', req.body);

    try {
        let data = req.body
        if (data._id) {
            let _id = data._id
            delete data._id
            if (data.temp.order.invoiceNumber && data.temp.order.contractNumber) {
                let result =  await PurchaseOrder.findOne({
                    _id: { $ne: _id },
                    'temp.order.invoiceNumber': data.temp.order.invoiceNumber,
                    'temp.order.contractNumber': data.temp.order.contractNumber
                })
                if (result) {
                    next(new errors.BadRequest('已存在该发票号和合同号'));
                } else {
                    await PurchaseOrder.updateOne({_id}, data)
                    res.status(200).json({_id: _id});
                }
            } else {
                next(new errors.BadRequest('缺少发票号和合同号'));
            }
        } else {
            if (data.temp.order.invoiceNumber && data.temp.order.contractNumber) {
                let result =  await PurchaseOrder.findOne({
                    'temp.order.invoiceNumber': data.temp.order.invoiceNumber,
                    'temp.order.contractNumber': data.temp.order.contractNumber
                })
                if (result) {
                    next(new errors.BadRequest('已存在该发票号和合同号'));
                } else {
                    let result = await PurchaseOrder.create(data)
                    res.status(200).json({_id: result._id});
                }
            } else {
                next(new errors.BadRequest('缺少发票号和合同号'));
            }
        }
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function queryPurchaseTemp(req, res, next) {
    L('Calling API Purchase.queryPurchaseTemp', req.body);

    try {
        let result = await PurchaseTemp.findOne({})
        if (!result) {
            await PurchaseTemp.create({})
            result = await PurchaseTemp.findOne({})
        }
        res.status(200).json(result)
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function queryPurchaseContract(req, res, next) {
    L('Calling API Purchase.queryPurchaseContract', req.body);

    try {
        let data = req.body
        let result = await PurchaseContract.find(data).sort({createdAt: -1})
        res.status(200).json(result)
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function queryPurchaseOrder(req, res, next) {
    L('Calling API Purchase.queryPurchaseOrder', req.body);

    try {
        let data = req.body
        let result = await PurchaseOrder.find(data).sort({createdAt: -1})
        res.status(200).json(result)
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function deletePurchaseContract(req, res, next) {
    L('Calling API Purchase.deletePurchaseContract', req.body);

    try {
        let data = req.body
        if (data._id) {
            let result = await PurchaseContract.findOne({_id: data._id})
            let contractNumber = result.temp.supplier.contractNumber
            let order = await PurchaseOrder.findOne({
                'temp.order.contractNumber': contractNumber
            })
            if (result.status === '已审核') {
                next(new errors.BadRequest('该合同已审核，无法删除'));
            } else if (order) {
                next(new errors.BadRequest('该合同还有采购订单，无法删除'));
            } else {
                await PurchaseContract.deleteOne({ _id: data._id }, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    } else {
                        res.status(200).end();
                    }
                })
            }
        } else {
            next(new errors.BadRequest('缺少必要id'));
        }
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function deletePurchaseOrder(req, res, next) {
    L('Calling API Purchase.deletePurchaseOrder', req.body);

    try {
        let data = req.body
        if (data._id) {
            let result = await PurchaseOrder.findOne({_id: data._id})
            if (result.status === '已审核') {
                next(new errors.BadRequest('该订单已审核，无法删除'));
            } else {
                await PurchaseOrder.deleteOne({ _id: data._id }, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    } else {
                        res.status(200).end();
                    }
                })
            }
        } else {
            next(new errors.BadRequest('缺少必要id'));
        }
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function summarySheet(req, res, next) {
    L('Calling API Purchase.summarySheet', req.body);

    try {
        let data = req.body
        if (data.creators) {
            let contract = await PurchaseContract.find({
                creator: { $in: data.creators }
            }).sort({'temp.supplier.serialNumber': 1})
            let cIds = []
            let result = []
            contract.forEach(v => {
                let isFind = false
                cIds.forEach(c => {
                    if (c.serialNumber === v.temp.supplier.serialNumber) {
                        isFind = true
                        if (c.contractNumber !== v.temp.supplier.contractNumber) {
                            c.contractNumber.push(v.temp.supplier.contractNumber)
                        }
                        c.containerNumber = NP.plus(c.containerNumber, v.temp.supplier.containerNumber || 0)
                    }
                })
                if (!isFind) {
                    cIds.push({
                        serialNumber: v.temp.supplier.serialNumber,
                        contractNumber: [v.temp.supplier.contractNumber],
                        containerNumber: v.temp.supplier.containerNumber || 0
                    })
                }
            })
            for (let i = 0; i < cIds.length; i++) {
                let cInfo = cIds[i]
                let order = await PurchaseOrder.find({
                    'temp.order.contractNumber': { $in: cInfo.contractNumber }
                })
                let inStorage = 0
                let portNumber = 0
                let amountPayable = 0
                let shipped = 0
                order.forEach(v => {
                    if (v.temp) {
                        if (v.temp.logistics) {
                            if (v.temp.logistics.orderStatus === '已清关' || v.temp.logistics.orderStatus === '已入库' || v.temp.logistics.orderStatus === '已到港') {
                                inStorage++
                            } else if (v.temp.logistics.orderStatus !== '未发货') {
                                shipped++
                            }
                        }
                        if (v.temp.logistics.orderStatus !== '已清关' && v.temp.logistics.orderStatus !== '已入库') {
                            if (v.temp.document && v.temp.document.arrivalTime) {
                                let arrivalTime = moment(v.temp.document.arrivalTime).format('YYYY-MM-DD') + ' 23:59:59.999'
                                let last = moment(v.temp.document.arrivalTime).subtract(10, 'days').format('YYYY-MM-DD') + ' 00:00:00'
                                if (moment().isBefore(arrivalTime) && moment().isAfter(last)) portNumber++
                            }
                            if (v.temp.order && v.temp.order.finalPaymentDate) {
                                let finalPaymentDate = moment(v.temp.order.finalPaymentDate).format('YYYY-MM-DD') + ' 23:59:59.999'
                                let last = moment(v.temp.order.finalPaymentDate).subtract(10, 'days').format('YYYY-MM-DD') + ' 00:00:00'
                                if (moment().isBefore(finalPaymentDate) && moment().isAfter(last)) {
                                    if (v.temp.order.oFinalAmount) amountPayable = NP.plus(amountPayable, v.temp.order.oFinalAmount)
                                }
                            }
                        }
                    }
                })
                result.push({
                    serialNumber: cInfo.serialNumber,
                    containerNumber: cInfo.containerNumber ,
                    inStorage,
                    shipped,
                    portNumber,
                    amountPayable
                })
            }
            res.status(200).json(result)
        } else {
            next(new errors.BadRequest('缺少必要creators'));
        }
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function updatePurchaseSelfTemp(req, res, next) {
    L('Calling API Purchase.updatePurchaseSelfTemp', req.body);

    try {
        let data = req.body
        if (data._id) {
            let _id = data._id
            delete data._id
            await PurchaseSelfTemp.updateOne({_id}, data)
            res.status(200).end();
        } else {
            next(new errors.BadRequest('缺少id'));
        }
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function queryPurchaseSelfTemp(req, res, next) {
    L('Calling API Purchase.queryPurchaseSelfTemp', req.body);

    try {
        let result = await PurchaseSelfTemp.findOne({
            userId: req.user.userId
        })
        if (!result) {
            await PurchaseSelfTemp.create({
                userId: req.user.userId
            })
            result = await PurchaseSelfTemp.findOne({
                userId: req.user.userId
            })
        }
        res.status(200).json(result)
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function queryContractOrOrder(req, res, next) {
    L('Calling API Purchase.queryContractOrOrder', req.body);

    try {
        let data = req.body
        if (!data.pageInfo || !data.pageInfo.page || !data.pageInfo.limit) {
            next(new errors.BadRequest('分页参数必填'));
        } else if (!data.type) {
            next(new errors.BadRequest('查找类型必填'));
        } else {
            let total = 0
            let cList = []
            let oList = []
            let result = {}
            if (data.type === '订单') {
                total = await PurchaseOrder.find(data.orderFiler).countDocuments();
                cList = await PurchaseContract.find(data.contract).sort({'temp.supplier.contractDate': -1})
                let orderFiler = data.order
                orderFiler['temp.order.contractNumber'] = { $in: cList.map(v => v.temp.supplier.contractNumber)}
                oList = await PurchaseOrder.find(orderFiler).sort({'temp.document.arrivalTime': -1})
                  .limit(parseInt(data.pageInfo.limit))
                  .skip(data.pageInfo.limit * (data.pageInfo.page - 1));
                result = {
                    total,
                    oList: oList
                }
            } else {
                total = await PurchaseContract.find(data.contract).countDocuments();
                cList = await PurchaseContract.find(data.contract).sort({'temp.supplier.contractDate': -1})
                  .limit(parseInt(data.pageInfo.limit))
                  .skip(data.pageInfo.limit * (data.pageInfo.page - 1));
                let orderFiler = data.order
                orderFiler['temp.order.contractNumber'] = { $in: cList.map(v => v.temp.supplier.contractNumber)}
                oList = await PurchaseOrder.find(orderFiler).sort({'temp.document.arrivalTime': -1})
                result = {
                    total,
                    cList: cList,
                    oList: oList
                }
            }
            res.status(200).json(result)
        }
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function exportData(req, res, next) {
    L('Calling API Purchase.exportData', req.body);

    try {
        let data = req.body
        if (!data.type) {
            next(new errors.BadRequest('导出内容'));
        } else {
            let order = await PurchaseOrder.find()
            let contract = await PurchaseContract.find()
            let result = []
            contract.forEach((v, i) => {
                const obj = JSON.parse(JSON.stringify(v))
                const children = order.filter(f =>
                  f.temp.order.contractNumber === v.temp.supplier.contractNumber
                ).map((m, mIndex) => {
                    return {
                        _id: m._id,
                        temp: Object.assign(m.temp, v.temp)
                    }
                })
                if (data.type === '全部') {
                    result.push(obj)
                    result = result.concat(children)
                } else if (data.type === '合同') {
                    result.push(obj)
                } else {
                    result = result.concat(children)
                }
            })
            let tempData = await PurchaseSelfTemp.findOne({
                userId: req.user.userId
            })
            let temp = []
            if (data.isDetail) {
                temp = tempData.temp[data.type === '合同' ? 'purchaseContractDetailTable' : 'purchaseOrderDetailTable'].temp
            } else {
                temp = tempData.temp.purchaseTable.temp
            }

            let table = [];
            table.push(temp.map(m => m.name))

            let getValue = (row, code, type) => {
                if (code) {
                    if (code === 'status') return row.status
                    const c = code.split('.')
                    if (c[0].includes('Table')) {
                        if (row.temp[c[0]]) {
                            if (data.isDetail) {
                                return row.temp[c[0]].reduce((total, r, i) => {
                                    if (type === 'number') {
                                        total += `${r[c[1]] || 0}、`
                                    } else {
                                        total += `${r[c[1]]}、`
                                    }
                                    return total
                                }, '')
                            } else {
                                return row.temp[c[0]].reduce((total, r, i) => {
                                    if (type === 'number') {
                                        total = NP.plus(total, r[c[1]])
                                    } else {
                                        if (!total.includes(r[c[1]])) {
                                            total += (i !== 0 ? ',' : '') + r[c[1]]
                                        }
                                    }
                                    return total
                                }, '')
                            }
                        }
                    } else {
                        if (row.temp[c[0]]) {
                            return row.temp[c[0]][c[1]]
                        }
                    }
                }
                return ''
            }

            result.forEach(r => {
                let row = []
                temp.forEach(t => {
                    let val = getValue(r, t.code, t.type)
                    if (t.type === 'date') {
                        row.push(val ? moment(val).format('YYYY-MM-DD') : '')
                    } else if (t.type === 'boolean') {
                        row.push(val ? '是' : '否')
                    } else if (t.type === 'number') {
                        row.push(val || 0)
                    } else {
                        row.push(val)
                    }
                })
                table.push(row)
            })

            const buffer = xlsx.build([{ name: 'sheet1', data: table }])
            // fs.writeFileSync('./text.xlsx', buffer,"binary");
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=' + new Date().toHawkDateString() + '.xlsx');
            res.setHeader('Content-Length', Buffer.byteLength(buffer, 'utf-8'));
            res.status(200).end(buffer);
        }
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}