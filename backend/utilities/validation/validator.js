const Joi = require('joi');
let response = require('../response');
let validator = {
 
  register: async (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
          'string.empty': 'Name is required',
          'string.min': 'Name should have at least 3 characters',
          'string.max': 'Name should not exceed 50 characters',
          'any.required': 'Name is required'
        }),
 
      email: Joi.string()
        .email()
        .required()
        .messages({
          'string.email': 'Enter a valid email address',
          'any.required': 'Email is required'
        }),
 
      password: Joi.string()
        .min(6)
        .max(20)
        .required()
        .messages({
          'string.min': 'Password must be at least 6 characters long',
          'string.max': 'Password cannot exceed 20 characters',
          'any.required': 'Password is required'
        }),
 
      // 🔹 Optional Fields (validate ONLY if sent)
      designation_id: Joi.string()
        .optional()
        .allow(null, '')
        .messages({
          'string.base': 'Invalid designation ID'
        }),
 
      department_id: Joi.string()
        .optional()
        .allow(null, '')
        .messages({
          'string.base': 'Invalid department ID'
        }),
 
      country_code: Joi.string()
        .optional()
        .allow(null, '')
        .pattern(/^[0-9]+$/)
        .messages({
          'string.pattern.base': 'Country code must contain only numbers'
        }),
 
      phone_number: Joi.string()
        .optional()
        .allow(null, '')
        .pattern(/^[0-9]{7,10}$/)
        .messages({
          'string.pattern.base': 'Phone number must be 10 digits'
        })
    }).unknown(true);
 
    const result = schema.validate(req.body, { abortEarly: false });
 
    if (result.error) {
      return res.status(400).json({
        status: 'failed',
        message: result.error.details.map(e => e.message)
      });
    }
   
    next();
  },
 
 
  login: async (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string()
        .email()
        .required()
        .messages({
          'string.email': 'Enter a valid email address',
          'any.required': 'Email is required'
        }),
      password: Joi.string()
        .min(6)
        .max(20)
        .required()
        .messages({
          'string.min': 'Password must be at least 6 characters long',
          'string.max': 'Password cannot exceed 20 characters',
          'any.required': 'Password is required'
        })
    });
 
    const result = schema.validate(req.body, { abortEarly: false });
 
    if (result.error) {
      return res
      .status(200)
      .send(response.failed(result.error.details.map(e => e.message)));
    } else {
      next();
    }
  },
 
  departmentCreate: async (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
          'string.empty': 'Department name is required',
          'string.min': 'Department name must be at least 2 characters long',
          'string.max': 'Department name cannot exceed 50 characters',
          'any.required': 'Department name is required'
        }),
    });
 
    const result = schema.validate(req.body, { abortEarly: false });
 
    if (result.error) {
      return res
      .status(200)
      .send(response.failed(result.error.details.map(e => e.message)));
    } else {
      next();
    }
  },
 
  designationCreate: async (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
          'string.empty': 'Designation name is required',
          'string.min': 'Designation name must be at least 2 characters long',
          'string.max': 'Designation name cannot exceed 50 characters',
          'any.required': 'Designation name is required'
        }),
    });
 
    const result = schema.validate(req.body, { abortEarly: false });
 
    if (result.error) {
      return res
      .status(200)
      .send(response.failed(result.error.details.map(e => e.message)));
    } else {
      next();
    }
  },
 
  departmentUpdate: async (req, res, next) => {
    const schema = Joi.object({
     
      name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
          'string.empty': 'Department name is required',
          'string.min': 'Department name must be at least 2 characters long',
          'string.max': 'Department name cannot exceed 50 characters',
          'any.required': 'Department name is required'
        }),
    }).unknown(true);
 
    const result = schema.validate(req.body, { abortEarly: false });
 
    if (result.error) {
      return res
      .status(200)
      .send(response.failed(result.error.details.map(e => e.message)));
    } else {
      next();
    }
  },
 
  designationUpdate: async (req, res, next) => {
    const schema = Joi.object({
     
      name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
          'string.empty': 'Designation name is required',
          'string.min': 'Designation name must be at least 2 characters long',
          'string.max': 'Designation name cannot exceed 50 characters',
          'any.required': 'Designation name is required'
        }),
    }).unknown(true);
 
    const result = schema.validate(req.body, { abortEarly: false });
 
    if (result.error) {
      return res.status(200).send(response.failed(error.message));
    } else {
      next();
    }
  },
 
};
 
module.exports = validator;