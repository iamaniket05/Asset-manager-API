// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());


// IMPORTANT: do NOT parse multipart form
app.use((req, res, next) => {
  if (req.headers['content-type'] &&
      req.headers['content-type'].includes('multipart/form-data')) {
      return next(); // let multer handle it
  }
  bodyParser.json()(req, res, () => {
      bodyParser.urlencoded({ extended: true })(req, res, next);
  });
});

// Static files
app.use("/uploads", express.static("uploads"));

// ------------------------------
// ROUTES
// ------------------------------
const adminRoutes = require('./routes/admin_routes');
const departmentRoutes = require('./routes/department_routes');
const designationRoutes = require('./routes/designation_routes');
const assetRoutes = require('./routes/asset_routes');
const organizationRoutes = require('./routes/organization_routes');
const employeeRoutes = require('./routes/employee_routes');
const assetcategoryRoutes = require('./routes/assetcategory_routes');
const supplierRoutes = require('./routes/supplier_routes');

const assetRequestRoutes = require('./routes/assetRequestRoutes');

const assetAssignmentRoutes = require('./routes/assetassignment_routes');


// API Prefixes
app.use('/api/admin', adminRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/designation', designationRoutes);
app.use('/api/asset', assetRoutes);
app.use('/api/organization', organizationRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/assetcategory', assetcategoryRoutes);
app.use('/api/supplier', supplierRoutes);

app.use('/api/assetrequest', assetRequestRoutes);

app.use('/api/asset-assignment', assetAssignmentRoutes);


// Export
module.exports = app;
