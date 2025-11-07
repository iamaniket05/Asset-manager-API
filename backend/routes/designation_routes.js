const express = require('express');
const router = express.Router();
const designationController = require('../controllers/designationController');
const header = require('../utilities/header');
const token = require('../utilities/token');

// Apply same header & token protection like admin/department
router.post('/create', header.checkHeader, token.verifyToken, designationController.create);
router.get('/list', header.checkHeader, token.verifyToken, designationController.getAll);
router.get('/get/:id', header.checkHeader, token.verifyToken, designationController.getById);
router.put('/update/:id', header.checkHeader, token.verifyToken, designationController.update);
router.delete('/delete/:id', header.checkHeader, token.verifyToken, designationController.remove);

module.exports = router;
