const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const PurchaseWarehouseSchema = new Schema({
    accountSetId: {
        // 账套id
        type: ObjectId,
        required: true
    },
    code: {
        // 单据编号
        type: String,
        required: true
    },
    dateTime: {
        // 单据日期
        type: Date,
        required: true
    },
    supplierId: {
        // 供应商
        type: ObjectId,
        required: true
    },
    clerkId: {
        // 业务员
        type: ObjectId
    },
    departmentId: {
        // 部门
        type: ObjectId
    },
    discount: {
        // 折扣额
        type: Number
    },
    discountRate: {
        // 折扣额
        type: Number
    },
    purchaseExpense: {
        // 预计采购费用
        type: [{
            supplierId: ObjectId,
            spendingId: ObjectId,
            money: Number,
            des: String
        }],
        default: []
    },
    list: {
        // 单据内容
        type: [{
            commodityId: ObjectId,
            pId: ObjectId,
            pIndex: Number,
            code: String,
            name: String,
            warehouseId: ObjectId,
            inventory: Number,
            unit: String,
            unitList: Array,
            groupId: ObjectId,
            auxiliary: String,
            number: Number,
            inStorage: Number,
            unStorage: Number,
            reStorage: Number,
            price: Number,
            unitPrice: Number,
            taxRate: Number,
            payable: Number,
            payableTotal: Number,
            deliveryDate: Date,
            commodityDes: String,
            unitDelivery: Number,
            deliveryCost: Number,
            isBatch: Boolean,
            isShelfLife: Boolean,
            batch: String,
            shelfLifeDays: Number,
            generateDate: Date,
            effectiveDate: Date,
            package: String,
            packageList: Array,
            packageNumber: Number
        }],
        default: []
    },
    des: String,
    offsetAdvance: Number,
    offsetList: {
        type: [{
            orderId: ObjectId,
            orderType: String,
            code: String,
            dateTime: Date,
            des: String,
            money: Number,
            payed: Number,
            unPayed:  Number,
            thisPay: Number,
            payDes: String
        }],
        default: []
    },
    advanceAccountId: ObjectId,
    advanceType: ObjectId,
    advanceMoney: Number,
    advanceMore: {
        type: [{
            advanceAccountId: ObjectId,
            advanceType: ObjectId,
            advanceMoney: Number,
            transactionNo: String,
            des: String
        }],
        default: []
    },
    maLing: Number,
    orderMoney: Number,
    paymentTotal: Number,
    unpaid: Number,
    filesNum: Number,
    files: [],
    audit: {
        // 审核状态
        type: String,
        default: '未审核',
        enum: ['已审核', '未审核']
    },
    paymentStatus: {
        // 付款状态
        type: String,
        default: '未付款',
        enum: ['未付款', '部分付款', '全部付款']
    },
    paymentList: {
        type: [{
            orderId: ObjectId,
            orderType: String,
            orderCode: String,
            orderRouter: String,
            orderMoney: Number
        }],
        default: []
    },
    paid: {
        // 已付金额
        type: Number,
    },
    custom: {
        type: Object,
        default: null
    },
    credentialsId: {
        type: Object,
        default: null
    },
    credentialsCaseId: {
        type: Object,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('PurchaseWarehouse', PurchaseWarehouseSchema);