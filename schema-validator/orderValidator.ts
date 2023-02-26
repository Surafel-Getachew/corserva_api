import Joi from 'joi';
import validator from './validator';

const addOrderSchema = Joi.object({
  deliveryDate: Joi.date().required(),
});

const orderIdSchema = Joi.object({
  id: Joi.number().required(),
});

const items = Joi.object().keys({
  id: Joi.number().required(),
  quantity: Joi.number(),
});

const createItems = Joi.object().keys({
  id: Joi.number().required(),
  quantity: Joi.number().required(),
});

const updateOrderSchema = Joi.object({
  id: Joi.number().required(),
  delivaryDate: Joi.date(),
  items: Joi.array().items(items),
});

const createOrderSchema = Joi.object({
  deliveryDate: Joi.date().required(),
  items: Joi.array().items(createItems).required(),
});

export const orderValidator = {
  addOrderValidator: validator(addOrderSchema),
  getSingleOrderValidator: validator(orderIdSchema),
  deleteOrderValidator: validator(orderIdSchema),
  updateOrderValidator: validator(updateOrderSchema),
  addNewOrderValidator: validator(createOrderSchema),
};
