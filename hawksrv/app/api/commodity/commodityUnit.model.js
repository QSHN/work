const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const CommodityUnitSchema = new Schema({
    companyId: {
        type: ObjectId, //公司ID
        required: true
    },
    unit: {
        type: [],
        required: true
    },
},{
    timestamps: true
});

module.exports = mongoose.model('CommodityUnit', CommodityUnitSchema);
