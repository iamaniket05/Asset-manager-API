const DesignationModel = require('../models/designationModel');

const designationController = {
  // Create designation
  async create(req, res) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ error: "name is required" });
      }

      const result = await DesignationModel.createDesignation(name);
      return res.json({ success: true, message: "Designation created successfully", result });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Get all designations
  async getAll(req, res) {
    try {
      const result = await DesignationModel.getAllDesignations();
      return res.json({ success: true, data: result });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Get designation by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const result = await DesignationModel.getDesignationById(id);

      if (!result) {
        return res.status(404).json({ error: "Designation not found" });
      }

      return res.json({ success: true, data: result });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Update designation
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, status } = req.body;

      if (!name || !status) {
        return res.status(400).json({ error: "name and status are required" });
      }

      const result = await DesignationModel.updateDesignation(id, name, status);
      return res.json({ success: true, message: "Designation updated successfully", result });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Delete designation
  async remove(req, res) {
    try {
      const { id } = req.params;
      const result = await DesignationModel.deleteDesignation(id);

      return res.json({ success: true, message: "Designation deleted successfully", result });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

module.exports = designationController;
