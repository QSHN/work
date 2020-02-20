const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const CustomerPricesSchema = new Schema({
    accountSetId: {
        // 账套id
        type: ObjectId,
        required: true
    },
    code: {
        // 价格策略代码
        type: String,
        required: true
    },
    name: {
        // 价格策略名字
        type: String,
        required: true
    },
    type: {
        // 客户分组方式
        type: String,
        default: '按客户设置',
        enum: ['按客户设置', '按客户等级设置', '按客户类别设置']
    },
    des: {
        // 备注
        type: String,
    },
    useUser: {
        type: Array
    },
    prices: {
        // 价格设置
        commodity: [{
            // 商品
            gIndex: Number,
            code: String,
            name: String,
            sku: String,
            auxiliary: String,
            barcode: String,
            specifications: String,
            groupId: ObjectId,
            unit: String,
            unitList: [],
            salesFrom: Number,
            salesTo: Number,
            salesPrice: Number,
            discount: Number
        }],
        category: [{
            // 类别
            gIndex: Number,
            groupId: ObjectId,
            salesFrom: Number,
            salesTo: Number,
            discount: Number
        }]
    },
    status: {
        // 状态
        type: String,
        default: '禁用',
        enum: ['启用', '禁用']
    },
    endTime: {
        type: Date
    },
    startTime: {
        type: Date
    },
    creator: {
        // 创建人
        type: ObjectId,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CustomerPrices', CustomerPricesSchema);
