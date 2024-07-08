const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const Form = require('./models/FormModel'); // Assuming correct path to FormModel

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send approval email function
const sendApprovalEmail = async (formData) => {
    const { name, email } = formData.approvedBy;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Approval Notification',
        html: `<p>Hello ${name},</p><p>Your form has been approved.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Approval email sent');
    } catch (error) {
        console.error('Error sending approval email:', error);
        throw error;
    }
};

// Send approval notification email function
const sendApprovalNotificationEmail = async (formData) => {
    const { name, email } = formData.requestedBy;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Approval Notification',
        html: `<p>Hello ${name},</p><p>Your request has been approved.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Approval notification email sent');
    } catch (error) {
        console.error('Error sending approval notification email:', error);
        throw error;
    }
};

// Routes
const formRoutes = require('./routes/formRoutes');
app.use('/api/forms', formRoutes);

// Update form status to Approved and send approval emails
app.put('/api/forms/:id/approve', async (req, res) => {
    try {
        const formId = req.params.id;
        const updatedForm = await Form.findByIdAndUpdate(formId, { status: 'Approved' }, { new: true });
        await sendApprovalEmail(updatedForm); // Send email to approver
        await sendApprovalNotificationEmail(updatedForm); // Send email to requester
        res.json(updatedForm);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update form status to Rejected
app.put('/api/forms/:id/reject', async (req, res) => {
    try {
        const formId = req.params.id;
        const updatedForm = await Form.findByIdAndUpdate(formId, { status: 'Rejected' }, { new: true });
        res.json(updatedForm);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
