const express = require('express');
const router = express.Router();

const organizationController = require('../controllers/organizationController');
const header = require('../utilities/header');
const token = require('../utilities/token');
const upload = require('../utilities/upload');

router.post(
  "/create",
  upload.any(),
  header.checkHeader,
  token.verifyToken,
  organizationController.create
);

router.get(
  '/list',
  header.checkHeader,
  token.verifyToken,
  organizationController.getAll
);

router.get(
  '/get/:id',
  header.checkHeader,
  token.verifyToken,
  organizationController.getById
);


module.exports = router;
