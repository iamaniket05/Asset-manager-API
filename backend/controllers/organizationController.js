const OrganizationModel = require('../models/organizationModel');
const encrypt_decrypt = require('../utilities/encrypt_decrypt');
let response = require('../utilities/response');
const fs = require('fs');
const path = require('path');

const organizationController = {

  async getAll(req, res) {
    try {
      const list = await OrganizationModel.getAllOrganizations();
  
      const encrypted = list.map(org => ({
        id: encrypt_decrypt.encrypt(org.id),
        name: org.name,
        email: org.email,
        contact_no: org.contact_no,
        address: org.address,
        country: org.country,
        state: org.state,
        city: org.city,
        zipcode: org.zipcode,
        logo: org.logo,          // ✅ include logo
        favicon: org.favicon,    // ✅ include favicon
        created_at: org.created_at
      }));
  
      return res.send(response.successData(encrypted, "Organization list fetched successfully"));
    } catch (err) {
      return res.status(500).send(response.failed(err.message));
    }
  },

  // Get One
  async getById(req, res) {
    try {
      const id = encrypt_decrypt.decrypt(req.params.id);

      const org = await OrganizationModel.getOrganizationById(id);
      if (!org) {
        return res.status(404).send(response.failed("Organization not found"));
      }

      const data = {
        id: req.params.id,
        name: org.name,
        email: org.email,
        contact_no: org.contact_no,
        address: org.address,
        country: org.country,
        state: org.state,
        city: org.city,
        zipcode: org.zipcode
      };

      return res.send(response.successData(data, "Organization fetched successfully"));

    } catch (err) {
      return res.status(500).send(response.failed(err.message));
    }
  },
  
async create(req, res) {
  try {
    const { id, name, email, contact_no, address, country, state, city, zipcode } = req.body;

    if (!name) {
      return res.status(400).send({ success: false, message: "Name is required" });
    }

    let logo = null;
    let favicon = null;

    if (req.files && Array.isArray(req.files)) {
      const logoFile = req.files.find(f => f.fieldname === 'logo');
      const faviconFile = req.files.find(f => f.fieldname === 'favicon');

      if (logoFile) logo = logoFile.filename;
      if (faviconFile) favicon = faviconFile.filename;
    }

    const payload = { name, email, contact_no, address, country, state, city, zipcode };

    if (id) {
      // 🔹 Decrypt ID
      const encryptedId = req.body.id;
      const orgId = encrypt_decrypt.decrypt(encryptedId);

      // 🔹 Get existing record
      const existing = await OrganizationModel.getOrganizationById(orgId);

      // 🔹 If new logo uploaded, delete old one
      if (logo) {
        if (existing.logo) {
          const oldLogoPath = path.join(__dirname, '../uploads/organizations', existing.logo);
          if (fs.existsSync(oldLogoPath)) {
            fs.unlinkSync(oldLogoPath);
          }
        }
        payload.logo = logo;
      }

      // 🔹 If new favicon uploaded, delete old one
      if (favicon) {
        if (existing.favicon) {
          const oldFaviconPath = path.join(__dirname, '../uploads/organizations', existing.favicon);
          if (fs.existsSync(oldFaviconPath)) {
            fs.unlinkSync(oldFaviconPath);
          }
        }
        payload.favicon = favicon;
      }

      // 🔹 Update DB
      const result = await OrganizationModel.updateOrganization(orgId, payload);
      return res.status(200).send({ success: true, data: result, message: "Organization updated successfully" });

    } else {
      // ✅ Create new organization
      if (logo) payload.logo = logo;
      if (favicon) payload.favicon = favicon;

      const result = await OrganizationModel.createOrganization(payload);
      return res.status(201).send({ success: true, data: result, message: "Organization created successfully" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ success: false, message: err.message });
  }
},

};

module.exports = organizationController;
