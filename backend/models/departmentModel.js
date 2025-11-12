const pool = require('../config/db');
 
const DepartmentModel = {
 
  async findByName(name) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.select('*').where({ name }).get('departments');
      qb.release();
      return result && result.length > 0 ? result[0] : null;
    } catch (err) {
      qb.release();
      throw err;
    }
  },
 
  // Create new department
  async createDepartment(name) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.insert('departments', {
        name
       
      });
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  },
 
  // Get all departments
async getAllDepartments() {
  const qb = await pool.get_connection();
  try {
    const result = await qb
      .select('*')
      .from('departments')
      .order_by('id', 'DESC')
      .get();
 
    qb.release();
    return result;
  } catch (err) {
    qb.release();
    throw err;
  }
},
 
  // Get department by ID
  async getDepartmentById(id) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.select('*').where({ id }).get('departments');
      qb.release();
      return result && result.length > 0 ? result[0] : null;
    } catch (err) {
      qb.release();
      throw err;
    }
  },
 
  // Update department by ID
  async updateDepartment(id, name) {
    const qb = await pool.get_connection();
    try {
      const result = await qb
        .update('departments', { name }, { id });
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  },
 
  // Delete department by ID
  async deleteDepartment(id) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.delete('departments', { id });
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  }
};
 
module.exports = DepartmentModel;