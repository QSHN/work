const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const WarehouseDiskPointSchema = new Schema({
    accountSetId: {
        // 账套id
        type: ObjectId,
        required: true
    },
    code: {
        // 单据编号
        type: String,
        required: true
    },
    dateTime: {
        // 单据日期
        type: Date,
        required: true
    },
    pointTime: {
        // 盘点日期
        type: Date
    },
    warehouseId: {
        type: ObjectId
    },
    clerkId: {
        // 业务员
        type: ObjectId
    },
    list: {
        // 单据内容
        type: [{
            commodityId: ObjectId,
            code: String,
            name: String,
            unit: String,
            unitList: Array,
            groupId: ObjectId,
            auxiliary: String,
            inventory: Number,
            number: Number,
            commodityDes: String,
            isBatch: Boolean,
            isShelfLife: Boolean,
            batch: String,
            shelfLifeDays: Number,
            generateDate: Date,
            effectiveDate: Date,
            package: String,
            packageList: Array,
            packageNumber: Number
        }],
        default: []
    },
    lock: {
        type: String,
        default: '解锁',
        enum: ['解锁', '锁盘']
    },
    result: {
        type: String,
        default: '盘点中',
        enum: ['盘点中', '已盘点']
    },
    deficientId: {
        type: ObjectId
    },
    deficientCode: {
        type: String
    },
    surplusId: {
        type: ObjectId
    },
    surplusCode: {
        type: String
    },
    custom: {
        type: Object,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('WarehouseDiskPoint', WarehouseDiskPointSchema);