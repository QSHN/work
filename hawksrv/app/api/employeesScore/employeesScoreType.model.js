const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const EmployeesScoreTypeSchema = new Schema({
    companyId: {
        type: ObjectId, //公司ID
        required: true
    },
    type: {
        type: [String],  // 车辆类型
        default: ['优秀', '良好', '一般', '不及格']
    }
},{
    timestamps: true
});

module.exports = mongoose.model('EmployeesScoreType', EmployeesScoreTypeSchema);
