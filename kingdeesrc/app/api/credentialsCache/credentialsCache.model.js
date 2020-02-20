const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const CredentialsCacheSchema = new Schema({
    accountSetId: {
        // 账套id
        type: ObjectId,
        required: true
    },
    time: {
        // 日期
        type: Date,
        required: true
    },
    accountingPeriod: {
        // 会计期间
        type: String,
        required: true
    },
    proofWordId: {
        // 凭证字id
        type: ObjectId,
        required: true
    },
    proofWords: {
        // 凭证字
        type: String,
        required: true
    },
    child: {
        // 数据
        type: [{
            abstract: {
                // 摘要
                type: String,
                default: ''
            },
            subjectCode: {
                // 科目code
                type: String,
                required: true
            },
            subject: {
                // 科目
                type: String,
                required: true
            },
            currency: {
                // 币别
                type: String,
                default: ''
            },
            rateType: {
                // 汇率类型
                type: String,
                default: ''
            },
            rate: {
                // 公司汇率
                type: Number,
                default: null
            },
            currencyAmount: {
                // 原币金额
                type: Number,
                default: null
            },
            oldRate: {
                // 调整汇率前公司汇率
                type: Number,
                default: null
            },
            oldCurrencyAmount: {
                // 调整汇率前原币金额
                type: Number,
                default: null
            },
            unit: {
                // 单位
                type: String,
                default: ''
            },
            number: {
                // 数量
                type: Number,
                default: null
            },
            price: {
                // 单价
                type: Number,
                default: null
            },
            borrower: {
                // 借方
                type: Number,
                default: null
            },
            lender: {
                // 贷方
                type: Number,
                default: null
            },
            oldBorrower: {
                // 调整汇率前借方
                type: Number,
                default: null
            },
            oldLender: {
                // 调整汇率前贷方
                type: Number,
                default: null
            },
            isAllC: {
                // 是否可以选所有币别
                type: Boolean,
                default: false
            },
            accountingItem: {
                // 核算项目
                type: [],
                default: []
            }
        }],
        required: true
    },
    voucher: {
        // 制单
        type: ObjectId,
        default: null
    },
    files: {
        // 附件数
        type: Number,
        default: null
    },
    orderType: {
        type: String,
        default: null
    },
    orderCode: {
        type: String,
        default: null
    },
    orderId: {
        type: ObjectId,
        default: null
    },
    credentialsId: {
        type: ObjectId,
        default: null
    },
    certificateNumber: Number,
    result: String
}, {
    timestamps: true
});

module.exports = mongoose.model('CredentialsCache', CredentialsCacheSchema);
