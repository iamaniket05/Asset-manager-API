const pool = require('../config/db');

const AssetModel = {
  async createAsset(data) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.insert('assets', data);
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  },
  

  getAllAssets: async (filters = {}) => {
    const qb = await pool.get_connection();
  
    try {
      qb.select(
        'a.id, a.model, a.name, a.count, a.price, a.description,' +
        'c.name AS category_name, s.supplier_name AS supplier_name'
      )
      .from('assets AS a')
      .join('asset_categories AS c', 'c.id = a.assetcategory_id', 'left')
      .join('asset_suppliers AS s', 's.id = a.assetsupplier_id', 'left');
  
      if (filters.model) qb.like('a.model', filters.model);
      if (filters.name) qb.like('a.name', filters.name);
      if (filters.count) qb.where('a.count', filters.count);
      if (filters.price) qb.where('a.price', filters.price);
      if (filters.category_id) qb.where('a.assetcategory_id', filters.category_id);
      if (filters.supplier_id) qb.where('a.assetsupplier_id', filters.supplier_id);
  
      return await qb.get();
  
    } finally {
      qb.release();
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

  async updateAsset(id, data) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.update('assets', data, { id });
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
