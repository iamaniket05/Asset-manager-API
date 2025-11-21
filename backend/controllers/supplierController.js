const SupplierModel = require('../models/supplierModel');
const encrypt_decrypt = require('../utilities/encrypt_decrypt');
let response = require('../utilities/response');
 
const supplierController = {
 
  async create(req, res) {
    console.log("entered");
    try {
      const { supplier_name, email, phone, organization_name, address, status } = req.body;
 
      if (!supplier_name || !email || !phone || !organization_name || !address || !status) {
        return res.status(400).send(response.failed("All fields are required"));
      }
 
      const exists = await SupplierModel.findBySupplierName(supplier_name);
      if (exists) {
        return res.status(200).send(response.failed("Supplier already exists"));
      }
 
      const data = { supplier_name, email, phone, organization_name, address, status };
      const result = await SupplierModel.createSupplier(data);
 
      return res.status(201).send(response.successData(result, "Supplier created successfully"));
 
    } catch (err) {
      return res.status(500).send(response.failed(err.message));
    }
  },
 
  async getAll(req, res) {
    try {
      const result = await SupplierModel.getAllSuppliers();
 
      const encryptedList = result.map(supplier => ({
        id: encrypt_decrypt.encrypt(supplier.id),
        supplier_name: supplier.supplier_name,
        email: supplier.email,
        phone: supplier.phone,
        organization_name: supplier.organization_name,
        address: supplier.address,
        status: supplier.status,
        created_at: supplier.created_at
      }));
 
      return res.status(200).send(response.successData(encryptedList, "Supplier list fetched successfully"));
 
    } catch (err) {
      return res.status(500).send(response.failed(err.message));
    }
  },
 
  async getById(req, res) {
    try {
      const encryptedId = req.params.id;
      const id = encrypt_decrypt.decrypt(encryptedId);
 
      const result = await SupplierModel.getSupplierById(id);
      if (!result) {
        return res.status(404).send(response.failed("Supplier not found"));
      }
 
      const responseData = {
        id: encryptedId,
        supplier_name: result.supplier_name,
        email: result.email,
        phone: result.phone,
        organization_name: result.organization_name,
        address: result.address,
        status: result.status,
      };
 
      return res.status(200).send(response.successData(responseData, "Supplier fetched successfully"));
 
    } catch (err) {
      return res.status(500).send(response.failed(err.message));
    }
  },
 
  async update(req, res) {
    try {
      const encryptedId = req.params.id || req.body.id;
      const id = encrypt_decrypt.decrypt(encryptedId);
 
      const { supplier_name, email, phone, organization_name, address, status } = req.body;
 
      const data = { supplier_name, email, phone, organization_name, address, status };
 
      const result = await SupplierModel.updateSupplier(id, data);
 
      return res.status(200).send(response.successData(result, "Supplier updated successfully"));
 
    } catch (err) {
      return res.status(500).send(response.failed(err.message));
    }
  },
 
  async remove(req, res) {
    try {
      const id = encrypt_decrypt.decrypt(req.params.id);
      await SupplierModel.deleteSupplier(id);
 
      return res.status(200).send(response.success("Supplier deleted successfully"));
 
    } catch (err) {
      return res.status(500).send(response.failed(err.message));
    }
  }
 
};
 
module.exports = supplierController;