const mongoose = require('mongoose');

// Define schema for form data
const FormSchema = new mongoose.Schema({
    name: { type: String, required: true },
    designation: { type: String, required: true },
    effectiveDate: { type: Date, required: true },
    effectiveUntil: { type: Date, required: true },
    department: { type: String, required: true },
    accessRights: {
        new: { type: Boolean, default: false },
        change: { type: Boolean, default: false },
        blockInactive: { type: Boolean, default: false }
    },
    idCreation: [
        {
            no: { type: Number, required: true },
            idCreation: { type: String, required: true },
            yes: { type: Boolean, default: false },
            remark: { type: String }
        }
    ],
    remarks: { type: String, required: true },
    requestedBy: {
        name: { type: String, required: true },
        email: { type: String, required: true }
    },
    approvedBy: {
        name: { type: String },
        email: { type: String }
    },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
});

// Create model from schema
const FormModel = mongoose.model('FormModel', FormSchema);

module.exports = FormModel;
