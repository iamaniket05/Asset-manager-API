let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let moment = require('moment');
let AdminModel = require('../models/adminModel');
let response = require('../utilities/response');
const encrypt_decrypt = require('../utilities/encrypt_decrypt');
 
let adminController = {
 
   
    register: async (req, res) => {
        try {
            let {
                name,
                email,
                password,
                designation_id, // encrypted
                department_id,  // encrypted
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
   
            // 🔹 Decrypt designation_id and department_id
            if (designation_id) designation_id = encrypt_decrypt.decrypt(designation_id);
            if (department_id) department_id = encrypt_decrypt.decrypt(department_id);
   
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
            //console.log(error);
            return res.status(500).send(response.failed(error.message));
        }
    },
 
 
   
    getAllAdmins: async (req, res) => {
 
        try {
          const admins = await AdminModel.getAllAdmins();
          let admin_arr = [];
     
          for (let admin of admins) {
            admin_arr.push({
              id: encrypt_decrypt.encrypt(admin.id),
              name: admin.name,
              email: admin.email,
              designation_id: admin.designation_id ? encrypt_decrypt.encrypt(admin.designation_id) : null,
              designation_name: admin.designation_name,
              department_id: admin.department_id ? encrypt_decrypt.encrypt(admin.department_id) : null,
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
   
  getAdminById: async (req, res) => {
    try {
        const encryptedId = req.params.id;
        const id = encrypt_decrypt.decrypt(encryptedId);
 
        // Fetch the admin record
        const admin = await AdminModel.getAdminById(id);
 
        if (!admin) {
            return res.status(404).send({
                success: false,
                message: 'Admin not found'
            });
        }
 
        // Only return encrypted IDs for department and designation
        const responseData = {
            id: encryptedId, // keep admin ID encrypted
            name: admin.name,
            email: admin.email,
            phone_number: admin.phone_number,
            country_code: admin.country_code,
            encrypted_designation_id: encrypt_decrypt.encrypt(admin.designation_id),
            encrypted_department_id: encrypt_decrypt.encrypt(admin.department_id)
        };
 
        return res.status(200).send({
            success: true,
            message: 'Admin fetched successfully',
            data: responseData
        });
 
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
},
 
update: async (req, res) => {
    try {
        let encryptedId = req.params.id;
        // 1️⃣ Decrypt the admin ID
        let id = encrypt_decrypt.decrypt(encryptedId);
 
        let {
            name,
            email,
            designation_id: encDesignation,
            department_id: encDepartment,
            country_code,
            phone_number
        } = req.body;
 
        // 2️⃣ Decrypt the designation and department IDs
        const designation_id = encDesignation ? encrypt_decrypt.decrypt(encDesignation) : null;
        const department_id = encDepartment ? encrypt_decrypt.decrypt(encDepartment) : null;
 
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
 
        return res.status(200).send(response.success('User updated successfully'));
    } catch (error) {
        console.log(error);
        return res.status(500).send(response.failed(error.message));
    }
}  ,
 
    // Delete admin by ID
 
    delete: async (req, res) => {
        try {
 
            const id = encrypt_decrypt.decrypt(req.params.id);
            await AdminModel.deleteAdmin(id);
            return res.status(200).send(response.success('Admin deleted successfully'));
        } catch (error) {
            console.log(error);
            return res.status(500).send(response.failed(error.message));
        }
    },
 
   
 
 
 
};
 
 
 
module.exports = adminController;