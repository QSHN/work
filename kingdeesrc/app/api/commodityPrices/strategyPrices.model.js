const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const StrategyPricesSchema = new Schema({
    accountSetId: {
        // 账套id
        type: ObjectId,
        required: true
    },
    sales: {
        type: [],
        default: [
            {
                title: '客户价格策略',
                status: '启用',
                index: 1
            },
            {
                title: '商品价格策略',
                status: '启用',
                index: 2
            },
            {
                title: '取历史采购价格',
                status: '启用',
                index: 3
            }
        ]
    },
    purchase: {
        type: [],
        default: [
            {
                title: '商品价格策略',
                status: '启用',
                index: 1
            },
            {
                title: '取历史采购价格',
                status: '启用',
                index: 2
            }
        ]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('StrategyPrices', StrategyPricesSchema);
