import Joi from 'joi';
import { ItemCategory } from '../models/Item';
import validator from './validator';

const addItemSchema = Joi.object({
  name: Joi.string().required(),
  count: Joi.number().min(1).required(),
  pricePerUnit: Joi.number().required(),
  availableForSale: Joi.boolean(),
  category: Joi.string().valid(...Object.values(ItemCategory)),
});
const updateItemSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string(),
  count: Joi.number().min(1),
  pricePerUnit: Joi.number(),
  availableForSale: Joi.boolean(),
  category: Joi.string().valid(...Object.values(ItemCategory)),
});

const itemIdSchema = Joi.object({
  id: Joi.number().required(),
});

export const itemValidator = {
  addItemValidator: validator(addItemSchema),
  updateItemValidator: validator(updateItemSchema),
  getSingleItemValidator: validator(itemIdSchema),
  deleteItemValidator: validator(itemIdSchema),
};
