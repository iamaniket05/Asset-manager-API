const pool = require('../config/db');
 
const AdminModel = {
  async createAdmin(data) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.insert('users', {
        name: data.name,
        email: data.email,
        password: data.password,
        designation_id: data.designation_id || null,
        department_id: data.department_id || null,
        country_code: data.country_code || null,
        phone_number: data.phone_number || null,
      });
 
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  },
 
  async findAdminByEmail(email) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.select('*').where({ email }).get('users');
      qb.release();
      return result && result.length > 0 ? result[0] : null;
    } catch (err) {
      qb.release();
      throw err;
    }
  },
 
  /*async getAllAdmins() {
    const qb = await pool.get_connection();
    try {
      const result = await qb.select('*').get('users');
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  },*/
 
  async getAllAdmins() {
    const qb = await pool.get_connection();
   
    try {
      // Select columns
      qb.select(
        'u.id, u.name, u.email, u.designation_id, d.name AS designation_name, ' +
        'u.department_id, dep.name AS department_name, ' +
        'u.country_code, u.phone_number'
      );
   
      // From main table
      qb.from('users u');
   
      // Left joins
      qb.join('designations d', 'u.designation_id = d.id', 'left');
      qb.join('departments dep', 'u.department_id = dep.id', 'left');

      qb.order_by('u.id', 'DESC');
   
      // Execute the query
      const result = await qb.get();
   
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  },
 
  async getAdminById(id) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.select('*').where({ id }).get('users');
      qb.release();
      return result && result.length > 0 ? result[0] : null;
    } catch (err) {
      qb.release();
      throw err;
    }
  },
 
  async updateAdmin(id, data) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.update('users', data, { id });
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  },
 
  async deleteAdmin(id) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.delete('users', { id });
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  }
};
 
module.exports = AdminModel;