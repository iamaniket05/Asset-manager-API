const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const header = require('../utilities/header');
const token = require('../utilities/token');
let validator = require('../utilities/validation/validator');

router.post('/create', header.checkHeader, validator.supplierCreate, token.verifyToken, supplierController.create);
router.get('/list', header.checkHeader, token.verifyToken, supplierController.getAll);
router.get('/get/:id', header.checkHeader, token.verifyToken, supplierController.getById);
router.put('/update/:id', header.checkHeader, validator.supplierUpdate, token.verifyToken, supplierController.update);
router.delete('/delete/:id', header.checkHeader, token.verifyToken, supplierController.remove);

module.exports = router;
