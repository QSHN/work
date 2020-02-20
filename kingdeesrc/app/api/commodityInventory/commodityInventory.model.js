const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const commodityInventorySchema = new Schema({
    accountSetId: {
        // 账套id
        type: ObjectId,
        required: true
    },
    commodityId: {
        // 商品id
        type: ObjectId,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    warehouseId: {
        // 仓库id
        type: ObjectId,
        required: true
    },
    groupId: {
        // 商品类别
        type: ObjectId,
        required: true
    },
    auxiliary: {
        // 属性
        type: String
    },
    unit: {
        // 基本单位
        type: String
    },
    unitList: {
        // 基本单位
        type: Array
    },
    registration: {
        // 注册证号
        type: String
    },
    production: {
        // 生产许可证
        type: String
    },
    beginning: {
        // 期初余额
        type: Number
    },
    inventory: {
        // 库存
        type: Number
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('commodityInventory', commodityInventorySchema);
