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
 
  // async getAllAdmins() {
  //   const qb = await pool.get_connection();
   
  //   try {
  //     // Select columns
  //     qb.select(
  //       'u.id, u.name, u.email, u.designation_id, d.name AS designation_name, ' +
  //       'u.department_id, dep.name AS department_name, ' +
  //       'u.country_code, u.phone_number'
  //     );
   
  //     // From main table
  //     qb.from('users u');
   
  //     // Left joins
  //     qb.join('designations d', 'u.designation_id = d.id', 'left');
  //     qb.join('departments dep', 'u.department_id = dep.id', 'left');

  //     qb.order_by('u.id', 'DESC');
   
  //     // Execute the query
  //     const result = await qb.get();
   
  //     qb.release();
  //     return result;
  //   } catch (err) {
  //     qb.release();
  //     throw err;
  //   }
  // },
 
  getAllAdmins: async (filters = {}) => {
    const qb = await pool.get_connection();

    try {
        qb.select(`
            a.id,
            a.name,
            a.email,
            a.phone_number,
            a.country_code,
            a.department_id,
            a.designation_id,
            d.name AS department_name,
            ds.name AS designation_name
        `)
        .from('users AS a')
        .join('departments AS d', 'd.id = a.department_id', 'left')
        .join('designations AS ds', 'ds.id = a.designation_id', 'left');

        if (filters.name) {
            qb.where(`a.name LIKE '%${filters.name}%'`);
        }

        if (filters.email) {
            qb.where(`a.email LIKE '%${filters.email}%'`);
        }

        if (filters.department_id) {
            qb.where('a.department_id', filters.department_id);
        }

        if (filters.designation_id) {
            qb.where('a.designation_id', filters.designation_id);
        }

        return await qb.get();
    } finally {
        qb.release();
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
 
  /*async updateAdmin(id, data) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.update('users', data, { id });
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  },*/

  async updateAdmin(id, data) {
    const qb = await pool.get_connection();
    try {
        const result = await qb.update('users', data, { id });
        qb.release();

        // result contains affectedRows → return it
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