const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const commodityLabelGroupSchema = new Schema({
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
        // 商品标签组名称
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('commodityLabelGroup', commodityLabelGroupSchema);
