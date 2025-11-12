const DepartmentModel = require('../models/departmentModel');
const encrypt_decrypt = require('../utilities/encrypt_decrypt');
let response = require('../utilities/response'); // 

const departmentController = {

  // ✅ Create department
  async create(req, res) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).send(response.failed("Name is required"));
      }

      const existing = await DepartmentModel.findByName(name);
      if (existing) {
        return res.status(200).send(response.failed("Department already exists"));
      }

      const result = await DepartmentModel.createDepartment(name);
      return res.status(201).send(response.successData(result, "Department created successfully"));
    } catch (error) {
      console.log(error);
      return res.status(500).send(response.failed(error.message));
    }
  },

  //  Get all departments (Encrypt IDs)
  async getAll(req, res) {
    try {
      const result = await DepartmentModel.getAllDepartments();

      // 📝 NOTE: Encrypt ID before sending
      const encryptedResult = result.map(department => ({
        id: encrypt_decrypt.encrypt(department.id),
        name: department.name,
        status: department.status,
        created_at: department.created_at
      }));

      return res.status(200).send(response.successData(encryptedResult, "Department list fetched successfully"));
    } catch (err) {
      return res.status(500).send(response.failed(err.message));
    }
  },

  //  Get department by ID
  async getById(req, res) {
    try {
      const encryptedId = req.params.id;
      const id = encrypt_decrypt.decrypt(encryptedId);
      const result = await DepartmentModel.getDepartmentById(id);

      if (!result) {
        return res.status(404).send(response.failed("Department not found"));
      }

      const responseData = {
        id: encryptedId,
        name: result.name,
        status: result.status,
      };

      return res.status(200).send(response.successData(responseData, "Department fetched successfully"));
    } catch (err) {
      return res.status(500).send(response.failed(err.message));
    }
  },

  //  Update department
  async update(req, res) {
    try {
      const encryptedId = req.params.id || req.body.id;
      const id = encrypt_decrypt.decrypt(encryptedId);
      const { name, status } = req.body;

      if (!name || !status) {
        return res.status(400).send(response.failed("Name and status are required"));
      }

      const existing = await DepartmentModel.findByName(name);
      if (existing && existing.id != id) {
        return res.status(200).send(response.failed("Department already exists"));
      }

      const result = await DepartmentModel.updateDepartment(id, name, status);
      return res.status(200).send(response.successData(result, "Department updated successfully"));
    } catch (err) {
      return res.status(500).send(response.failed(err.message));
    }
  },

  //  Delete department
  async remove(req, res) {
    try {
      const id = encrypt_decrypt.decrypt(req.params.id);
      const result = await DepartmentModel.deleteDepartment(id);

      return res.status(200).send(response.success("Department deleted successfully"));
    } catch (err) {
      return res.status(500).send(response.failed(err.message));
    }
  }
};

module.exports = departmentController;
