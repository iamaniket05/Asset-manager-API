const DesignationModel = require('../models/designationModel');
const encrypt_decrypt = require('../utilities/encrypt_decrypt');
let response = require('../utilities/response');

const designationController = {
  // Create designation
  /*async create(req, res) {
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
  },*/

  async create(req, res) {
    try {
      const { name } = req.body;
 
      if (!name) {
        return res.status(400).json({ error: "name is required" });
      }
 
       const existing = await DesignationModel.findByName(name);
       
       if (existing) {
        return res.status(200).send(response.failed('Designation already exists'));
    }
 
      const result = await DesignationModel.createDesignation(name);
      return res.json({ success: true, message: "Designation created successfully", result });
    }  catch (error) {
      console.log(error);
      return res.status(500).send(response.failed(error.message));
  }
  },


  //  Get all designations (Encrypt IDs only for list)
  async getAll(req, res) {
    try {
      const result = await DesignationModel.getAllDesignations();

      // Encrypt only the ID before sending
      const encryptedResult = result.map(designation => ({
        id: encrypt_decrypt.encrypt(designation.id),
        name: designation.name,
        status: designation.status,
        created_at: designation.created_at
      }));

      return res.json({ success: true, data: encryptedResult });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Get designation by ID (no encryption/decryption here)
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
  /*async update(req, res) {
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
  },*/

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, status } = req.body;
 
      if (!name || !status) {
        return res.status(400).json({ error: "name and status are required" });
      }
      const existing = await DesignationModel.findByName(name);
      if (existing && existing.id != id) {
        return res.status(200).send(response.failed('Designation already exists'));
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
