const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const WarehouseDiskDeficientSchema = new Schema({
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
    list: {
        // 单据内容
        type: [{
            commodityId: ObjectId,
            code: String,
            name: String,
            warehouseId: ObjectId,
            inventory: Number,
            unit: String,
            unitList: Array,
            groupId: ObjectId,
            auxiliary: String,
            number: Number,
            unitDelivery: Number,
            deliveryCost: Number,
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
    audit: {
        // 审核状态
        type: String,
        default: '未审核',
        enum: ['已审核', '未审核']
    },
    creator: {
        type: ObjectId
    },
    editor: {
        type: ObjectId
    },
    auditor: {
        type: ObjectId
    },
    custom: {
        type: Object,
        default: null
    },
    credentialsId: {
        type: Object,
        default: null
    },
    credentialsCaseId: {
        type: Object,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('WarehouseDiskDeficient', WarehouseDiskDeficientSchema);