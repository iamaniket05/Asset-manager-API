const express = require('express');
const router = express.Router();
const assetcategoryController = require('../controllers/assetcategoryController');
const header = require('../utilities/header');
const token = require('../utilities/token');
let validator = require('../utilities/validation/validator');

// Create department
router.post('/create', header.checkHeader,validator.assetcategoryCreate,token.verifyToken, assetcategoryController.create);

// Get all departments
router.get('/list', header.checkHeader, token.verifyToken, assetcategoryController.getAll);

//  Get department by ID
router.get('/get/:id', header.checkHeader, token.verifyToken, assetcategoryController.getById);

//  Update department
router.put('/update/:id', header.checkHeader,validator.assetcategoryUpdate, token.verifyToken, assetcategoryController.update);

//  Delete department
router.delete('/delete/:id', header.checkHeader, token.verifyToken, assetcategoryController.remove);

module.exports = router;