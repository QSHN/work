const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const SubjectTypeSchema = new Schema({
    accountSetId: {
        // 账套id
        type: ObjectId,
        required: true
    },
    type: {
        // 科目类
        type: Number,
        required: true
    },
    code: {
        // 编码
        type: Number,
        required: true
    },
    name: {
        // 名称
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SubjectType', SubjectTypeSchema);
