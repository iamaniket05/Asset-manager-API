let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let moment = require('moment');
let AdminModel = require('../models/adminModel');
let response = require('../utilities/response');
const encrypt_decrypt = require('../utilities/encrypt_decrypt');

let adminController = {

    
    // Register new admin
    
    register: async (req, res) => {
        try {
            let {
                name,
                email,
                password,
                designation_id,
                department_id,
                country_code,
                phone_number
            } = req.body;

            if (!name || !email || !password) {
                return res.status(200).send(response.failed('Name, email, and password are required'));
            }

            // Check if email already exists
            let existing = await AdminModel.findAdminByEmail(email);
            if (existing) {
                return res.status(200).send(response.failed('Email already exists'));
            }

            let hashedPassword = bcrypt.hashSync(password, 10);
            let adminData = {
                name,
                email,
                password: hashedPassword,
                designation_id: designation_id || null,
                department_id: department_id || null,
                country_code: country_code || null,
                phone_number: phone_number || null,
                created_at: moment().format('YYYY-MM-DD H:m:s')
            };

            await AdminModel.createAdmin(adminData);
            return res.status(200).send(response.success('Admin registered successfully'));
        } catch (error) {
            console.log(error);
            return res.status(500).send(response.failed(error.message));
        }
    },


    
    // Login Admin
    
    login: async (req, res) => {
        try {
            let { email, password } = req.body;
            if (!email || !password) {
                return res.status(200).send(response.failed('Email and password are required'));
            }

            let user = await AdminModel.findAdminByEmail(email);
            if (!user) {
                return res.status(200).send(response.failed('Invalid credentials'));
            }

            let isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch) {
                return res.status(200).send(response.failed('Invalid credentials'));
            }

            let payload = {
                id: user.id,
                email: user.email,
                name: user.name,
                user: 'admin'
            };

            let token = jwt.sign(
                { data: payload },
                process.env.JWT_SECRET || 'secret123',
                { expiresIn: '1d' }
            );

            return res.status(200).send(response.successData({ token, name: user.name }, 'Login successful'));
        } catch (error) {
            console.log(error);
            return res.status(500).send(response.failed(error.message));
        }
    },


   
    // List all admins
 
   // Get all admins
getAllAdmins: async (req, res) => {

    try {
      const admins = await AdminModel.getAllAdmins();
      let admin_arr = [];
  
      for (let admin of admins) {
        admin_arr.push({
          id: encrypt_decrypt.encrypt(admin.id),
          name: admin.name,
          email: admin.email,
          designation_id: encrypt_decrypt.encrypt(admin.designation_id),
          designation_name: admin.designation_name,
          department_id: encrypt_decrypt.encrypt(admin.department_id),
          department_name: admin.department_name,
          country_code: admin.country_code,
          phone_number: admin.phone_number,
        });
      }
  
      res.status(200).send({
        success: true,
        message: "User list fetched successfully",
        data: admin_arr
      });
  
    } catch (err) {
      console.log(err);
      res.status(500).send({
        success: false,
        error: err.message
      });
    }
  },
  


    
    // Get admin by ID
   
    getAdminById: async (req, res) => {
        try {
            let id = req.params.id;
            let data = await AdminModel.getAdminById(id);
            if (!data) {
                return res.status(200).send(response.failed('Admin not found'));
            }
            return res.status(200).send(response.successData(data, 'Admin fetched successfully'));
        } catch (error) {
            console.log(error);
            return res.status(500).send(response.failed(error.message));
        }
    },


  
    // Update admin by ID
  
    update: async (req, res) => {
        try {
            let id = req.params.id;
            let {
                name,
                email,
                designation_id,
                department_id,
                country_code,
                phone_number
            } = req.body;

            let data = {};
            if (name) data.name = name;
            if (email) data.email = email;
            if (designation_id) data.designation_id = designation_id;
            if (department_id) data.department_id = department_id;
            if (country_code) data.country_code = country_code;
            if (phone_number) data.phone_number = phone_number;

            if (Object.keys(data).length === 0) {
                return res.status(200).send(response.failed('No valid fields to update'));
            }

            await AdminModel.updateAdmin(id, data);
            return res.status(200).send(response.success('Admin updated successfully'));
        } catch (error) {
            console.log(error);
            return res.status(500).send(response.failed(error.message));
        }
    },


  
    // Delete admin by ID
  
    delete: async (req, res) => {
        try {
            let id = req.params.id;
            await AdminModel.deleteAdmin(id);
            return res.status(200).send(response.success('Admin deleted successfully'));
        } catch (error) {
            console.log(error);
            return res.status(500).send(response.failed(error.message));
        }
    },

    



};



module.exports = adminController;
