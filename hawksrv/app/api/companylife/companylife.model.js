const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const L = require('debug')('app:api');


const CompanyLifeItem = new mongoose.Schema({
    validDate: {
        type: Date,
        required: true,
    },
    number: {
        type: Number,
        required: true
    }
});

const CompanyLifeSchema = mongoose.Schema({
    companyId: {
        type: String,
        unique:true,
        required: true,
    },
    number: {
        type: Number,
    },
    validDate: {
        type: Date,
        lowercase: true,
    },
    nearestValidDate: {
        type: Date,
    },
    nextPeriodNumber: {
        type: Number,
    },
    status:{
        type:String,
        default: "正常",
        enum: ['试用','正常', '禁用', '已过期']
    },
    items:[CompanyLifeItem]
}, {
    timestamps: true
});

module.exports = mongoose.model('CompanyLife', CompanyLifeSchema,"companylifes");
