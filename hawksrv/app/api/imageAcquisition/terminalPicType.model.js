const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const TerminalPicTypeSchema = new Schema({
    companyId: {
        type: ObjectId, //公司ID
        required: true
    },
    types: {
        type: [],
        default: ['终端', '门头', '货架', '堆头', '陈列']
    }
},{
    timestamps: true
});

module.exports = mongoose.model('TerminalPicType', TerminalPicTypeSchema);
