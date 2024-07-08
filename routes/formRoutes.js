// eform-backend/routes/formRoutes.js
const express = require('express');
const router = express.Router();
const Form = require('../models/Form');
const Formmodel = require('../models/FormModel');
const nodemailer = require('nodemailer');

// Configure nodemailer
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'your-email@gmail.com',
//         pass: 'your-email-password'
//     }
// });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


router.post('/', async (req, res) => {
    const { name, designation, effectiveDate, effectiveUntil, department, accessRights, idCreation, remarks, requestedBy, approvedBy } = req.body;
    try {
        const newForm = new Form({ name, designation, effectiveDate, effectiveUntil, department, accessRights, idCreation, remarks, requestedBy, approvedBy });
        await newForm.save();

        const mailOptions = {
            from: 'your-email@gmail.com',
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
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
