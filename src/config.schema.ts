import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  DB_PORT: Joi.number().required(),
  DB_HOST: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});
