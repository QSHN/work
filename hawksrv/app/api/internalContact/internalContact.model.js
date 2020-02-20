const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const InternalContactSchema = new Schema({
    companyId: {
        type: ObjectId,
        required: true
    },
    creator: {
        type: ObjectId,
        required: true
    },
    send: {
        type: [ObjectId],
        required: true
    },
    cType: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    reply: {
        type: [{
            replyId: ObjectId,
            replyContent: String
        }],
        default: []
    },
    approver: {
        type: [{
            uid: {
                type: ObjectId,
                required: true
            },
            status: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                default: ''
            }
        }],
        required: true
    },
    status: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('InternalContact', InternalContactSchema);
