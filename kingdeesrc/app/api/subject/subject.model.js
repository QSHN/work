const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const SubjectSchema = new Schema({
    accountSetId: {
        // 账套id
        type: ObjectId,
        required: true
    },
    code: {
        // 科目编码
        type: String,
        required: true
    },
    parentId: {
        // 父级id
        type: [],
        default: []
    },
    mnemonic: {
        // 助记码
        type: String,
        default: ''
    },
    name: {
        // 科目名称
        type: String,
        required: true
    },
    typeId: {
        // 科目类别id
        type: ObjectId,
        required: true
    },
    type: {
        // 科目类别
        type: String,
        required: true
    },
    balance: {
        // 余额方向
        type: String,
        default: '借方',
        enum: ['借方', '贷方']
    },
    currency: {
        // 外币核算
        type: String,
        default: '不核算'
    },
    finalTuning: {
        // 期末调汇
        type: Boolean,
        default: false
    },
    currentAccount: {
        // 往来业务核算
        type: Boolean,
        default: false
    },
    isCA: {
        // 是否可以选择往来业务核算
        type: Boolean,
        default: true
    },
    numberUnit: {
        // 数量金额辅助核算
        type: Boolean,
        default: false
    },
    isNU: {
        // 是否可以选择数量金额辅助核算
        type: Boolean,
        default: true
    },
    unitGroup: {
        // 单位组
        type: String,
        default: ''
    },
    unit: {
        // 缺省单位
        type: String,
        default: ''
    },
    cashAccount: {
        // 现金科目
        type: Boolean,
        default: false
    },
    subjectBank: {
        // 银行科目
        type: Boolean,
        default: false
    },
    journal: {
        // 出日记账
        type: Boolean,
        default: false
    },
    cashEquivalents: {
        // 现金等价物
        type: Boolean,
        default: false
    },
    budgetItems: {
        // 预算科目
        type: Boolean,
        default: false
    },
    subjectDraw: {
        // 科目计息
        type: Boolean,
        default: false
    },
    isSD: {
        // 是否可以选择科目计息
        type: Boolean,
        default: true
    },
    draw: {
        // 日利率
        type: Number,
        default: 0
    },
    controlledSystem: {
        // 受控系统
        type: String,
        default: ''
    },
    isP: {
        // 是否可以选择预设现金流量项目
        type: Boolean,
        default: true
    },
    mainProjectCode: {
        // 主表项目编码
        type: String,
        default: ''
    },
    mainProject: {
        // 主表项目
        type: String,
        default: ''
    },
    scheduleProjectCode: {
        // 附表项目编码
        type: String,
        default: ''
    },
    scheduleProject: {
        // 附表项目
        type: String,
        default: ''
    },
    accountItem: {
        // 核算项目
        type: [String],
        default: []
    },
    status: {
        // 状态
        type: String,
        default: '启用',
        enum: ['启用', '禁用']
    },
    yearBorrow: {
        // 本年累计借方
        type: Number,
        default: null
    },
    yearCredit: {
        // 本年累计贷方
        type: Number,
        default: null
    },
    beginningBalance: {
        // 期初余额
        type: Number,
        default: null
    },
    initYearBorrow: {
        // 初始化时候原币本年累计借方
        type: Number,
        default: null
    },
    initYearCredit: {
        // 初始化时候原币本年累计贷方
        type: Number,
        default: null
    },
    initBeginningBalance: {
        // 初始化时候原币期初余额
        type: Number,
        default: null
    },
    initBRate: {
        // 初始化时候原币汇率
        type: Number,
        default: 1
    },
    initYBRate: {
        // 初始化时候原币汇率
        type: Number,
        default: 1
    },
    initYCRate: {
        // 初始化时候原币汇率
        type: Number,
        default: 1
    },
    eachBalance: {
        // 每期余额 过账/结账的时候计入
        type: [{
            time: {
                // 每期时间
                type: String,
                default: ''
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
            beginningBalance: {
                // 期初余额
                type: Number,
                default: null
            }
        }],
        default: []
    },
    eachYearBalance: {
        // 每年余额 过账1月/结账12月的时候计入
        type: [{
            time: {
                // 时间
                type: String,
                default: ''
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
            beginningBalance: {
                // 期初余额
                type: Number,
                default: null
            }
        }],
        default: []
    },
    subjectBalance: {
        // 科目余额
        type: Number,
        default: null
    },
    child: [
        {
            code: {
                type: String,
                default: null
            },
            name: {
                type: String,
                default: null
            },
            type: {
                type: String,
                default: null
            },
            yearBorrow: {
                type: Number,
                default: null
            },
            yearCredit: {
                type: Number,
                default: null
            },
            beginningBalance: {
                type: Number,
                default: null
            },
            initYearBorrow: {
                type: Number,
                default: null
            },
            initYearCredit: {
                type: Number,
                default: null
            },
            initBeginningBalance: {
                type: Number,
                default: null
            },
            initBRate: {
                type: Number,
                default: null
            },
            initYBRate: {
                type: Number,
                default: null
            },
            initYCRate: {
                type: Number,
                default: null
            },
            eachBalance: [{
                time: {
                    type: String,
                    default: null
                },
                borrower: {
                    type: Number,
                    default: null
                },
                lender: {
                    type: Number,
                    default: null
                },
                beginningBalance: {
                    type: Number,
                    default: null
                }
            }],
            eachYearBalance: [{
                time: {
                    type: String,
                    default: null
                },
                borrower: {
                    type: Number,
                    default: null
                },
                lender: {
                    type: Number,
                    default: null
                },
                beginningBalance: {
                    type: Number,
                    default: null
                }
            }]
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('Subject', SubjectSchema);
