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


// register routes
app.use('/api/admin', adminRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/designation', designationRoutes);



module.exports = app;