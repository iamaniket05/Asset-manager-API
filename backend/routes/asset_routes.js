const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const header = require('../utilities/header');
const token = require('../utilities/token');
const validator = require('../utilities/validation/validator');

router.post('/create', header.checkHeader, token.verifyToken,validator.assetCreate, assetController.create);
router.get('/list', header.checkHeader, token.verifyToken, assetController.getAll);
router.get('/get/:id', header.checkHeader, token.verifyToken, assetController.getById);
router.put('/update/:id', header.checkHeader, token.verifyToken,validator.assetUpdate, assetController.update);
router.delete('/delete/:id', header.checkHeader, token.verifyToken, assetController.remove);

module.exports = router;
