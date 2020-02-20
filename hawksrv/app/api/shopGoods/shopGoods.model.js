const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const ShopGoodsSchema = new Schema({
    companyId: {
        type: ObjectId, //公司ID
        required: true
    },
    name: {
        type: String,
        required: true
    },
    commodity: {
        type: [],
        required: true
    },
    photos: {
        type: [],
        required: true
    },
    des: {
        type: String,
        default: ''
    },
    creator: {
        type: ObjectId,
        required: true
    },
    visitId: {
        type: String,
        default: ''
    }
},{
    timestamps: true
});

module.exports = mongoose.model('ShopGoods', ShopGoodsSchema);
