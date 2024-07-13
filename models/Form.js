const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    name: String,
    designation: String,
    effectiveDate: Date,
    effectiveUntil: Date,
    department: String,
    idCreation: [
        {
            name: String,
            yes: Boolean,
            no: Boolean,
            remark: String
        }
    ],
    remarks: String,
    requestedByName: String,
    requestedByEmail: String,
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    }
});

module.exports = mongoose.model('Form', formSchema);
