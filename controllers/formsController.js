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

    const formHtml = `
      <div>
        <h1>Access Rights Requisition</h1>
        <p><strong>Name:</strong> ${form.name}</p>
        <p><strong>Designation:</strong> ${form.designation}</p>
        <p><strong>Effective Date:</strong> ${form.effectiveDate}</p>
        <p><strong>Effective Until:</strong> ${form.effectiveUntil}</p>
        <p><strong>Department:</strong> ${form.department}</p>
        <p><strong>Access Rights:</strong></p>
        <ul>
          <li>New: ${form.accessRights.new ? 'Yes' : 'No'}</li>
          <li>Change: ${form.accessRights.change ? 'Yes' : 'No'}</li>
          <li>Block/Inactive: ${form.accessRights.blockInactive ? 'Yes' : 'No'}</li>
        </ul>
        <table border="1">
          <thead>
            <tr>
              <th>No</th>
              <th>ID Creation</th>
              <th>Yes</th>
              <th>No</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            ${form.idCreation.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.yes ? 'Yes' : ''}</td>
                <td>${item.no ? 'No' : ''}</td>
                <td>${item.remark}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <p><strong>Remarks (for IT Department):</strong> ${form.remarks}</p>
        <p><strong>Requested By (Name):</strong> ${form.requestedByName}</p>
        <p><strong>Requested By (Email):</strong> ${form.requestedByEmail}</p>
        <h2>Status: ${req.body.status}</h2>
      </div>
    `;

    const userMailOptions = {
      from: process.env.EMAIL,
      to: form.requestedByEmail,
      subject: `Your form has been ${req.body.status}`,
      html: `<p>Your form has been ${req.body.status} by the approver.</p>${formHtml}`
    };

    const itMailOptions = {
      from: process.env.EMAIL,
      to: process.env.IT_DEPARTMENT_EMAIL,
      subject: `Form ${req.body.status}`,
      html: `<p>A form has been ${req.body.status}.</p>${formHtml}`
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
