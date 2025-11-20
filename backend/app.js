const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());

app.use((req, res, next) => {
  if (req.method === "GET") return next();
  bodyParser.json()(req, res, next);
});

app.use(bodyParser.urlencoded({ extended: true }));

const adminRoutes = require('./routes/admin_routes');
const departmentRoutes = require('./routes/department_routes');
const designationRoutes = require('./routes/designation_routes');
const assetRoutes = require('./routes/asset_routes');

const organizationRoutes = require('./routes/organization_routes');

const employeeRoutes = require('./routes/employee_routes');

const assetcategoryRoutes = require('./routes/assetcategory_routes');

const supplierRoutes = require('./routes/supplier_routes');


app.use('/api/admin', adminRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/designation', designationRoutes);
app.use('/api/asset', assetRoutes);
app.use('/api/organization', organizationRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/assetcategory', assetcategoryRoutes);

app.use('/api/supplier', supplierRoutes);


module.exports = app;