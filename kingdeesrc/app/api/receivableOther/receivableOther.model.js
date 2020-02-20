const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const ReceivableOtherSchema = new Schema({
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
    des: {
        // 备注
        type: String
    },
    balance: {
        // 余额
        type: Number
    },
    main: {
        preferential: Number,
        list: [{
            advanceAccountId: ObjectId,
            advanceType: ObjectId,
            advanceMoney: Number,
            transactionNo: String,
            des: String
        }],
        total: Number
    },
    order: {
        list: [{
            advanceAccountId: ObjectId,
            advanceMoney: Number,
            des: String
        }],
        total: Number,
        payList: [],
        payTotal: Number
    },
    audit: {
        // 审核状态
        type: String,
        default: '未审核',
        enum: ['已审核', '未审核']
    },
    status: {
        // 核销状态
        type: String,
        default: '未核销',
        enum: ['部分核销', '全部核销', '未核销']
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

module.exports = mongoose.model('ReceivableOther', ReceivableOtherSchema);