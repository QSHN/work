const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const basicInfo = require('./_basicInfo').basicInfo

const BasicInfoSchema = new Schema({
   info: {
       type: Object,
       default: basicInfo
   }
}, {
    timestamps: true
});

module.exports = mongoose.model('BasicInfo', BasicInfoSchema);
