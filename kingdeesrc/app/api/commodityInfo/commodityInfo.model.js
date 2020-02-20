const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const CommodityInfoSchema = new Schema({
    accountSetId: {
        // 账套id
        type: ObjectId,
        required: true
    },
    barcode: {
        // 商品条码
        type: String
    },
    code: {
        // 商品代码
        type: String,
        required: true
    },
    name: {
        // 商品名称
        type: String,
        required: true
    },
    abbreviation: {
        // 简称
        type: String
    },
    goodsType: {
        // 商品类型
        type: String,
        required: true
    },
    groupId: {
        // 商品类别
        type: ObjectId,
        required: true
    },
    unitGroup: {
        // 计量单位组
        type: ObjectId,
        required: true
    },
    unitId: {
        // 基本单位
        type: ObjectId,
        required: true
    },
    unit: {
        // 基本单位
        type: String,
        required: true
    },
    basicInfo: {
        // 基本信息
        brand: ObjectId, // 商品品牌
        specifications: String, // 规格型号
        wholesalePrice: Number,
        retailPrice: Number,
        placeOrigin: String,
        source: ObjectId,
        classificationCode: String,
        rate: Number,
        registration: String,
        production: String,
        describe: String,
        des: String,
        custom: Array
    },
    character: {
        // 商品特性
        batch: Boolean,
        serialNumber: Boolean,
        enable: Boolean,
        shelfLife: Boolean,
        auxiliary: Boolean,
        subComponent: Boolean,
        component: Boolean,
        shelfLifeData: {
            shelfLifeDays: Number,
            warningDays: Number
        },
        auxiliaryData: {
            select: Array,
            content: Array
        }
    },
    measureUnit: {
        // 计量单位
        sales: ObjectId,
        purchasing: ObjectId,
        inventory: ObjectId,
        auxiliary: ObjectId,
        barcode: ObjectId,
        conversion: Array
    },
    holdings: {
        // 库存资料
        defaultWarehouse: ObjectId,
        negativeInventory: Boolean,
        inventoryManage: Boolean,
        auxiliarySetting: Boolean,
        which: String,
        unified: {
            minimum: Number,
            maximum: Number,
            safety: Number
        },
        points: Array
    },
    purchase: {
        // 采购资料
        supplier: ObjectId,
        clerk: ObjectId,
        purchasing: Number
    },
    picFiles: {
        // 图片附件
        mainImage: Array,
        otherPictures: Array,
        files: Array,
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
    inventory: {
        // 库存数量
        type: Number,
        default: 0
    },
    subjectCode: {
        // 科目code
        type: String,
        default: null
    },
    incomeSubjectCode: {
        // 科目code
        type: String,
        default: null
    },
    costSubjectCode: {
        // 科目code
        type: String,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CommodityInfo', CommodityInfoSchema);
