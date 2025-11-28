const pool = require('../config/db');

const OrganizationModel = {

  // Check if organization name exists
  async findByName(name) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.select('*').where({ name }).get('organizations');
      qb.release();
      return result.length > 0 ? result[0] : null;
    } catch (err) {
      qb.release();
      throw err;
    }
  },

  // Create Organization
  async createOrganization(data) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.insert('organizations', data);
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  },

  // Get All (DESC)
  async getAllOrganizations() {
    const qb = await pool.get_connection();
    try {
      const result = await qb
        .select('*')
        .from('organizations')
        .order_by('id', 'DESC')
        .get();
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  },

  // Get by ID
  async getOrganizationById(id) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.select('*').where({ id }).get('organizations');
      qb.release();
      return result.length ? result[0] : null;
    } catch (err) {
      qb.release();
      throw err;
    }
  },

  async updateOrganization(id, data) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.update('organizations', data, { id });
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  },

  // Delete
  async deleteOrganization(id) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.delete('organizations', { id });
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  }

};

module.exports = OrganizationModel;
