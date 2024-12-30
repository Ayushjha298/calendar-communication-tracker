const express = require('express');
const { addCompany, getCompanies, updateCompany, deleteCompany } = require('../controllers/companyController');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/companies', protect, addCompany);
router.get('/companies', protect, getCompanies);
router.put('/companies/:id', protect, updateCompany);
router.delete('/companies/:id', protect, deleteCompany);

module.exports = router;
