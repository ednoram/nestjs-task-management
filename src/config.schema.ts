import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  DB_PORT: Joi.number().default(3000),
  DB_HOST: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});
