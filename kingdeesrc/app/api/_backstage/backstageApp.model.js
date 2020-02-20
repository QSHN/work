const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const BackstageAppSchema = new Schema({
    code: {
        // 版本号
        type: String,
        required: true,
        unique: true
    },
    internalCode: {
        // 内部版本号
        type: Number,
        required: true,
        unique: true
    },
    content: {
        // 版本内容
        type: String,
        default: '',
        required: true
    },
    time: {
        // 发布时间
        type: Date,
        default: null,
        required: true
    },
    isUpdate: {
        // 强制更新
        type: Boolean,
        default: false
    },
    status: {
        // 状态
        type: Boolean,
        default: false
    },
    down: {
        // 下载链接
        type: String,
        required: true
    },
    md5: {
        // md5
        type: String,
        required: true
    },
    size: {
        // 大小
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BackstageApp', BackstageAppSchema);
