const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const CommodityBrandSchema = new Schema({
    companyId: {
        type: ObjectId, //公司ID
        required: true
    },
    brand: {
        type: [],
        required: true
    },
},{
    timestamps: true
});

module.exports = mongoose.model('CommodityBrand', CommodityBrandSchema);
