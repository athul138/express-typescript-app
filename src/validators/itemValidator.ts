import * as Joi from 'joi';

const itemSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
});

export default itemSchema;