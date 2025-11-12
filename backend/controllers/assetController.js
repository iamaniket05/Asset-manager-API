const AssetModel = require('../models/assetModel');
const encrypt_decrypt = require('../utilities/encrypt_decrypt');
 
const assetController = {
  // Create asset
  async create(req, res) {
    try {
      const { model, name, count, description } = req.body;
 
      if (!model || !name || !count || !description) {
        return res.status(400).json({ error: "All fields are required (model, name, count, description)" });
      }
 
      const result = await AssetModel.createAsset(model, name, count, description);
      return res.json({ success: true, message: "Asset created successfully", result });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
 
  // Get all assets
  async getAll(req, res) {
    try {
      const result = await AssetModel.getAllAssets();
      const encryptedResult = result.map(asset => ({
        id: encrypt_decrypt.encrypt(asset.id),
        name: asset.name,
        model: asset.model,
        count:asset.count,
        description:asset.description,
      }));
      //console.log(encryptedResult);
     
      return res.json({ success: true, data: encryptedResult });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
 
  // Get asset by ID
  async getById(req, res) {
    try {
      const encryptedId = req.params.id;
      const id = encrypt_decrypt.decrypt(encryptedId);
      const asset = await AssetModel.getAssetById(id);
      const responseData = {
        id: encryptedId,
        name: asset.name,
        model: asset.model,
        count:asset.count,
        description:asset.description,
    };
    //console.log(responseData);
      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }
 
      return res.json({ success: true, data: responseData });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
 
  // Update asset
  async update(req, res) {
    try {
      const id = encrypt_decrypt.decrypt(req.params.id);
      const { model, name, count, description } = req.body;
 
      if (!model || !name || !count || !description) {
        return res.status(400).json({ error: "All fields are required" });
      }
 
      const result = await AssetModel.updateAsset(id, model, name, count, description);
      return res.json({ success: true, message: "Asset updated successfully", result });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
 
  // Delete asset
  async remove(req, res) {
    try {
      const id = encrypt_decrypt.decrypt(req.params.id);
      const result = await AssetModel.deleteAsset(id);
 
      return res.json({ success: true, message: "Asset deleted successfully", result });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
 
module.exports = assetController;