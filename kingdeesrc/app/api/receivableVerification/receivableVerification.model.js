const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const ReceivableVerificationSchema = new Schema({
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
    orderType: {
        // 类型
        type: String,
        required: true
    },
    customerId: {
        // 客户
        type: ObjectId
    },
    customerClerkId: {
        // 业务员
        type: ObjectId
    },
    customerDepartmentId: {
        // 部门
        type: ObjectId
    },
    supplierId: {
        // 客户
        type: ObjectId
    },
    supplierClerkId: {
        // 业务员
        type: ObjectId
    },
    supplierDepartmentId: {
        // 部门
        type: ObjectId
    },
    des: {
        // 备注
        type: String
    },
    main: {
        list: [{
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
        total: Number
    },
    blunt: {
        list: [{
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
        total: Number
    },
    audit: {
        // 审核状态
        type: String,
        default: '未审核',
        enum: ['已审核', '未审核']
    },
    creator: ObjectId,
    auditor: ObjectId,
    editor: ObjectId,
    cAt: Date,
    aAt: Date,
    eAt: Date,
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

module.exports = mongoose.model('ReceivableVerification', ReceivableVerificationSchema);