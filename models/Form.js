const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
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
      name: { type: String },
      yes: { type: Boolean, default: false },
      no: { type: Boolean, default: false },
      remark: { type: String }
    }
  ],
  remarks: { type: String },
  requestedByName: { type: String, required: true },
  requestedByEmail: { type: String, required: true },
  approverEmail: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Form', formSchema);
