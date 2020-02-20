const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const CommodityPricesSchema = new Schema({
    accountSetId: {
        // 账套id
        type: ObjectId,
        required: true
    },
    commodityId: {
        // 商品ID
        type: ObjectId,
        required: true
    },
    prices: {
        type: [
            {
                auxiliary: String,
                unit: String,
                sales: {
                    // 销售价格
                    type: {
                        wholesale: {
                            // 批发价
                            type: Number,
                            default: 0
                        },
                        retail: {
                            // 零售价
                            type: Number,
                            default: 0
                        },
                        cost: {
                            // 配货价
                            type: Number,
                            default: 0
                        },
                        lowest: {
                            // 最低售价
                            type: Number,
                            default: 0
                        }
                    }
                },
                purchase: {
                    type: {
                        discount: {
                            // 反算折扣(0-10折)
                            type: Number,
                            default: 0
                        },
                        purchasing: {
                            // 采购单价
                            type: Number,
                            default: 0
                        },
                        discountP: {
                            // 采购折扣
                            type: Number,
                            default: 0
                        },
                        latest: {
                            // 最近采购价
                            type: Number,
                            default: 0
                        },
                        highest: {
                            // 最高进价
                            type: Number,
                            default: 0
                        }
                    }
                }
            }
        ]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CommodityPrices', CommodityPricesSchema);
