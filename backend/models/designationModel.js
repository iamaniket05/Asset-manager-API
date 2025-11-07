const pool = require('../config/db');

const DesignationModel = {
  // Create new designation
  async createDesignation(name) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.insert('designations', {
        name
      });
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  },

  // Get all designations
  async getAllDesignations() {
    const qb = await pool.get_connection();
    try {
      const result = await qb.select('*').get('designations');
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  },

  // Get designation by ID
  async getDesignationById(id) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.select('*').where({ id }).get('designations');
      qb.release();
      return result && result.length > 0 ? result[0] : null;
    } catch (err) {
      qb.release();
      throw err;
    }
  },

  // Update designation by ID
  async updateDesignation(id, name, status) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.update(
        'designations',
        { name, status },
        { id }
      );
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  },

  // Delete designation by ID
  async deleteDesignation(id) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.delete('designations', { id });
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  }
};

module.exports = DesignationModel;
