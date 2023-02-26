import { type Request, type Response } from 'express';
import Item from '../models/Item';
import { itemValidator } from '../schema-validator/itemValidator';

const { addItemValidator, updateItemValidator, getSingleItemValidator, deleteItemValidator } = itemValidator;

const getAllItems = async (req: Request, res: Response) => {
  // const page = parseInt(req?.query?.page as string);
  // const limit = parseInt(req?.query?.limit as string);
  // const startIndex = (page - 1) * limit;
  // const totalDocument = await Rocket.countDocuments();
  // const totalPage = Math.ceil(totalDocument / limit);

  // if (page && limit) {
  //   items = await Item.findAll({
  //     limit,
  //     offset: startIndex,
  //   });
  // } else {
  //   items = await Item.findAll();
  // }
  const items = await Item.findAll();
  if (!items) return res.status(204).json({ message: 'No items found.' });
  // res.json({ items, totalPage });
  return res.json(items);
};

const addNewItem = async (req: Request, res: Response) => {
  const { error, value } = addItemValidator(req?.body);

  if (error) {
    return res.status(400).json(error?.details);
  }

  try {
    const result = await Item.create(value);

    res.status(201).json(result);
  } catch (err) {
    console.log('error creating item', err);
    res.status(500).send('Server Error');
  }
};

const updateItem = async (req: Request, res: Response) => {
  const { error, value } = updateItemValidator({ ...req?.body, ...req.params });
  const { id, name, count, pricePerUnit, availableForSale, category } = value;

  if (error) {
    return res.status(400).send(error?.details);
  }
  let item;
  try {
    item = await Item.findOne({
      where: {
        id,
      },
    });
  } catch (error) {
    console.log('error updating item', error);
  }

  if (item == null) {
    return res.status(204).json({ message: `No item matches ID ${id}.` });
  }

  if (name) item.name = name;
  if (count) item.count = count;
  if (pricePerUnit) item.pricePerUnit = pricePerUnit;
  if (category) item.category = category;
  if (availableForSale !== undefined) {
    item.availableForSale = availableForSale;
  }
  try {
    const result = await item.save();
    res.json(result);
  } catch (error) {
    res.status(500).send('Internal Server Error');
    console.log(error);
  }
};

const deleteItem = async (req: Request, res: Response) => {
  const { error, value } = deleteItemValidator(req?.params);
  if (error) {
    return res.status(400).json(error?.details);
  }
  const { id } = value;

  try {
    const item = await Item.destroy({
      where: {
        id,
      },
    });
    if (item == 0) {
      return res.status(204).json({ message: `No item matches ID ${id}.` });
    }
    res.json(item); // it just returns the number of affected rows
  } catch (error) {
    res.status(500).send('Internal Server Error');
    console.log(error);
  }
};

const getItem = async (req: Request, res: Response) => {
  const { error, value } = getSingleItemValidator(req.params);

  if (error) {
    return res.status(400).json(error?.details);
  }
  const { id } = value;
  let item;
  try {
    item = await Item.findOne({
      where: {
        id,
      },
    });
  } catch (error) {
    console.log('error getting item', error);
  }

  if (item == null) {
    return res.status(204).json({ message: `No Item matches ID ${id}.` });
  }
  res.json(item);
};

const itemController = {
  getAllItems,
  addNewItem,
  updateItem,
  deleteItem,
  getItem,
};

export default itemController;
