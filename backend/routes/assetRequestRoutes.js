const express = require('express');
const router = express.Router();
const assetRequestController = require('../controllers/assetRequestController');
const header = require('../utilities/header');
const token = require('../utilities/token');
let validator = require('../utilities/validation/validator'); // optional

router.post('/create', header.checkHeader, token.verifyToken,validator.requestCreate, assetRequestController.create);

router.get('/list', header.checkHeader, token.verifyToken, assetRequestController.list);

router.get('/get/:id', header.checkHeader, token.verifyToken, assetRequestController.getById);

router.post('/act/:id', header.checkHeader, token.verifyToken, assetRequestController.act);

router.put('/update/:id', header.checkHeader, token.verifyToken,validator.requestUpdate, assetRequestController.update);

router.delete('/delete/:id', header.checkHeader, token.verifyToken, assetRequestController.remove);

module.exports = router;
