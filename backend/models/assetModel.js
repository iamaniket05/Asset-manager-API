const pool = require('../config/db');

const AssetModel = {
  // Create new asset
  async createAsset(model, name, count, description) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.insert('assets', {
        model,
        name,
        count,
        description
      });
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  },

  // Get all assets
  async getAllAssets() {
    const qb = await pool.get_connection();
    try {
      const result = await qb.select('*').get('assets');
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  },

  // Get asset by ID
  async getAssetById(id) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.select('*').where({ id }).get('assets');
      qb.release();
      return result && result.length > 0 ? result[0] : null;
    } catch (err) {
      qb.release();
      throw err;
    }
  },

  // Update asset
  async updateAsset(id, model, name, count, description) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.update(
        'assets',
        { model, name, count, description },
        { id }
      );
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  },

  // Delete asset
  async deleteAsset(id) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.delete('assets', { id });
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  }
};

module.exports = AssetModel;
