let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let moment = require('moment');
let EmployeeModel = require('../models/employeeModel');
let response = require('../utilities/response');
const encrypt_decrypt = require('../utilities/encrypt_decrypt');
 
let employeeController = {
 
   
    create: async (req, res) => {
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
   
            let existing = await EmployeeModel.findByEmail(email);
            if (existing) {
                return res.status(200).send(response.failed('Email already exists'));
            }
   
            if (designation_id) designation_id = encrypt_decrypt.decrypt(designation_id);
            if (department_id) department_id = encrypt_decrypt.decrypt(department_id);
   
            let hashedPassword = bcrypt.hashSync(password, 10);
            let data = {
                name,
                email,
                password: hashedPassword,
                designation_id: designation_id || null,
                department_id: department_id || null,
                country_code: country_code || null,
                phone_number: phone_number || null,
                created_at: moment().format('YYYY-MM-DD H:m:s')
            };
   
            await EmployeeModel.create(data);
            return res.status(200).send(response.success('Employee Created successfully'));
        } catch (error) {
            console.log(error);
            return res.status(500).send(response.failed(error.message));
        }
    },
 
    login: async (req, res) => {
        try {
            let { email, password } = req.body;
            if (!email || !password) {
                return res.status(200).send(response.failed('Email and password are required'));
            }
 
            let user = await EmployeeModel.findByEmail(email);
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
                user: 'employee'
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
 
 
   
    getAll: async (req, res) => {
        
        try {
          const { name, email, department_id, designation_id } = req.query;
      
          const admins = await EmployeeModel.getAll({
            name,
            email,
            department_id: department_id ? encrypt_decrypt.decrypt(department_id) : null,
            designation_id: designation_id ? encrypt_decrypt.decrypt(designation_id) : null,
          });
      
          let admin_arr = [];
      
          admins.forEach(admin => {
            admin_arr.push({
              id: encrypt_decrypt.encrypt(admin.id),
              name: admin.name,
              email: admin.email,
              department_name: admin.department_name,
              designation_name: admin.designation_name,
              country_code: admin.country_code,
              phone_number: admin.phone_number
            });
          });
      
          res.status(200).send({
            success: true,
            message: "User list fetched successfully",
            data: admin_arr
          });
      
        } catch (err) {
          res.status(500).send({
            success: false,
            error: err.message
          });
        }
      },
      
   
  getById: async (req, res) => {
    try {
        const encryptedId = req.params.id;
        const id = encrypt_decrypt.decrypt(encryptedId);
 
        const admin = await EmployeeModel.getById(id);
 
        if (!admin) {
            return res.status(404).send({
                success: false,
                message: 'Employee not found'
            });
        }
 
        // Only return encrypted IDs for department and designation
        const responseData = {
            id: encryptedId,
            name: admin.name,
            email: admin.email,
            phone_number: admin.phone_number,
            country_code: admin.country_code,
        
            encrypted_designation_id: admin.designation_id
                ? encrypt_decrypt.encrypt(admin.designation_id)
                : null,
        
            encrypted_department_id: admin.department_id
                ? encrypt_decrypt.encrypt(admin.department_id)
                : null
        };
        
 
        return res.status(200).send({
            success: true,
            message: 'Employee fetched successfully',
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

        let id = encrypt_decrypt.decrypt(encryptedId);

        let {
            name,
            email,
            designation_id: encDesignation,
            department_id: encDepartment,
            country_code,
            phone_number
        } = req.body;

        //  Decrypt designation and department IDs (if sent)
        const designation_id = encDesignation ? encrypt_decrypt.decrypt(encDesignation) : null;
        const department_id = encDepartment ? encrypt_decrypt.decrypt(encDepartment) : null;

        // Prepare update data
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

        const updateResult = await EmployeeModel.update(id, data);

        if (!updateResult || updateResult.affectedRows === 0) {
            return res.status(404).send(response.failed("Employee not found"));
        }

        return res.status(200).send(response.success("Employee updated successfully"));

    } catch (error) {
        console.log(error);
        return res.status(500).send(response.failed(error.message));
    }
},
 
    delete: async (req, res) => {
        try {
 
            const id = encrypt_decrypt.decrypt(req.params.id);
            await EmployeeModel.delete(id);
            return res.status(200).send(response.success('Employee deleted successfully'));
        } catch (error) {
            console.log(error);
            return res.status(500).send(response.failed(error.message));
        }
    },
 
};
 
 
 
module.exports = employeeController;