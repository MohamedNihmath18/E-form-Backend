const Form = require('../models/Form');
const nodemailer = require('nodemailer');

const createForm = async (req, res) => {
  try {
    const form = new Form(req.body);
    await form.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.approverEmail,
      subject: 'Approval Request',
      text: `Please approve the form by clicking the link: ${process.env.FRONTEND_URL}/approval/${form._id}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Email sent: ' + info.response);
    });

    res.status(201).json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFormStatus = async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const userMailOptions = {
      from: process.env.EMAIL,
      to: form.requestedByEmail,
      subject: `Your form has been ${req.body.status}`,
      text: `Your form has been ${req.body.status} by the approver.`,
    };

    const itMailOptions = {
      from: process.env.EMAIL,
      to: process.env.IT_DEPARTMENT_EMAIL,
      subject: `Form ${req.body.status}`,
      text: `A form has been ${req.body.status}.`,
    };

    transporter.sendMail(userMailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('User email sent: ' + info.response);
    });

    transporter.sendMail(itMailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('IT email sent: ' + info.response);
    });

    res.json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createForm, getForm, updateFormStatus };
