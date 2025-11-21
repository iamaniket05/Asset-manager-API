const pool = require('../config/db');
 
const SupplierModel = {
 
  async findBySupplierName(supplier_name) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.select('*').where({ supplier_name }).get('asset_suppliers');
      qb.release();
      return result && result.length > 0 ? result[0] : null;
    } catch (err) {
      qb.release();
      throw err;
    }
  },
 
  async createSupplier(data) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.insert('asset_suppliers', data);
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  },
 
  async getAllSuppliers() {
    const qb = await pool.get_connection();
    try {
      const result = await qb
        .select('*')
        .from('asset_suppliers')
        .order_by('id', 'DESC')
        .get();
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  },
 
  async getSupplierById(id) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.select('*').where({ id }).get('asset_suppliers');
      qb.release();
      return result && result.length > 0 ? result[0] : null;
    } catch (err) {
      qb.release();
      throw err;
    }
  },
 
  async updateSupplier(id, data) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.update('asset_suppliers', data, { id });
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  },
 
  async deleteSupplier(id) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.delete('asset_suppliers', { id });
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  },
 
};
 
module.exports = SupplierModel;
 
 