const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const WarehouseSchema = new Schema({
    accountSetId: {
        // 账套id
        type: ObjectId,
        required: true
    },
    groupId: {
        // 组Id
        type: ObjectId,
        default: null
    },
    code: {
        // 编码
        type: String,
        required: true
    },
    name: {
        // 名称
        type: String,
        required: true
    },
    contact: {
        // 联系人
        type: String
    },
    phone: {
        // 手机
        type: Number
    },
    tel: {
        // 电话
        type: Number
    },
    addressList: {
        // 地址选择
        type: Array,
        default: []
    },
    address: {
        // 地址
        type: String
    },
    des: {
        // 备注
        type: String
    },
    status: {
        // 状态
        type: String,
        default: '启用',
        enum: ['启用', '禁用']
    },
    creator: {
        // 创建人
        type: ObjectId,
        required: true
    },
    inventoryList: {
        // 库存商品列表
        type: [],
        default: []
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Warehouse', WarehouseSchema);
