const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const BackstageClientSchema = new Schema({
    companyName: {
        // 公司名
        type: String,
        required: true,
        unique: true
    },
    companyAccount: {
        // 公司账号
        type: String,
        required: true,
        unique: true
    },
    name: {
        // 联系人
        type: String,
        required: true
    },
    phone: {
        // 手机号码
        type: String,
        required: true
    },
    salesmanId: {
        // 销售员
        type: ObjectId,
        required: true
    },
    accountStatus: {
        // 账号状态
        type: String,
        default: '正常',
        enum: ['正常', '禁用', '锁住', '已删除']
    },
    recordList: {
        // 记录
        type: [],
        default: []
    },
    financeFunction: {
        // 财务功能
        type: [],
        default: []
    },
    erpFunction: {
        // erp功能
        type: [],
        default: []
    },
    erpNumber: {
        // 行政人数
        type: Number,
        default: null
    },
    financeNumber: {
        // 财务人数
        type: Number,
        default: null
    },
    accountSetNumber: {
        // 账套数
        type: Number,
        default: null
    },
    files: {
        // 附件上传
        type: [],
        default: []
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BackstageClient', BackstageClientSchema);
