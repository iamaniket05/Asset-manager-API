const pool = require('../config/db');
 
const AssetCategoryModel = {
 
  async findByName(name) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.select('*').where({ name }).get('asset_categories');
      qb.release();
      return result && result.length > 0 ? result[0] : null;
    } catch (err) {
      qb.release();
      throw err;
    }
  },
 
  async create(name) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.insert('asset_categories', {
        name
       
      });
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  },
 
  async getFiltered(name, status) {
    const qb = await pool.get_connection();
    try {
        qb.select("*").from("asset_categories");

        if (name) qb.like("name", name);
        if (status !== "" && status !== undefined) qb.where("status", status);

        qb.order_by("id", "DESC");

        const result = await qb.get();
        qb.release();
        return result;
    } catch (err) {
        qb.release();
        throw err;
    }
},

  async getById(id) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.select('*').where({ id }).get('asset_categories');
      qb.release();
      return result && result.length > 0 ? result[0] : null;
    } catch (err) {
      qb.release();
      throw err;
    }
  },
 
  async update(id, name,status) {
    const qb = await pool.get_connection();
    try {
      const result = await qb
        .update('asset_categories', { name,status }, { id });
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  },
 
  async delete(id) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.delete('asset_categories', { id });
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  }
};
 
module.exports = AssetCategoryModel;