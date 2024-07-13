const express = require('express');
const router = express.Router();
const { createForm, getForm, updateFormStatus } = require('../controllers/formsController');

router.post('/', createForm);
router.get('/:id', getForm);
router.put('/:id/status', updateFormStatus);

module.exports = router;
