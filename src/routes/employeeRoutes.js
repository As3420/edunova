const express = require('express');
const { createEmployee, employeeLogin, updateDailyWork } = require('../controllers/employeeController');
const { protect, adminOnly, employeeOnly } = require("../middleware/authMiddleware");


const router = express.Router();

// Admin creates employee
router.post('/createEmployee', protect, adminOnly, createEmployee);
// Employee login
router.post('/login', employeeLogin);
// Employee updates daily work
router.post('/daily-work', protect, employeeOnly, updateDailyWork);

module.exports = router;
