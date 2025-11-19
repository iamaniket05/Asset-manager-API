const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationController');

const header = require('../utilities/header');
const token = require('../utilities/token');
// let validator = require('../utilities/validation/validator');  // keep but don't use for now

// Create Organization
router.post(
  '/create',
  header.checkHeader,
  token.verifyToken,
  organizationController.create
);

// List Organizations
router.get(
  '/list',
  header.checkHeader,
  token.verifyToken,
  organizationController.getAll
);

// Get Single Organization
router.get(
  '/get/:id',
  header.checkHeader,
  token.verifyToken,
  organizationController.getById
);

// Update Organization
router.put(
  '/update/:id',
  header.checkHeader,
  token.verifyToken,
  organizationController.update
);

// Delete Organization
router.delete(
  '/delete/:id',
  header.checkHeader,
  token.verifyToken,
  organizationController.remove
);

module.exports = router;
