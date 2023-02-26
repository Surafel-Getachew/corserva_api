import request from 'supertest';
import { app, server } from '../server';
import Order from '../models/Order';
import Item from '../models/Item';
import OrderItem from '../models/OrderItem';

const sampleItem = {
  name: 'Mag safe2',
  count: 2,
  pricePerUnit: 59,
  availableForSale: true,
  category: 'electronics',
};

const createItem = async () => {
  try {
    const item = await Item.create(sampleItem);
    return item;
  } catch (error) {
    console.log('error creating sample item', error);
  }
};

const createOrder = async (itemId: number) => {
  const sampleOrder = {
    deliveryDate: '2023-02-14 14:04:19.373+03',
    items: [
      {
        id: itemId,
        quantity: 1,
      },
    ],
  };
  try {
    const order = await Order.create(sampleOrder);
    await OrderItem.create({
      orderId: order.id,
      itemId,
      quantity: 1,
    });
    return order;
  } catch (error) {
    console.log('error', error);
  }
};

describe('orders', () => {
  describe('get all orders route', () => {
    describe('given there is no items', () => {
      it('should return 200 and empty array content', async () => {
        const res = await request(app).get('/orders');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
      });
    });

    describe('given there are orders in db', () => {
      it('should return 200 and array of content', async () => {
        const item = await createItem();
        const order = await createOrder(item?.id);
        const res = await request(app).get('/orders');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        await item?.destroy();
        await order?.destroy();
      });
    });
  });

  describe('get a single order  ', () => {
    describe('given incorrect id type', () => {
      it('should return 400', async () => {
        const res = await request(app).get('/orders/abc');
        expect(res.statusCode).toBe(400);
      });
    });
    describe("given correct id type but id that does'nt exist", () => {
      it('should return 204', async () => {
        const res = await request(app).get('/orders/200');
        expect(res.statusCode).toBe(204);
      });
    });
    describe('given correct id it should return the order', () => {
      it('should return 200', async () => {
        const item = await createItem();
        const order = await createOrder(item?.id);
        const res = await request(app).get('/orders');
        expect(res.statusCode).toBe(200);
        await item?.destroy();
        await order?.destroy();
      });
    });
  });
  describe('delete order', () => {
    describe('given incorrect id type', () => {
      it('should return 400', async () => {
        const res = await request(app).delete('/orders/abc');
        expect(res.statusCode).toBe(400);
      });
    });
    describe("given correct id type but id that does'nt exist", () => {
      it('should return 204', async () => {
        const res = await request(app).delete('/orders/200');
        expect(res.statusCode).toBe(204);
      });
    });
    describe('given correct id it should delete the item and increase the item count', () => {
      it('should return 200', async () => {
        const item = await createItem();
        const prevCount = item?.count;
        const orderPayload = {
          deliveryDate: '2023-02-14 14:04:19.373+03',
          items: [
            {
              id: item?.id,
              quantity: 1,
            },
          ],
        };
        const order = await request(app).post('/orders').set('Accept', 'application/json').send(orderPayload);
        expect(order.statusCode).toBe(201);

        const res = await request(app).delete(`/orders/${order.body.id}`);
        expect(res.statusCode).toBe(200);
        const itemAfterDelete = await request(app).get(`/items/${item?.id}`);
        expect(itemAfterDelete.body.count).toStrictEqual(prevCount);
        await item?.destroy();
        await Order.destroy({ where: { id: order.body.id } });
      });
    });
  });
  describe('add new order', () => {
    describe('given incorrect delivery date type', () => {
      it('should return 400', async () => {
        const item = await createItem();
        const orderPayload = {
          deliveryDate: 'hello world',
          items: [
            {
              id: item?.id,
              quantity: 1,
            },
          ],
        };
        const order = await request(app).post('/orders').set('Accept', 'application/json').send(orderPayload);
        expect(order.statusCode).toBe(400);
        await item?.destroy();
      });
    });
    describe("given an item id that doesn'nt exist", () => {
      it("should return 400 with message Item doesn'n exist", async () => {
        const item = await createItem();
        const orderPayload = {
          deliveryDate: '2023-02-14 14:04:19.373+03',
          items: [
            {
              id: 9999,
              quantity: 1,
            },
          ],
        };
        const order = await request(app).post('/orders').set('Accept', 'application/json').send(orderPayload);
        expect(order.statusCode).toBe(400);
        expect(order.body.message).toBe("Item doesn't exist");
        await item?.destroy();
      });
    });
    describe('ordering more than available quantity', () => {
      it('should return 400 with a message, Not enough item in stock for the item', async () => {
        const item = await createItem();
        const orderPayload = {
          deliveryDate: '2023-02-14 14:04:19.373+03',
          items: [
            {
              id: item?.id,
              quantity: 3,
            },
          ],
        };
        const order = await request(app).post('/orders').set('Accept', 'application/json').send(orderPayload);
        expect(order.statusCode).toBe(400);
        expect(order.body.message).toBe(`Not enough item in stock for the item ${item?.name}, Please update your item`);
        await item?.destroy();
      });
    });
  });
  describe('update item', () => {
    describe('given incorrect id type', () => {
      it('should return 400', async () => {
        const res = await request(app).put('/orders/abc');
        expect(res.statusCode).toBe(400);
      });
    });
    describe("given correct id type but id that does'nt exist", () => {
      it('should return 204', async () => {
        const res = await request(app).put('/orders/200');
        expect(res.statusCode).toBe(204);
        // expect(res.body.message).toBe("Order doesn't exist");
      });
    });
    describe("given correct id but invalid/does'nt exist item id", () => {
      it('should return 400', async () => {
        const item = await createItem();
        const order = await createOrder(item?.id);
        const itemPayload = {
          items: [{ id: '90200', quantity: 1 }],
        };
        const res = await request(app).put(`/orders/${order?.id}`).set('Accept', 'application/json').send(itemPayload);
        expect(res.statusCode).toBe(400);
        await item?.destroy();
        await order?.save();
      });
    });
    describe('updating order item more than available quantity ', () => {
      it('should return 400', async () => {
        const item = await createItem();
        const order = await createOrder(item?.id);
        const itemPayload = {
          items: [{ id: item?.id, quantity: 5 }],
        };
        console.log('item id test', item?.id);

        const res = await request(app).put(`/orders/${order?.id}`).set('Accept', 'application/json').send(itemPayload);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe(`Can't update item because stock contains only ${item?.count} ${item?.name}`);
        await item?.destroy();
        await order?.destroy();
      });
    });
    describe('given correct id and correct request body', () => {
      it('should return 200,update count and availableForSale', async () => {
        const item = await Item.create(sampleItem);
        const itemPayload = {
          count: 3,
          availableForSale: false,
        };
        const res = await request(app).put(`/items/${item.id}`).set('Accept', 'application/json').send(itemPayload);
        expect(res.statusCode).toBe(200);
        expect(res.body.count).toStrictEqual(3);
        expect(res.body.availableForSale).toStrictEqual(false);
        await item.destroy();
        await item.save();
      });
    });
  });
});

afterAll(async () => {
  await Order.destroy({ truncate: true });
  await Item.destroy({ truncate: true });
  await OrderItem.destroy({ truncate: true });
});
afterEach(async () => {
  await server.close();
});
