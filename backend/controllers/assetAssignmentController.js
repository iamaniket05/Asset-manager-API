const AssetAssignmentModel = require('../models/assetAssignmentModel');
const AssetModel = require('../models/assetModel');
const EmployeeModel = require('../models/employeeModel');
 
const encrypt_decrypt = require('../utilities/encrypt_decrypt');
const response = require('../utilities/response');
 
const assetAssignmentController = {
 
    // ASSIGN ASSET TO EMPLOYEE
    // ASSIGN ASSET TO EMPLOYEE (CREATE + UPDATE)
async assign(req, res) {
   
    try {
        let { assign_id, asset_id, employee_id, assigned_quantity } = req.body;
 
        // decrypt asset ID
        asset_id = encrypt_decrypt.decrypt(asset_id);
       
 
        if (!asset_id || !employee_id || !assigned_quantity) {
            return res.status(200).json(
                response.failed("asset_id, employee_id and assigned_quantity are required")
            );
        }
 
        employee_id = encrypt_decrypt.decrypt(employee_id);
 
        // Find employee
        const employee = await EmployeeModel.findByEmployeeId(employee_id);
        if (!employee) {
            return res.status(200).json(response.failed("Employee not found"));
        }
 
        // Get asset info
        const asset = await AssetModel.getAssetById(asset_id);
        if (!asset) {
            return res.status(200).json(response.failed("Asset not found"));
        }
 
        // CASE 1 : UPDATE EXISTING ASSIGNMENT
        // CASE 1 : UPDATE EXISTING ASSIGNMENT
if (assign_id) {
 
    // If frontend sent decrypted ID, convert it to encrypted
    if (!isNaN(assign_id)) {
        assign_id = encrypt_decrypt.encrypt(assign_id.toString());
    }
 
    const decryptedAssignId = encrypt_decrypt.decrypt(assign_id);
    if (!decryptedAssignId) {
        return res.status(200).json(response.failed("Invalid assign_id"));
    }
 
    const oldRecord = await AssetAssignmentModel.getAssignmentById(decryptedAssignId);
    if (!oldRecord) {
        return res.status(200).json(response.failed("Assignment not found"));
    }
 
    const oldAssetId = oldRecord.asset_id;
    const oldQty = Number(oldRecord.assigned_quantity);
    const newQty = Number(assigned_quantity);
 
    const isAssetChanged = (oldAssetId !== asset_id);
 
    // CASE A: ASSET CHANGED
    if (isAssetChanged) {
 
        // UPDATE OLD ASSET: restore its stock
        const oldAsset = await AssetModel.getAssetById(oldAssetId);
        const updatedOldAssigned = Number(oldAsset.assigned_assets) - oldQty;
        const updatedOldRemaining = Number(oldAsset.count) - updatedOldAssigned;
 
        await AssetModel.updateAsset(oldAssetId, {
            assigned_assets: updatedOldAssigned,
            remaining_assets: updatedOldRemaining
        });
 
        // UPDATE NEW ASSET: apply full newQty
        const newAsset = await AssetModel.getAssetById(asset_id);
        const updatedNewAssigned = Number(newAsset.assigned_assets) + newQty;
        const updatedNewRemaining = Number(newAsset.count) - updatedNewAssigned;
 
        if (updatedNewRemaining < 0) {
            return res.status(200).json(response.failed("Not enough stock in the new asset"));
        }
 
        await AssetModel.updateAsset(asset_id, {
            assigned_assets: updatedNewAssigned,
            remaining_assets: updatedNewRemaining
        });
 
    } else {
        // CASE B: SAME ASSET → only update quantity difference
        const diff = newQty - oldQty;
 
        const updatedAssigned = Number(asset.assigned_assets) + diff;
        const updatedRemaining = Number(asset.count) - updatedAssigned;
 
        if (updatedAssigned < 0 || updatedRemaining < 0) {
            return res.status(200).json(response.failed("Invalid quantity update"));
        }
 
        await AssetModel.updateAsset(asset_id, {
            assigned_assets: updatedAssigned,
            remaining_assets: updatedRemaining
        });
    }
 
    // Update assignment record
    await AssetAssignmentModel.returnAsset(decryptedAssignId, {
        asset_id,
        employee_id,
        assigned_quantity: newQty,
        handover_person: req.body.handover_person
    });
 
    return res
        .status(200)
        .json(response.success("Assignment updated successfully"));
}
 
         
        // CASE 2: CREATE NEW ASSIGNMENT
        const remainingStock = asset.remaining_assets !== null ? asset.remaining_assets : asset.count;
        if (remainingStock < assigned_quantity) {
            return res.status(200).json(
                response.failed(`Only ${remainingStock} items available`)
            );
        }
 
        const insertData = {
            asset_id,
            employee_id,
            assigned_quantity,
            status: "assigned",
            assigned_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
            handover_person: req.body.handover_person
        };
 
        await AssetAssignmentModel.assignAsset(insertData);
 
        // UPDATE ASSET COUNTS
        await AssetModel.updateAsset(asset_id, {
            assigned_assets: Number(asset.assigned_assets) + Number(assigned_quantity),
            remaining_assets: Number(asset.remaining_assets) - Number(assigned_quantity)
        });
 
        return res.status(200).json(response.success("Asset assigned successfully"));
 
    } catch (error) {
        return res.status(500).json(response.failed(error.message));
    }
}
,
 
    // GET ALL ASSIGNMENTS
    async getAll(req, res) {
        try {
            const assignments = await AssetAssignmentModel.getAllAssignments();
 
            const formatted = assignments.map(row => ({
                id: encrypt_decrypt.encrypt(row.id),
                asset_name: row.asset_name,
                model: row.model,
                employee_name: row.employee_name,
                assigned_quantity: row.assigned_quantity,
                assigned_date: row.assigned_date,
                return_date: row.return_date,
                status: row.status,
                handover_person: row.handover_person
            }));
 
            return res.status(200).json(
                response.successData(formatted, "Assignments fetched successfully")
            );
        } catch (error) {
            return res.status(500).json(response.failed(error.message));
        }
    },
 
    // RETURN ASSET
    async returnAsset(req, res) {
        try {
            const decryptedId = encrypt_decrypt.decrypt(req.params.id);
            if (!decryptedId) {
                return res.status(400).json(response.failed("Invalid assignment ID"));
            }
 
            const assignment = await AssetAssignmentModel.getAssignmentById(decryptedId);
            if (!assignment) {
                return res.status(404).json(response.failed("Assignment not found"));
            }
 
            if (assignment.status === "returned") {
                return res.status(400).json(response.failed("Asset already returned"));
            }
 
            // Update assignment first
            await AssetAssignmentModel.returnAsset(decryptedId, {
                status: "returned",
                return_date: new Date().toISOString().slice(0, 19).replace('T', ' ')
            });
 
            // Get asset details
            const asset = await AssetModel.getAssetById(assignment.asset_id);
            if (!asset) {
                return res.status(404).json(response.failed("Asset not found"));
            }
 
            // Convert and calculate correctly
            const assignedQty = Number(assignment.assigned_quantity) || 0;
            const assignedAssets = Number(asset.assigned_assets) || 0;
            const totalCount = Number(asset.count) || 0;
 
            // New values after return
            const newAssigned = assignedAssets - assignedQty;
            const finalAssigned = newAssigned < 0 ? 0 : newAssigned;
 
            const newRemaining = totalCount - finalAssigned;
            const finalRemaining = newRemaining < 0 ? 0 : newRemaining;
 
            // Save updates
            await AssetModel.updateAsset(assignment.asset_id, {
                assigned_assets: finalAssigned,
                remaining_assets: finalRemaining
            });
 
            return res.status(200).json(response.success("Asset returned successfully"));
 
        } catch (error) {
            return res.status(500).json(response.failed(error.message));
        }
    },
 
    // DELETE ASSIGNMENT
async deleteAssignment(req, res) {
    try {
      const decryptedId = encrypt_decrypt.decrypt(req.params.id);
      if (!decryptedId) {
        return res.status(400).json(response.failed("Invalid assignment ID"));
      }
 
      // Delete assignment and get its info
      const assignment = await AssetAssignmentModel.deleteAssignment(decryptedId);
      if (!assignment) {
        return res.status(404).json(response.failed("Assignment not found"));
      }
 
      // Update asset counts
      const asset = await AssetModel.getAssetById(assignment.asset_id);
      if (!asset) {
        return res.status(404).json(response.failed("Asset not found"));
      }
 
      const assignedQty = Number(assignment.assigned_quantity) || 0;
      const newAssigned = (Number(asset.assigned_assets) || 0) - assignedQty;
      const finalAssigned = newAssigned < 0 ? 0 : newAssigned;
      const finalRemaining = (Number(asset.count) || 0) - finalAssigned;
 
      await AssetModel.updateAsset(assignment.asset_id, {
        assigned_assets: finalAssigned,
        remaining_assets: finalRemaining
      });
 
      return res.status(200).json(response.success("Assignment deleted successfully"));
    } catch (error) {
      return res.status(500).json(response.failed(error.message));
    }
  },
 
  // GET ASSIGNMENT BY ID
/*async getById(req, res) {
    try {
        const decryptedId = encrypt_decrypt.decrypt(req.params.id);
        if (!decryptedId) {
            return res.status(400).json(response.failed("Invalid assignment ID"));
        }
 
        const assignment = await AssetAssignmentModel.getAssignmentById(decryptedId);
        if (!assignment) {
            return res.status(404).json(response.failed("Assignment not found"));
        }
 
        return res.status(200).json({
            success: true,
            status: "success",
            data: assignment
        });
    } catch (error) {
        return res.status(500).json(response.failed(error.message));
    }
}*/
 
async getById(req, res) {
    try {
        const decryptedId = encrypt_decrypt.decrypt(req.params.id);
 
        if (!decryptedId) {
            return res.status(400).json(response.failed("Invalid assignment ID"));
        }
 
        const assignment = await AssetAssignmentModel.getAssignmentById(decryptedId);
 
        if (!assignment) {
            return res.status(404).json(response.failed("Assignment not found"));
        }
 
        // Fetch employee
        const employee = await EmployeeModel.findByEmployeeId(assignment.employee_id);
 
        // Fetch asset
        const asset = await AssetModel.getAssetById(assignment.asset_id);
 
        const finalData = {
            id: encrypt_decrypt.encrypt(assignment.id.toString()),
            assign_id: encrypt_decrypt.encrypt(assignment.id.toString()),
 
            employee_id: encrypt_decrypt.encrypt(assignment.employee_id.toString()),
            employee_name: employee?.employee_name || "",
 
            asset_id: encrypt_decrypt.encrypt(assignment.asset_id.toString()),
            asset_name: asset?.asset_name || "",
            model: asset?.model || "",
 
            assigned_quantity: assignment.assigned_quantity,
            handover_person: assignment.handover_person,
            assigned_date: assignment.assigned_date,
            status: assignment.status
        };
 
        return res.status(200).json({
            success: true,
            status: "success",
            data: finalData
        });
 
    } catch (error) {
        return res.status(500).json(response.failed(error.message));
    }
}
 
 
 
};
 
module.exports = assetAssignmentController;