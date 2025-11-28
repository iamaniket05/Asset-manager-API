const pool = require('../config/db');

const AssetRequestModel = {
  async findById(id) {
    const qb = await pool.get_connection();
    try {
      const result = await qb.select('*').where({ id }).get('asset_requests');
      qb.release();
      return result && result.length ? result[0] : null;
    } catch (err) {
      qb.release();
      throw err;
    }
  },

  async createRequest({ employee_id, asset_id, requested_quantity, remarks }) {
    const qb = await pool.get_connection();
    try {
      const payload = {
        employee_id,
        asset_id,
        requested_quantity: requested_quantity || 1,
        remarks: remarks || null,
      };
      const result = await qb.insert('asset_requests', payload);
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  },

  async getFilteredRequests({ employee_id, asset_id, status, from_date, to_date }) {
    const qb = await pool.get_connection();
    try {
        qb.select(`
            ar.id,
            ar.employee_id,
            ar.asset_id,
            ar.requested_quantity,
            ar.request_status,
            ar.request_date,
            ar.approved_date,
            ar.remarks,
            e.name AS employee_name,
            a.name As asset_name
        `)
        .from('asset_requests ar')
        .join('employees e', 'ar.employee_id = e.id')
        .join('assets a', 'ar.asset_id = a.id');

        if (employee_id) qb.where('ar.employee_id', employee_id);
        if (asset_id) qb.where('ar.asset_id', asset_id);
        if (status !== undefined && status !== '') qb.where('ar.request_status', status);
        if (from_date) qb.where('ar.request_date >=', from_date);
        if (to_date) qb.where('ar.request_date <=', to_date);

        qb.order_by('ar.id', 'DESC');

        const result = await qb.get();
        qb.release();
        return result;
    } catch (err) {
        qb.release();
        throw err;
    }
},

async updateStatus(id, status, approved_date = null, remark = null) {
    const qb = await pool.get_connection();
    try {
      const payload = { request_status: status };
  
      if (approved_date) payload.approved_date = approved_date;
      if (remark) payload.remarks = remark;
  
      const result = await qb.update('asset_requests', payload, { id });
  
      qb.release();
      return result;
    } catch (err) {
      console.log("UpdateStatus Error:", err);
      qb.release();
      throw err;
    }
  },
  
  // Insert into asset_assignments when accepted
  async createAssignment({ asset_id, employee_id, assigned_quantity }) {
    const qb = await pool.get_connection();
    try {
      const payload = {
        asset_id,
        employee_id,
        assigned_quantity: assigned_quantity || 1,
        // assigned_date default will be handled by DB
      };
      const result = await qb.insert('asset_assignments', payload);
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  },

  async updateAssetCounts(asset_id, qty) {
    const qb = await pool.get_connection();
    try {
  
      const rows = await qb
        .select("count, assigned_assets, remaining_assets")
        .where({ id: asset_id })
        .get("assets");
  
      if (!rows || rows.length === 0) {
        qb.release();
        throw new Error("Asset not found");
      }
  
      const asset = rows[0];
  
      // Convert safely
      const total = Number(asset.count) || 0;
      const assigned = Number(asset.assigned_assets) || 0;
  
      // If remaining_assets is null → recalculate
      let remaining = asset.remaining_assets === null 
        ? total - assigned 
        : Number(asset.remaining_assets);
  
      // Now apply the new assignment
      const newAssigned = assigned + qty;
      const newRemaining = remaining - qty;
  
      if (newRemaining < 0) {
        qb.release();
        return { insufficient: true, remaining };
      }
  
      const result = await qb.update(
        "assets",
        {
          assigned_assets: newAssigned,
          remaining_assets: newRemaining
        },
        { id: asset_id }
      );
  
      qb.release();
      return { 
        updated: true, 
        assigned: newAssigned, 
        remaining: newRemaining 
      };
  
    } catch (err) {
      qb.release();
      throw err;
    }
  },
  
  async decrementAssetQuantity(asset_id, decrementBy = 1) {
    const qb = await pool.get_connection();
    try {
  
      // Get current count
      const rows = await qb.select('count').where({ id: asset_id }).get('assets');
      if (!rows || rows.length === 0) {
        qb.release();
        throw new Error('Asset not found');
      }
  
      const current = Number(rows[0].count) || 0;
  
      if (current < decrementBy) {
        qb.release();
        return { insufficient: true, available: current };
      }
  
      // Update new count
      await qb.update('assets', { count: current - decrementBy }, { id: asset_id });
  
      qb.release();
      return { updated: true, available_after: current - decrementBy };
  
    } catch (err) {
      qb.release();
      throw err;
    }
  },
  

  async updateRequest(id, data) {
    const qb = await pool.get_connection();
    try {
      const payload = {
        employee_id: data.employee_id,
        asset_id: data.asset_id,
        requested_quantity: data.requested_quantity
      };
  
      const result = await qb.update("asset_requests", payload, { id });
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
      const result = await qb.delete('asset_requests', { id });
      qb.release();
      return result;
    } catch (err) {
      qb.release();
      throw err;
    }
  }
};

module.exports = AssetRequestModel;
