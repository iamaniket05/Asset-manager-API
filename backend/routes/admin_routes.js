let express = require('express');
let router = express.Router();
let adminController = require('../controllers/adminController');
let header = require('../utilities/header');
let validator = require('../utilities/validation/validator');
const token = require('../utilities/token');

router.get("/dashboard",header.checkHeader, token.verifyToken, adminController.dashboardData);

router.post('/register', header.checkHeader,validator.register, adminController.register);

router.post('/login', header.checkHeader,validator.login, adminController.login);

router.get('/getAllAdmins', header.checkHeader,token.verifyToken, adminController.getAllAdmins);

router.get('/:id', header.checkHeader,token.verifyToken, adminController.getAdminById);

router.put('/update/:id', header.checkHeader, token.verifyToken,validator.updateValidator, adminController.update);

router.delete('/delete/:id', header.checkHeader, token.verifyToken, adminController.delete);



module.exports = router;