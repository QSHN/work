const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const ImageAcquisitionSchema = new Schema({
    companyId: {
        type: ObjectId, //公司ID
        required: true
    },
    name: {
        type: String,
        required: true
    },
    photos: {
        type: [],
        default: []
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

module.exports = mongoose.model('ImageAcquisition', ImageAcquisitionSchema);
