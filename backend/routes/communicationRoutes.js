// routes/communicationMethodRoutes.js
const express = require('express');
const router = express.Router();
const {
  addCommunicationMethod,
  getCommunicationMethods,
  updateCommunicationMethod,
  deleteCommunicationMethod,
} = require('../controllers/communicationController');


router.get('/', getCommunicationMethods);

router.post('/', addCommunicationMethod);

router.put('/:id', updateCommunicationMethod);

router.delete('/:id', deleteCommunicationMethod);

module.exports = router;
