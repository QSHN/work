const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const InternalContactTypeSchema = new Schema({
    companyId: {
        type: ObjectId, //公司ID
        required: true
    },
    type: {
        type: [String],  // 车辆类型
        default: ['急件', '普通', '请知悉', '其他']
    }
},{
    timestamps: true
});

module.exports = mongoose.model('InternalContactType', InternalContactTypeSchema);
