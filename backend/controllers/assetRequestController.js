const AssetRequestModel = require('../models/assetRequestModel');
const encrypt_decrypt = require('../utilities/encrypt_decrypt');
let response = require('../utilities/response');
let moment = require('moment');

const assetRequestController = {
  async create(req, res) {
    try {
      const { asset_id: encAssetId, requested_quantity, remarks } = req.body;
      const encEmployeeId = req.body.employee_id || req.user?.id; 
      if (!encEmployeeId) return res.status(400).send(response.failed('Employee id missing'));

      const employee_id = encrypt_decrypt.decrypt(encEmployeeId);
      const asset_id = encrypt_decrypt.decrypt(encAssetId);

      if (!asset_id) return res.status(400).send(response.failed('Asset is required'));

      const result = await AssetRequestModel.createRequest({
        employee_id,
        asset_id,
        requested_quantity: requested_quantity || 1,
        remarks
      });

      return res.status(201).send(response.successData({ id: encrypt_decrypt.encrypt(result.insertId) }, 'Request created successfully'));
    } catch (err) {
      console.log(err);
      return res.status(500).send(response.failed(err.message));
    }
  },

  // Admin: list requests (with optional filters)
  async list(req, res) {
    try {
      const { employee_id: encEmployeeId, asset_id: encAssetId, status, from_date, to_date } = req.query;
      const filters = {};

      if (encEmployeeId) filters.employee_id = encrypt_decrypt.decrypt(encEmployeeId);
      if (encAssetId) filters.asset_id = encrypt_decrypt.decrypt(encAssetId);
      if (status) filters.status = status;
      if (from_date) filters.from_date = from_date;
      if (to_date) filters.to_date = to_date;

      const rows = await AssetRequestModel.getFilteredRequests(filters);

      const encrypted = rows.map(r => ({
        id: encrypt_decrypt.encrypt(r.id),
        employee_id: encrypt_decrypt.encrypt(r.employee_id),
        asset_id: encrypt_decrypt.encrypt(r.asset_id),
        employee_name: r.employee_name,
        asset_name: r.asset_name,
        requested_quantity: r.requested_quantity,
        request_status: r.request_status,
        request_date: r.request_date,
        approved_date: r.approved_date,
        remarks: r.remarks
    }));
    
      return res.status(200).send(response.successData(encrypted, 'Requests fetched'));
    } catch (err) {
      console.log(err);
      return res.status(500).send(response.failed(err.message));
    }
  },

//   async act(req, res) {
//     try {
//       const { id: encId } = req.params;
//       const { action, remarks } = req.body; // action -> 'accepted' | 'denied' | 'onhold'
//       if (!encId) return res.status(400).send(response.failed('Request id required'));
//       const id = encrypt_decrypt.decrypt(encId);
//       const request = await AssetRequestModel.findById(id);
//       if (!request) return res.status(404).send(response.failed('Request not found'));
//       const allowed = ['accepted', 'denied', 'onhold'];
//       if (!allowed.includes(action)) return res.status(400).send(response.failed('Invalid action'));

//     //   if (action === 'accepted') {
//     //     // check availability and create assignment
//     //     const qty = Number(request.requested_quantity) || 1;

//     //     // attempt to decrement asset quantity (if applicable)
//     //     const decResult = await AssetRequestModel.decrementAssetQuantity(request.asset_id, qty);
//     //     if (decResult.insufficient) {
//     //       return res.status(200).send(response.failed(`Insufficient asset quantity. Available: ${decResult.available}`));
//     //     }

//         // // create assignment row
//         // const insertRes = await AssetRequestModel.createAssignment({
//         //   asset_id: request.asset_id,
//         //   employee_id: request.employee_id,
//         //   assigned_quantity: qty
//         // });

//         // update request status + approved_date
//     //     await AssetRequestModel.updateStatus(id, 'accepted', new Date(), remarks || null);

//     //     return res.status(200).send(response.successData({
//     //       request_id: encId,
//     //       assignment_id: insertRes.insertId ? encrypt_decrypt.encrypt(insertRes.insertId) : null
//     //     }, 'Request accepted and asset assigned'));
//     //   }

//       // denied or onhold
//       await AssetRequestModel.updateStatus(id, action, null, remarks || null);
//       console.log("hii");
//       return res.status(200).send(response.successData({ request_id: encId }, `Request ${action}`));
//     } catch (err) {
//       console.log(err);
//       return res.status(500).send(response.failed(err.message));
//     }
//   },


async act(req, res) {
  try {
    const { id: encId } = req.params;
    const { status, remark } = req.body;

    if (!encId)
      return res.status(200).send(response.failed('Encrypted Request ID missing'));

    const id = encrypt_decrypt.decrypt(encId);
    if (!id)
      return res.status(200).send(response.failed('Invalid encrypted ID'));

    const request = await AssetRequestModel.findById(id);
    if (!request)
      return res.status(200).send(response.failed('Request not found'));

    const allowed = ['accepted', 'denied', 'onhold'];
    if (!allowed.includes(status))
      return res.status(400).send(response.failed('Invalid status type'));

    // --------------------------
    // ACCEPTED FLOW
    // --------------------------
    if (status === 'accepted') {
    
      const qty = Number(request.requested_quantity) || 1;
  
      // 1️⃣ Attempt to update count values
      const countUpdate = await AssetRequestModel.updateAssetCounts(request.asset_id, qty);
  
      if (countUpdate.insufficient) {
          return res.status(200).send(
              response.failed(`Insufficient remaining assets. Remaining: ${countUpdate.remaining}`)
          );
      }
  
      // 2️⃣ Create assignment row
      const insertRes = await AssetRequestModel.createAssignment({
        asset_id: request.asset_id,
        employee_id: request.employee_id,
        assigned_quantity: qty
      });
  
      // 3️⃣ Format approved date using moment
      const approvedDate = moment().format("YYYY-MM-DD HH:mm:ss");
  
      // 4️⃣ Update request table
      await AssetRequestModel.updateStatus(
        id,
        'accepted',
        approvedDate,
        remark || null
      );
  
      return res.status(200).send(response.successData({
        request_id: encId,
        assignment_id: insertRes.insertId
          ? encrypt_decrypt.encrypt(insertRes.insertId)
          : null,
        assigned_assets: countUpdate.assigned,
        remaining_assets: countUpdate.remaining
      }, 'Request accepted and asset updated successfully'));
  }
  

    // --------------------------
    // DENIED / ONHOLD FLOW
    // --------------------------
    await AssetRequestModel.updateStatus(id, status, null, remark || null);

    return res
      .status(200)
      .send(response.successData({ request_id: encId }, `Request ${status}`));

  } catch (err) {
    console.log("Update Status Error:", err);
    return res.status(500).send(response.failed(err.message));
  }
},

 
  async getById(req, res) {
    try {
      const encId = req.params.id;
      const id = encrypt_decrypt.decrypt(encId);
      const r = await AssetRequestModel.findById(id);
      if (!r) return res.status(404).send(response.failed('Request not found'));

      const data = {
        id: encId,
        employee_id: encrypt_decrypt.encrypt(r.employee_id),
        asset_id: encrypt_decrypt.encrypt(r.asset_id),
        requested_quantity: r.requested_quantity,
        request_status: r.request_status,
        request_date: r.request_date,
        approved_date: r.approved_date,
        remarks: r.remarks
      };
      return res.status(200).send(response.successData(data, 'Request fetched'));
    } catch (err) {
      console.log(err);
      return res.status(500).send(response.failed(err.message));
    }
  },

  async update(req, res) {
    try {
      const { id: encId } = req.params;
  
      if (!encId) {
        return res.status(400).send(response.failed("Encrypted Request ID missing"));
      }
  
      const id = encrypt_decrypt.decrypt(encId);
      if (!id) {
        return res.status(400).send(response.failed("Invalid request ID"));
      }
  
      const { employee_id, asset_id, requested_quantity } = req.body;
  
      if (!employee_id || !asset_id || !requested_quantity) {
        return res.status(400).send(response.failed("All fields are required"));
      }
  
      const decEmployeeId = encrypt_decrypt.decrypt(employee_id);
      const decAssetId = encrypt_decrypt.decrypt(asset_id);
  
      const payload = {
        employee_id: decEmployeeId,
        asset_id: decAssetId,
        requested_quantity
      };
  
      const existing = await AssetRequestModel.findById(id);
      if (!existing) {
        return res.status(404).send(response.failed("Request not found"));
      }
  
      const updated = await AssetRequestModel.updateRequest(id, payload);
  
      return res.status(200).send(
        response.successData(
          { id: encId },
          "Request updated successfully"
        )
      );
  
    } catch (err) {
      console.log("Update Error:", err);
      return res.status(500).send(response.failed(err.message));
    }
  },
  
  async remove(req, res) {
    try {
      const id = encrypt_decrypt.decrypt(req.params.id);
      const result = await AssetRequestModel.delete(id);

      return res.status(200).send(response.success("AssetRequest deleted successfully"));
    } catch (err) {
      return res.status(500).send(response.failed(err.message));
    }
  }
};

module.exports = assetRequestController;
