const DepartmentModel = require('../models/departmentModel');
const encrypt_decrypt = require('../utilities/encrypt_decrypt');

const departmentController = {
  // Create department
  /*async create(req, res) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ error: "name is required" });
      }

      const result = await DepartmentModel.createDepartment(name);
      return res.json({ success: true, message: "Department created successfully", result });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },*/

  async create(req, res) {
    try {
      const { name } = req.body;
 
      if (!name) {
        return res.status(400).json({ error: "name is required" });
      }
 
       const existing = await DepartmentModel.findByName(name);
       
       if (existing) {
        return res.status(200).send(response.failed('Department already exists'));
    }
 
      const result = await DepartmentModel.createDepartment(name);
      return res.json({ success: true, message: "Department created successfully", result });
    }  catch (error) {
      console.log(error);
      return res.status(500).send(response.failed(error.message));
  }
  },
  

  //  Get all departments (Encrypt IDs only for list API)
  async getAll(req, res) {
    try {
      const result = await DepartmentModel.getAllDepartments();

      // Encrypt the ID for each record before sending
      const encryptedResult = result.map(department => ({
        id: encrypt_decrypt.encrypt(department.id),
        name: department.name,
        status: department.status,
        created_at: department.created_at
      }));

      return res.json({ success: true, data: encryptedResult });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Get department by ID (no encryption/decryption)
  async getById(req, res) {
    try {
      const { id } = req.params;
      const result = await DepartmentModel.getDepartmentById(id);

      if (!result) {
        return res.status(404).json({ error: "Department not found" });
      }

      return res.json({ success: true, data: result });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Update department
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, status } = req.body;

      if (!name || !status) {
        return res.status(400).json({ error: "name and status are required" });
      }

      const existing = await DepartmentModel.findByName(name);
      if (existing && existing.id != id) {
        return res.status(200).send(response.failed('Department already exists'));
      }

      const result = await DepartmentModel.updateDepartment(id, name, status);
      return res.json({ success: true, message: "Department updated successfully", result });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Delete department
  async remove(req, res) {
    try {
      const { id } = req.params;
      const result = await DepartmentModel.deleteDepartment(id);

      return res.json({ success: true, message: "Department deleted successfully", result });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

module.exports = departmentController;
