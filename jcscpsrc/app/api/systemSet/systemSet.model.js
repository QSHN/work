const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SystemSetSchema = new Schema({
    passErr: {
        // 密码错误次数
        type: Number,
        default: 5
    },
    customerHash: {
        // 客户账号默认密码
        type: String,
        default: '123456'
    },
    employeeHash: {
        // 员工账号默认密码
        type: String,
        default: '123456'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SystemSet', SystemSetSchema);
