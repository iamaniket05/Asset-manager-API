const OrganizationModel = require('../models/organizationModel');
const encrypt_decrypt = require('../utilities/encrypt_decrypt');
let response = require('../utilities/response');

const organizationController = {

  // Create
  async create(req, res) {
    try {
      const { name, email, contact_no, address, country, state, city, zipcode } = req.body;

      if (!name) {
        return res.status(400).send(response.failed("Name is required"));
      }

      const exists = await OrganizationModel.findByName(name);
      if (exists) {
        return res.send(response.failed("Organization already exists"));
      }

      const payload = { name, email, contact_no, address, country, state, city, zipcode };
      const result = await OrganizationModel.createOrganization(payload);

      return res.status(201).send(response.successData(result, "Organization created successfully"));

    } catch (err) {
      return res.status(500).send(response.failed(err.message));
    }
  },

  // Get All (Encrypt ID)
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

  // Update
  async update(req, res) {
    try {
      const id = encrypt_decrypt.decrypt(req.params.id);
      const payload = req.body;

      await OrganizationModel.updateOrganization(id, payload);

      return res.send(response.success("Organization updated successfully"));

    } catch (err) {
      return res.status(500).send(response.failed(err.message));
    }
  },

  // Delete
  async remove(req, res) {
    try {
      const id = encrypt_decrypt.decrypt(req.params.id);
      await OrganizationModel.deleteOrganization(id);

      return res.send(response.success("Organization deleted successfully"));

    } catch (err) {
      return res.status(500).send(response.failed(err.message));
    }
  }
};

module.exports = organizationController;
