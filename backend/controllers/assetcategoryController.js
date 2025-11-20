const AssetCategoryModel = require('../models/assetcategoryModel');
const encrypt_decrypt = require('../utilities/encrypt_decrypt');
let response = require('../utilities/response'); // 

const assetcategoryController = {

  async create(req, res) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).send(response.failed("Name is required"));
      }

      const existing = await AssetCategoryModel.findByName(name);
      if (existing) {
        return res.status(200).send(response.failed("AssetCategory already exists"));
      }

      const result = await AssetCategoryModel.create(name);
      return res.status(201).send(response.successData(result, "AssetCategory created successfully"));
    } catch (error) {
      console.log(error);
      return res.status(500).send(response.failed(error.message));
    }
  },

  async getAll(req, res) {
    try {
        const { name, status } = req.query;

        const result = await AssetCategoryModel.getFiltered(name, status);

        const encryptedResult = result.map(dept => ({
            id: encrypt_decrypt.encrypt(dept.id),
            name: dept.name,
            status: dept.status
        }));

        return res.status(200).send(response.successData(encryptedResult, "AssetCategory list fetched"));
    } catch (err) {
        return res.status(500).send(response.failed(err.message));
    }
},


  //  Get department by ID
  async getById(req, res) {
    try {
      const encryptedId = req.params.id;
      const id = encrypt_decrypt.decrypt(encryptedId);
      const result = await AssetCategoryModel.getById(id);

      if (!result) {
        return res.status(404).send(response.failed("AssetCategory not found"));
      }

      const responseData = {
        id: encryptedId,
        name: result.name,
        status: result.status,
      };

      return res.status(200).send(response.successData(responseData, "AssetCategory fetched successfully"));
    } catch (err) {
      return res.status(500).send(response.failed(err.message));
    }
  },

  async update(req, res) {
    try {
      const encryptedId = req.params.id || req.body.id;
      const id = encrypt_decrypt.decrypt(encryptedId);
      const { name, status } = req.body;

      if (!name) {
        return res.status(200).send(response.failed("Name is required"));
      }

      const existing = await AssetCategoryModel.findByName(name);
      if (existing && existing.id != id) {
        return res.status(200).send(response.failed("AssetCategory already exists"));
      }

      const result = await AssetCategoryModel.update(id, name, status);
      return res.status(200).send(response.successData(result, "AssetCategory updated successfully"));
    } catch (err) {
      return res.status(500).send(response.failed(err.message));
    }
  },

  //  Delete department
  async remove(req, res) {
    try {
      const id = encrypt_decrypt.decrypt(req.params.id);
      const result = await AssetCategoryModel.delete(id);

      return res.status(200).send(response.success("AssetCategory deleted successfully"));
    } catch (err) {
      return res.status(500).send(response.failed(err.message));
    }
  }
};

module.exports = assetcategoryController;
