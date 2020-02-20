const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const AccountSetSchema = new Schema({
    companyId: {
        // 公司Id
        type: ObjectId,
        required: true
    },
    accountSetId: {
        // 账套号
        type: String,
        required: true,
        unique: true
    },
    accountSetName: {
        // 账套名字
        type: String,
        required: true
    },
    accountSetType: {
        // 账套类型
        type: String,
        default: '标准供应链解决方案',
        enum: ['标准供应链解决方案', '商业企业通用解决方案', '标准财务解决方案', '集团财务解决方案', '2017年行政事业管理解决方案', '医药制造行业解决方案', '医药流通行业解决方案', '战略人力资源解决方案']
    },
    organization: {
        // 机构名称
        type: String,
        required: true
    },
    address: {
        // 地址
        type: String,
        default: ''
    },
    tel: {
        // 电话
        type: String,
        default: ''
    },
    logo: {
        // 公司图标
        type: String,
        default: ''
    },
    code: {
        // 记账本位币编码
        type: String,
        required: true
    },
    unit: {
        // 记账金额单位
        type: String,
        required: true
    },
    float: {
        // 小数点位数
        type: Number,
        default: 2
    },
    approve: {
        // 凭证过账前必需审核
        type: Boolean,
        default: false
    },
    cost: {
        // 启用标准成本体系
        type: Boolean,
        default: false
    },
    accountingYear: {
        // 启用会计年度 e.g 2019
        type: Number,
        required: true
    },
    accountingPeriod: {
        // 启用会计期间 e.g 1
        type: Number,
        required: true
    },
    nature: {
        // 自然年度会计期间
        type: Boolean,
        default: true
    },
    accountingNumber: {
        // 会计期间数
        type: Number,
        required: true,
        enum: [12, 13]
    },
    status: {
        // 账套状态
        type: String,
        required: true,
        enum: ['已启用', '已禁用']
    },
    generalLedger: {
        // 总账初始化
        type: Boolean,
        default: false
    },
    currentAccountingPeriod: {
        // 当前会计期间
        type: String,
        default: ''
    },
    userList: {
        // 用户群
        type: [ObjectId],
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AccountSet', AccountSetSchema);
