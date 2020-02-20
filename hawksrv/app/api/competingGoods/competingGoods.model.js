const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const CompetingGoodsSchema = new Schema({
    companyId: {
        type: ObjectId, //公司ID
        required: true
    },
    name: {
        type: String,
        required: true
    },
    info: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        default: ''
    },
    exhibit: {
        type: String,
        default: ''
    },
    sales: {
        type: String,
        default: ''
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

module.exports = mongoose.model('CompetingGoods', CompetingGoodsSchema);
