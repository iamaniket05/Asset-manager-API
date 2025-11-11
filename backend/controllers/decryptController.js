const encrypt_decrypt = require('../utilities/encrypt_decrypt');
let decryptController={

    decryptFields: async (req, res) => {
        console.log("🔹 Incoming decrypt request at:", new Date());
        console.log("🔹 Request body:", req.body);
     
        try {
          const { id, designation_id, department_id } = req.body;
     
          console.log("🔹 Decrypting =>", { id, designation_id, department_id });
     
          // Decrypt all possible fields
          const decId = id ? encrypt_decrypt.decrypt(id) : null;
          const decDesignation = designation_id ? encrypt_decrypt.decrypt(designation_id) : null;
          const decDepartment = department_id ? encrypt_decrypt.decrypt(department_id) : null;
     
          return res.json({
            success: true,
            data: {
              id: decId,
              designation_id: decDesignation,
              department_id: decDepartment
            }
          });
        } catch (err) {
          console.error("❌ Decrypt Error:", err);
          return res.status(500).json({ success: false, error: err.message });
        }
      }

};

module.exports=decryptController;