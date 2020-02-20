const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const TypeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    parentId: {
        type: String,
        default: '0'
    }
})

const CommodityTypeSchema = new Schema({
    companyId: {
        type: ObjectId, //公司ID
        required: true
    },
    type: {
        type: [TypeSchema],
        required: true
    },
},{
    timestamps: true
});

module.exports = mongoose.model('CommodityType', CommodityTypeSchema);
