const express = require('express');
const router = express.Router();
const { createForm, getForm, updateFormStatus } = require('../controllers/formController');

router.post('/', createForm);
router.get('/:id', getForm);
router.put('/:id/status', updateFormStatus);

module.exports = router;
