const AssetModel = require('../models/assetModel');
const encrypt_decrypt = require('../utilities/encrypt_decrypt');
let response = require('../utilities/response');
const assetController = {
  async create(req, res) {
    try {
      let {
        model,
        name,
        count,
        description,
        asset_categoryid,
        asset_supplierid,
        price
      } = req.body;
  
      // Validation
      if (!model || !name || !count) {
        return res.status(200).send(response.failed("Model, name and count are required"));
      }
  
      // 🔹 Decrypt category & supplier IDs (if provided)
      const decryptedCategoryId = asset_categoryid ? encrypt_decrypt.decrypt(asset_categoryid) : null;
      const decryptedSupplierId = asset_supplierid ? encrypt_decrypt.decrypt(asset_supplierid) : null;
  
      const data = {
        model,
        name,
        count,
        description,
        assetcategory_id: decryptedCategoryId,
        assetsupplier_id: decryptedSupplierId,
        price: price || null
      };
      console.log(data);
  
      await AssetModel.createAsset(data);
  
      return res.status(200).send(response.success("Asset created successfully"));
    } catch (err) {
      return res.status(500).send(response.failed(err.message));
    }
  },
  
  async getAll(req, res) {
    try {
  
      const { model, name, count, price, category_id, supplier_id } = req.query;
      const assets = await AssetModel.getAllAssets({
        model: model || null,
        name: name || null,
        count: count || null,
        price: price || null,
        category_id: category_id ? encrypt_decrypt.decrypt(category_id) : null,
        supplier_id: supplier_id ? encrypt_decrypt.decrypt(supplier_id) : null
      });
      let asset_arr = [];
  
      assets.forEach(asset => {
        asset_arr.push({
          id: encrypt_decrypt.encrypt(asset.id),
          model: asset.model,
          name: asset.name,
          count: asset.count,
          price: asset.price,
          description: asset.description,
          category_name: asset.category_name,
          supplier_name: asset.supplier_name
        });
      });
  
      return res.status(200).send({
        success: true,
        message: "Asset list fetched successfully",
        data: asset_arr
      });
  
    } catch (err) {
      return res.status(500).send({
        success: false,
        error: err.message
      });
    }
  },
 
 async getById(req, res) {
  try {
    const encryptedId = req.params.id;
    const id = encrypt_decrypt.decrypt(encryptedId);
    const asset = await AssetModel.getAssetById(id);

    if (!asset) {
      return res.status(404).send(response.failed("Asset not found"));
    }

    const data = {
      id: encryptedId,
      name: asset.name,
      model: asset.model,
      count: asset.count,
      description: asset.description,
      category_id: asset.assetcategory_id
        ? encrypt_decrypt.encrypt(asset.assetcategory_id)
        : null,

      supplier_id: asset.assetsupplier_id
        ? encrypt_decrypt.encrypt(asset.assetsupplier_id)
        : null,

      price: asset.price
    };
    return res.status(200).send(
      response.successData(data, "Asset fetched successfully")
    );
  } catch (err) {
    return res.status(500).send(response.failed(err.message));
  }
},
 
async update(req, res) {
  try {
    let encryptedId = req.params.id;
    const id = encrypt_decrypt.decrypt(encryptedId);

    let {
      model,
      name,
      count,
      description,
      asset_categoryid,
      asset_supplierid,
      price
    } = req.body;

    const decryptedCategoryId = asset_categoryid ? encrypt_decrypt.decrypt(asset_categoryid) : null;
    const decryptedSupplierId = asset_supplierid ? encrypt_decrypt.decrypt(asset_supplierid) : null;

    let data = {};
    if (model) data.model = model;
    if (name) data.name = name;
    if (count) data.count = count;
    if (description) data.description = description;
    if (asset_categoryid) data.assetcategory_id = decryptedCategoryId;
    if (asset_supplierid) data.assetsupplier_id = decryptedSupplierId;
    if (price) data.price = price;

    if (Object.keys(data).length === 0) {
      return res.status(200).send(response.failed("No valid fields to update"));
    }

    // 🔹 NEW IMPORTANT LOGIC
    if (count) {
      const existingAsset = await AssetModel.getAssetById(id);
      const assigned = existingAsset.assigned_assets || 0;
      data.remaining_assets = count - assigned;
    }

    const result = await AssetModel.updateAsset(id, data);
    if (!result || result.affectedRows === 0) {
      return res.status(404).send(response.failed("Asset not found"));
    }

    return res.status(200).send(response.success("Asset updated successfully"));
  } catch (err) {
    return res.status(500).send(response.failed(err.message));
  }
},

  
  async remove(req, res) {
    try {
      const id = encrypt_decrypt.decrypt(req.params.id);
 
      const result = await AssetModel.deleteAsset(id);
 
      if (!result || result.affectedRows === 0) {
        return res.status(404).send(response.failed("Asset not found"));
      }
 
      return res.status(200).send(response.success("Asset deleted successfully"));
    } catch (err) {
      return res.status(500).send(response.failed(err.message));
    }
  }
 
};
 
module.exports = assetController;