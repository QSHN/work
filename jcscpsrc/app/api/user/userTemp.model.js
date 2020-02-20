const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserTempSchema = new Schema({
    customCustomer: {
        // 自定义客户资料字段
        type: [],
        default: [
            {
                name: '公司',
                type: 'input',
                val: ''
            },
            {
                name: '公司地址',
                type: 'input',
                val: ''
            },
            {
                name: '备注',
                type: 'textarea',
                val: ''
            }
        ]
    },
    customEmployee: {
        // 自定义员工资料字段
        type: [],
        default: [
            {
                name: '员工头像',
                type: 'img',
                val: ''
            },
            {
                name: '员工住址',
                type: 'input',
                val: ''
            },
            {
                name: '备注',
                type: 'textarea',
                val: ''
            }
        ]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('UserTemp', UserTempSchema);
