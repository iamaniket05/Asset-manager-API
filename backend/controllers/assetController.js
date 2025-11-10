const AssetModel = require('../models/assetModel');

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
      return res.json({ success: true, data: result });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Get asset by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const result = await AssetModel.getAssetById(id);

      if (!result) {
        return res.status(404).json({ error: "Asset not found" });
      }

      return res.json({ success: true, data: result });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Update asset
  async update(req, res) {
    try {
      const { id } = req.params;
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
      const { id } = req.params;
      const result = await AssetModel.deleteAsset(id);

      return res.json({ success: true, message: "Asset deleted successfully", result });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

module.exports = assetController;
