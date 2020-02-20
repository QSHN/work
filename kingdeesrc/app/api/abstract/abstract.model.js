const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const AbstractSchema = new Schema({
    accountSetId: {
        // 账套id
        type: String,
        required: true
    },
    name: {
        // 名字
        type: String,
        default: ''
    },
    code: {
        // 编码
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Abstract', AbstractSchema);
