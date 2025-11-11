let express = require('express');
let router = express.Router();

let adminController = require('../controllers/adminController');
let header = require('../utilities/header');


// Admin Routes (Standard Style)


//  Register admin
router.post('/register', header.checkHeader, adminController.register);

//  Login admin
router.post('/login', header.checkHeader, adminController.login);

//  List all admins
router.get('/getAllAdmins', header.checkHeader, adminController.getAllAdmins);

//  Get admin by ID
router.get('/:id', header.checkHeader, adminController.getAdminById);

//  Update admin by ID
router.put('/update/:id', header.checkHeader, adminController.update);

//  Delete admin by ID
router.delete('/delete/:id', header.checkHeader, adminController.delete);


module.exports = router;
