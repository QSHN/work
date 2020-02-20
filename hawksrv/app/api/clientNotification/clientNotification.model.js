const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const clientNotificationSchema = new Schema({
    companyId: {
        type: ObjectId, //公司ID
        required: true
    },
    notification: {
        type: [],
        default: []
    }
},{
    timestamps: true
});

module.exports = mongoose.model('clientNotification', clientNotificationSchema);
