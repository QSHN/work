const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const UnitGroupSchema = new Schema({
    accountSetId: {
        // 账套id
        type: ObjectId,
        required: true
    },
    code: {
        // 编码
        type: String,
        required: true
    },
    name: {
        // 计量单位组名称
        type: String,
        required: true
    },
    defaultValue: {
        // 默认单位
        type: ObjectId,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('UnitGroup', UnitGroupSchema);
