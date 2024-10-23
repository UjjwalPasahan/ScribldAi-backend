const Joi = require('joi');

const ImageDataSchema = Joi.object({
  image: Joi.string().required(),
  dict_of_vars: Joi.object().pattern(Joi.string(), Joi.any()).required()
});

module.exports = { ImageDataSchema };