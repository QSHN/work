const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const salesOrderSchema = new Schema({
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
    customerId: {
        // 客户
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
    salesExpense: {
        // 预计销售费用
        type: [{
            customerId: ObjectId,
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
            code: String,
            name: String,
            warehouseId: ObjectId,
            inventory: Number,
            unit: String,
            unitList: Array,
            groupId: ObjectId,
            auxiliary: String,
            number: Number,
            outStorage: Number,
            unStorage: Number,
            reStorage: Number,
            price: Number,
            unitPrice: Number,
            taxRate: Number,
            payable: Number,
            payableTotal: Number,
            deliveryDate: Date,
            commodityDes: String,
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
    payable: Number,
    deposit: Number,
    depositRat: Number,
    filesNum: Number,
    files: [],
    audit: {
        // 审核状态
        type: String,
        default: '未审核',
        enum: ['已审核', '未审核']
    },
    close: {
        // 审核状态
        type: String,
        default: '未关闭',
        enum: ['未关闭', '已关闭', '手动关闭']
    },
    storage: {
        // 审核状态
        type: String,
        default: '未出库',
        enum: ['部分出库', '全部出库', '未出库']
    },
    custom: {
        type: Object,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('salesOrder', salesOrderSchema);