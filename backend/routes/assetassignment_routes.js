const express = require('express');
const router = express.Router();
 
const assetAssignmentController = require('../controllers/assetAssignmentController');
const header = require('../utilities/header');
const token = require('../utilities/token');
 
router.post('/assign', header.checkHeader, token.verifyToken, assetAssignmentController.assign);
 
router.get('/list', header.checkHeader, token.verifyToken, assetAssignmentController.getAll);
 
router.get('/get/:id', header.checkHeader, token.verifyToken, assetAssignmentController.getById);
 
 
router.put('/return/:id', header.checkHeader, token.verifyToken, assetAssignmentController.returnAsset);
 
// DELETE assignment
router.delete('/delete/:id', header.checkHeader, token.verifyToken, assetAssignmentController.deleteAssignment);
 
 
module.exports = router;
 