const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const CxTruckSchema = new Schema({
    companyId: {
        type: ObjectId, //公司ID
        required: true
    },
    numberPlate: {
        type: String,
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
    }
},{
    timestamps: true
});

module.exports = mongoose.model('CxTruck', CxTruckSchema);
