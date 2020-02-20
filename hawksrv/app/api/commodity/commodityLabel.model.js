const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const CommodityLabelSchema = new Schema({
    companyId: {
        type: ObjectId, //公司ID
        required: true
    },
    label: {
        type: [],
        required: true
    },
},{
    timestamps: true
});

module.exports = mongoose.model('CommodityLabel', CommodityLabelSchema);
