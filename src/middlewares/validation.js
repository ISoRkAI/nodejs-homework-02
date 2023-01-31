const Joi = require('joi');

module.exports = {
  contactValidation: (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
      phone: Joi.string().min(1).max(30).required(),
    });
    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      return res.status(400).json({ message: 'missing required name field' });
    }
    next();
  },
  userValidation: (req, res, next) => {
    const userSchema = Joi.object({
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
      password: Joi.string().min(6).max(30).required(),
    });
    const validationResult = userSchema.validate(req.body);
    if (validationResult.error) {
      return res.status(400).json({ message: 'missing required name field' });
    }
    next();
  },
};
