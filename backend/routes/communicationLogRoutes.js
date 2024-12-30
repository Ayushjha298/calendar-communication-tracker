const express = require('express');
const router = express.Router();
const { addCommunicationLog, getCompanyCommunications } = require('../controllers/communicationLogController');

router.post('/communication-logs', addCommunicationLog);

router.get('/communication-logs/company/:companyId', getCompanyCommunications);

module.exports = router;
