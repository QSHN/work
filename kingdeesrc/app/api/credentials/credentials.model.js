const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const CredentialsSchema = new Schema({
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
    certificateNumber: {
        // 凭证号
        type: Number,
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
    referenceInfo: {
        // 参考信息
        type: String,
        default: ''
    },
    businessDate: {
        // 业务日期
        type: Date,
        required: true
    },
    voucher: {
        // 制单
        type: ObjectId,
        default: null
    },
    audit: {
        // 审核
        type: ObjectId,
        default: null
    },
    post: {
        // 过账
        type: ObjectId,
        default: null
    },
    examine: {
        // 核准
        type: ObjectId,
        default: null
    },
    cashier: {
        // 出纳
        type: ObjectId,
        default: null
    },
    handle: {
        // 经办
        type: String,
        default: ''
    },
    des: {
        // 批注
        type: String,
        default: ''
    },
    paymentMode: {
        // 结算方式
        type: String,
        default: ''
    },
    paymentNo: {
        // 结算号
        type: String,
        default: ''
    },
    currentBusiness: {
        // 往来业务
        type: String,
        default: ''
    },
    files: {
        // 附件数
        type: Number,
        default: null
    },
    serialNumber: {
        // 序号
        type: Number,
        default: null
    },
    systemModule: {
        // 系统模块
        type: String,
        default: ''
    },
    description: {
        // 业务描述
        type: String,
        default: ''
    },
    invalid: {
        // 作废
        type: Boolean,
        default: false
    },
    orderType: String,
    orderId: ObjectId,
    cacheId: ObjectId
}, {
    timestamps: true
});

module.exports = mongoose.model('Credentials', CredentialsSchema);