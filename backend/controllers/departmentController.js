const DepartmentModel = require('../models/departmentModel');

const departmentController = {
  // Create department
  async create(req, res) {
    try {
      const {name } = req.body;

      if (!name) {
        return res.status(400).json({ error: "name is required" });
      }

      const result = await DepartmentModel.createDepartment(name);
      return res.json({ success: true, message: "Department created successfully", result });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Get all departments
  async getAll(req, res) {
    try {
      const result = await DepartmentModel.getAllDepartments();
      return res.json({ success: true, data: result });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Get department by ID
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
      const { department_name, status } = req.body;

      if (!department_name || !status) {
        return res.status(400).json({ error: "department_name and status are required" });
      }

      const result = await DepartmentModel.updateDepartment(id, department_name, status);
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
