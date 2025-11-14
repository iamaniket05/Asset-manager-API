const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const header = require('../utilities/header');
const token = require('../utilities/token');
let validator = require('../utilities/validation/validator');

// Create department
router.post('/create', header.checkHeader,validator.departmentCreate,token.verifyToken, departmentController.create);

// Get all departments
router.get('/list', header.checkHeader, token.verifyToken, departmentController.getAll);

//  Get department by ID
router.get('/get/:id', header.checkHeader, token.verifyToken, departmentController.getById);

//  Update department
router.put('/update/:id', header.checkHeader,validator.departmentUpdate, token.verifyToken, departmentController.update);

//  Delete department
router.delete('/delete/:id', header.checkHeader, token.verifyToken, departmentController.remove);

module.exports = router;