const express = require('express');
const router = express.Router();
const Form = require('../models/Form'); // Ensure the correct path to your Form model
const nodemailer = require('nodemailer');

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to send approval email
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

// Function to send approval notification email
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

// Route to create a new form
router.post('/', async (req, res) => {
    const { name, designation, effectiveDate, effectiveUntil, department, accessRights, idCreation, remarks, requestedBy, approvedBy } = req.body;
    try {
        const newForm = new Form({ name, designation, effectiveDate, effectiveUntil, department, accessRights, idCreation, remarks, requestedBy, approvedBy });
        await newForm.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: approvedBy.email,
            subject: 'Access Rights Requisition Approval Request',
            text: `You have a new Access Rights Requisition request from ${requestedBy.name}. Please review and approve/reject the request.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Email sent: ' + info.response);
        });

        res.json(newForm);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to get a form by ID
router.get('/:id', async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }
        res.json(form);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to update form status to Approved and send approval emails
router.put('/:id/approve', async (req, res) => {
    try {
        const formId = req.params.id;
        const updatedForm = await Form.findByIdAndUpdate(formId, { status: 'Approved' }, { new: true });
        if (!updatedForm) {
            return res.status(404).json({ error: 'Form not found' });
        }
        await sendApprovalEmail(updatedForm); // Send email to approver
        await sendApprovalNotificationEmail(updatedForm); // Send email to requester
        res.json(updatedForm);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to update form status to Rejected
router.put('/:id/reject', async (req, res) => {
    try {
        const formId = req.params.id;
        const updatedForm = await Form.findByIdAndUpdate(formId, { status: 'Rejected' }, { new: true });
        if (!updatedForm) {
            return res.status(404).json({ error: 'Form not found' });
        }
        res.json(updatedForm);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
