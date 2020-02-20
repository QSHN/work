const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const CxCarManageSchema = new Schema({
    companyId: {
        type: ObjectId, //公司ID
        required: true
    },
    numberPlate: {
        type: String,
        required: true,
        unique: true
    },
    salesman: {
        type: ObjectId,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true
    },
    creator: {
        type: ObjectId,
        required: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('CxCarManage', CxCarManageSchema);
