import { type Request, type Response } from 'express';
import Order from '../models/Order';
import OrderItem from '../models/OrderItem';
import Item from '../models/Item';
import { orderValidator } from '../schema-validator/orderValidator';

const { addNewOrderValidator, getSingleOrderValidator, deleteOrderValidator, updateOrderValidator } = orderValidator;

const getAllOrders = async (_req: Request, res: Response) => {
  let orders;
  try {
    orders = await Order.findAll({ include: Item });
  } catch (error) {
    console.log('error get all orders', error);
  }

  if (orders == null) return res.status(204).json({ message: 'No items found.' });

  return res.json(orders);
};

const getOrder = async (req: Request, res: Response) => {
  const { error, value } = getSingleOrderValidator(req?.params);
  if (error) {
    return res.status(400).json(error?.details);
  }
  const id:number = value.id
  const order = await Order.findOne({
    where: {
      id,
    },
    include: Item,
  });
  if (order == null) {
    return res.status(204).json({ message: `No Order matches ID ${id}.` });
  }
  res.json(order);
};

const addNewOrder = async (req: Request, res: Response) => {
  const { error, value } = addNewOrderValidator(req?.body);
  const { deliveryDate, items } = value;

  if (error) {
    return res.status(400).json(error?.details);
  }
  let resSent = false;
  try {
    const result = await Order.create({
      deliveryDate,
    });
    await Promise.all(
      items.map(async (item: any) => {
        const { id: itemId, quantity } = item;
        // before creating check if the available quantity is in stock
        try {
          const foundItem = await Item.findOne({ where: { id: itemId } });
          if (foundItem == null) {
            await Order.destroy({ where: { id: result.id } });
            resSent = true;
            return res.status(400).json({ message: "Item doesn't exist" });
          }
          if (foundItem.count < quantity || foundItem.count === 0) {
            await Order.destroy({ where: { id: result.id } });
            resSent = true;
            return res.status(400).json({
              message: `Not enough item in stock for the item ${foundItem.name}, Please update your item`,
            });
          }
          foundItem.count = foundItem.count - quantity;
          await foundItem.save();
          await OrderItem.create({
            orderId: result.id,
            itemId,
            quantity,
          });
        } catch (error) {
          console.log('catched');
          resSent = true;
          await Order.destroy({ where: { id: result.id } });
          return res.status(400).json({ message: "Item doesn't exist" });
        }
      })
    );
    if (!resSent) {
      return res.status(201).json(result);
    }
  } catch (err) {
    if (!resSent) {
      res.status(500).send('Server Error');
    }
  }
};

const updateOrder = async (req: Request, res: Response) => {
  const { error, value } = updateOrderValidator({ ...req?.params, ...req?.body });
  const { deliveryDate, items, id: orderId } = value;
  if (error) {
    return res.status(400).json(error?.details);
  }
  let resSent = false;
  try {
    const order = await Order.findOne({
      where: { id: orderId },
      include: Item,
    });
    if (order == null) {
      resSent = true;
      return res.status(204).json({
        message: "Order doesn't exist",
      });
    }
    if (deliveryDate) {
      order.deliveryDate = deliveryDate;
    }
    if (items) {
      await Promise.all(
        items.map(async (item: any) => {
          const { id: itemId, quantity } = item;
          const orderItem = await OrderItem.findOne({
            where: {
              itemId,
              orderId,
            },
          });
          if (orderItem == null) {
            resSent = true;
            return res.status(400).json({ message: "Can't find ordered item." });
          }
          const foundItem = await Item.findOne({ where: { id: itemId } });
          if (foundItem == null) {
            resSent = true;
            return res.status(400).json({
              message: 'Item is not currently available, if you want to remove the orderd item just remove it all',
            });
          }
          if (orderItem.quantity === quantity) {
            resSent = true;
            return res.status(204).json({ message: 'No update' });
          }
          const difference = quantity - orderItem.quantity;
          if (difference > 0 && difference <= foundItem.count) {
            foundItem.count -= difference;
          } else if (difference > foundItem.count) {
            resSent = true;
            return res.status(400).json({
              message: `Can't update item because stock contains only ${foundItem.count} ${foundItem.name}`,
            });
          }
          if (difference < 0) {
            foundItem.count += difference;
          }
          orderItem.quantity = quantity;
          await foundItem.save();
          await orderItem.save();
        })
      );
    }
    await order.save();
    return res.json({ message: 'Order updated' });
  } catch (err) {
    if (!resSent) {
      return res.status(500).send('Server Error');
    }
  }
};

const deleteOrder = async (req: Request, res: Response) => {
  const { error, value } = deleteOrderValidator(req?.params);
  if (error) {
    console.log('error deleting order', error);
    return res.status(400).json(error?.details);
  }
  const { id } = value;
  let order;
  try {
    order = await Order.findOne({
      where: {
        id,
      },
      include: Item,
    });
  } catch (error) {
    console.log('Error deleting order', error);
  }
  if (order == null) {
    return res.status(204).send({ message: "Order doesn't exists" });
  }
  // If there is order
  // update the count of all items
  // and delete orderItems that contains orderId:id
  const orderItems = await OrderItem.findAll({
    where: {
      orderId: id,
    },
  });

  await Promise.all(
    orderItems.map(async (orderItem: OrderItem) => {
      const item = await Item.findOne({ where: { id: orderItem.itemId } });
      if (item != null) {
        item.count += orderItem.quantity;
      }
      await item?.save();
    })
  );
  await order.destroy();
  res.json(order);
};

const orderController = {
  getAllOrders,
  addNewOrder,
  updateOrder,
  deleteOrder,
  getOrder,
};

export default orderController;
