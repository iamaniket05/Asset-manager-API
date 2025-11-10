const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminModel = require('../models/adminModel');
 
let adminController = {
  register: async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        designation_id,
        department_id,
        country_code,
        phone_number
      } = req.body;
 
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required.' });
      }
 
      const hashedPassword = bcrypt.hashSync(password, 10);
      const result = await AdminModel.createAdmin({
        name,
        email,
        password: hashedPassword,
        designation_id,
        department_id,
        country_code,
        phone_number
      });
 
      res.json({ success: true, message: 'User registered successfully', result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
 
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await AdminModel.findAdminByEmail(email);
 
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
 
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
 
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || "secret123",
        { expiresIn: '1d' }
      );
 
      return res.json({ success: true, token });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
 
  getAllAdmins: async (req, res) => {
    try {
      const admins = await AdminModel.getAllAdmins();
      res.json({ success: true, data: admins });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
 
  getAdminById: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await AdminModel.getAdminById(id);
      if (!data) return res.status(404).json({ success: false, message: 'User not found' });
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
 
  /*updateAdmin: async (req, res) => {
    try {
      const id = req.params.id;
      const data = req.body;
      await AdminModel.updateAdmin(id, data);
      res.json({ success: true, message: 'Admin updated successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },*/
 
  updateAdmin: async (req, res) => {
    try {
      const id = req.params.id;
      const {
        name,
        email,
        designation_id,
        department_id,
        country_code,
        phone_number
      } = req.body;
 
      // Build update data safely (check for undefined, not falsy)
      const data = {};
      if (name !== undefined) data.name = name;
      if (email !== undefined) data.email = email;
      if (designation_id !== undefined) data.designation_id = designation_id;
      if (department_id !== undefined) data.department_id = department_id;
      if (country_code !== undefined) data.country_code = country_code;
      if (phone_number !== undefined) data.phone_number = phone_number;
 
      if (Object.keys(data).length === 0) {
        return res.status(400).json({ success: false, message: 'No valid fields to update' });
      }
 
      await AdminModel.updateAdmin(id, data);
      res.json({ success: true, message: 'User updated successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
 
 
 
  deleteAdmin: async (req, res) => {
    try {
      const id = req.params.id;
      await AdminModel.deleteAdmin(id);
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};
 
module.exports = adminController;
 