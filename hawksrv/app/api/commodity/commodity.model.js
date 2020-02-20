const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const CommoditySchema = new Schema({
    companyId: {
        type: ObjectId, //公司ID
        required: true
    },
    type: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    coding: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    barCode: {
        type: String,
        default: ''
    },
    standard: {
        type: String,
        default: ''
    },
    brand: {
        type: String,
        default: ''
    },
    photos: {
        type: [],
        required: true
    },
    retailPrice: {
        type: String,
        default: ''
    },
    costPrice:  {
        type: String,
        default: ''
    },
    price: {
        type: String,
        required: true
    },
    classPrice: {
        type: [],
        default: []
    },
    unit: {
        type: String,
        required: true
    },
    unitList: {
        type: [],
        default: []
    },
    produced: {
        type: Date,
        required: true
    },
    expiration: {
        type: String,
        default: ''
    },
    dateUnit: {
        type: String,
        default: ''
    },
    noteTime: {
        type: String,
        default: ''
    },
    weight: {
        type: String,
        default: ''
    },
    mnemonic: {
        type: String,
        default: ''
    },
    des: {
        type: String,
        default: ''
    },
    status: {
        type: Boolean,
        required: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Commodity', CommoditySchema);
