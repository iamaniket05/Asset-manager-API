let express = require('express');
let router = express.Router();
let employeeController = require('../controllers/employeeController');
let header = require('../utilities/header');
let validator = require('../utilities/validation/validator');
const token = require('../utilities/token');

router.post('/create', header.checkHeader,validator.register, employeeController.create);

router.post('/login', header.checkHeader,validator.login, employeeController.login);

router.get('/list', header.checkHeader,token.verifyToken, employeeController.getAll);

router.get('/:id', header.checkHeader,token.verifyToken, employeeController.getById);

router.put('/update/:id', header.checkHeader, token.verifyToken,validator.updateValidator, employeeController.update);

router.delete('/delete/:id', header.checkHeader, token.verifyToken, employeeController.delete);

module.exports = router;