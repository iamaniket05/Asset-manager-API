const pool = require('../config/db');

const AssetAssignmentModel = {

  // Assign asset to employee
  async assignAsset(data) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.insert('asset_assignments', data);
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  },

  // Get all assignments
    // Get all assignments
  async getAllAssignments() {
    const qb = await pool.get_connection();
    try {
      qb.select(
        'aa.id, aa.assigned_quantity, aa.assigned_date, aa.return_date, aa.status,' +
        'aa.handover_person,' +                          // ✅ ADDED LINE
        'a.name AS asset_name, a.model, e.name AS employee_name'
      )
      .from('asset_assignments AS aa')
      .join('assets AS a', 'a.id = aa.asset_id')
      .join('employees AS e', 'e.id = aa.employee_id');

      return await qb.get();
    } finally {
      qb.release();
    }
  },


  // Get assignment by ID
  async getAssignmentById(id) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.select('*').where({ id }).get('asset_assignments');
      qb.release();
      return result && result.length > 0 ? result[0] : null;
    } catch (err) {
      qb.release();
      throw err;
    }
  },

  // Return asset
  async returnAsset(id, data) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.update('asset_assignments', data, { id });
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  },

  // Check if asset has enough quantity before assignment
  async getAssetAvailableCount(asset_id) {
    const qb = await pool.get_connection();
    try {
      const asset = await qb.select('count').where({ id: asset_id }).get('assets');
      qb.release();
      return asset.length ? asset[0].count : 0;
    } catch (err) {
      qb.release();
      throw err;
    }
  },

  // Delete assignment by ID
async deleteAssignment(id) {
  const qb = await pool.get_connection();
  try {
    // Get assignment info first
    const assignment = await this.getAssignmentById(id);
    if (!assignment) {
      qb.release();
      return null;
    }

    const result = await qb.delete('asset_assignments', { id });
    qb.release();
    return assignment; // return deleted assignment info to update Asset counts
  } catch (err) {
    qb.release();
    throw err;
  }
}


};

module.exports = AssetAssignmentModel;
