let express = require('express');
let router = express.Router();

let decryptController = require('../controllers/decryptController');
let header = require('../utilities/header');


router.post('/', header.checkHeader, decryptController.decryptFields);

module.exports = router;
