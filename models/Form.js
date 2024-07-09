const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    name: String,
    designation: String,
    effectiveDate: Date,
    effectiveUntil: Date,
    department: String,
    accessRights: {
        new: Boolean,
        change: Boolean,
        blockInactive: Boolean
    },
    idCreation: [{
        no: Number,
        idCreation: String,
        yes: Boolean,
        remark: String
    }],
    remarks: String,
    requestedBy: {
        name: String,
        email: String
    },
    approvedBy: {
        name: String,
        email: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    }
});

module.exports = mongoose.model('Form', formSchema);
