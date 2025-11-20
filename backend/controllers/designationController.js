const DesignationModel = require('../models/designationModel');
const encrypt_decrypt = require('../utilities/encrypt_decrypt');
let response = require('../utilities/response'); // 📝 NOTE: Added import for consistent response handling

const designationController = {

  //  Create designation
  async create(req, res) {
    try {
      const { name } = req.body;

      if (!name) {
        // 📝 NOTE: Using response.failed() for validation errors
        return res.status(400).send(response.failed("Name is required"));
      }

      const existing = await DesignationModel.findByName(name);

      if (existing) {
        return res.status(200).send(response.failed("Designation already exists"));
      }

      const result = await DesignationModel.createDesignation(name);
      // 📝 NOTE: Using standardized success response
      return res.status(201).send(response.successData(result, "Designation created successfully"));
    } catch (error) {
      console.log(error);
      return res.status(500).send(response.failed(error.message));
    }
  },

  //  Get all designations (Encrypt IDs)
  async getAll(req, res) {
    try {
      const result = await DesignationModel.getAllDesignations();

      // 📝 NOTE: Encrypt only the ID before sending
      const encryptedResult = result.map(designation => ({
        id: encrypt_decrypt.encrypt(designation.id),
        name: designation.name,
        status: designation.status,
        created_at: designation.created_at
      }));

      // 📝 NOTE: Standardized successData response
      return res.status(200).send(response.successData(encryptedResult, "Designation list fetched successfully"));
    } catch (err) {
      return res.status(500).send(response.failed(err.message));
    }
  },

  //  Get designation by ID
  async getById(req, res) {
    try {
      const encryptedId = req.params.id;
      const id = encrypt_decrypt.decrypt(encryptedId);
      const result = await DesignationModel.getDesignationById(id);

      if (!result) {
        return res.status(404).send(response.failed("Designation not found"));
      }

      const responseData = {
        id: encryptedId,
        name: result.name,
        status: result.status,
      };

      return res.status(200).send(response.successData(responseData, "Designation fetched successfully"));
    } catch (err) {
      return res.status(500).send(response.failed(err.message));
    }
  },

  //  Update designation
  async update(req, res) {
    try {
      const encryptedId = req.params.id || req.body.id;
      const id = encrypt_decrypt.decrypt(encryptedId);
      const { name, status } = req.body;

      if (!name) {
        return res.status(400).send(response.failed("Name is required"));
      }

      const existing = await DesignationModel.findByName(name);
      if (existing && existing.id != id) {
        return res.status(200).send(response.failed("Designation already exists"));
      }

      const result = await DesignationModel.updateDesignation(id, name, status);
      return res.status(200).send(response.successData(result, "Designation updated successfully"));
    } catch (err) {
      return res.status(500).send(response.failed(err.message));
    }
  },

  //  Delete designation
  async remove(req, res) {
    try {
      const id = encrypt_decrypt.decrypt(req.params.id);
      const result = await DesignationModel.deleteDesignation(id);

      return res.status(200).send(response.success("Designation deleted successfully"));
    } catch (err) {
      return res.status(500).send(response.failed(err.message));
    }
  }
};

module.exports = designationController;
