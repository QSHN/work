const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BasicInfoGroupSchema = new Schema({
   group: {
       type: Object,
       default: [{ id: 1, name: '默认' }]
   }
}, {
    timestamps: true
});

module.exports = mongoose.model('BasicInfoGroup', BasicInfoGroupSchema);
