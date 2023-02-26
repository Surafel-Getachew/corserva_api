import request from 'supertest';
import { app, server } from '../server';
import Item from '../models/Item';

const sampleItem = {
  name: 'Mag safe2',
  count: 2,
  pricePerUnit: 59,
  availableForSale: true,
  category: 'electronics',
};

describe('items', () => {
  describe('get all items route', () => {
    describe('given there is no items', () => {
      it('should return 200 and empty array content', async () => {
        const res = await request(app).get('/items');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
      });
    });

    describe('given there items in db', () => {
      it('should return 200 and array of content', async () => {
        const item = await Item.create(sampleItem);
        const res = await request(app).get('/items');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        await item.destroy();
        await item.save();
      });
    });
  });
  describe('get a single item', () => {
    describe('given incorrect id type', () => {
      it('should return 400', async () => {
        const res = await request(app).get('/items/abc');
        expect(res.statusCode).toBe(400);
      });
    });
    describe("given correct id type but id that does'nt exist", () => {
      it('should return 204', async () => {
        const res = await request(app).get('/items/200');
        expect(res.statusCode).toBe(204);
      });
    });
    describe('given correct id it should return the item', () => {
      it('should return 200', async () => {
        const item = await Item.create(sampleItem);
        const res = await request(app).get(`/items/${item?.id}`);
        expect(res.statusCode).toBe(200);
        await item.destroy();
        await item.save();
      });
    });
  });
  describe('delete item', () => {
    describe('given incorrect id type', () => {
      it('should return 400', async () => {
        const res = await request(app).delete('/items/abc');
        expect(res.statusCode).toBe(400);
      });
    });
    describe("given correct id type but id that does'nt exist", () => {
      it('should return 204', async () => {
        const res = await request(app).delete('/items/200');
        expect(res.statusCode).toBe(204);
      });
    });
    describe('given correct id it should delete the item', () => {
      it('should return 200', async () => {
        const item = await Item.create(sampleItem);
        const res = await request(app).delete(`/items/${item?.id}`);
        expect(res.statusCode).toBe(200);
        await item.destroy();
        await item.save();
      });
    });
  });
  describe('update item', () => {
    describe('given incorrect id type', () => {
      it('should return 400', async () => {
        const res = await request(app).put('/items/abc');
        expect(res.statusCode).toBe(400);
      });
    });
    describe("given correct id type but id that does'nt exist", () => {
      it('should return 204', async () => {
        const res = await request(app).delete('/items/200');
        expect(res.statusCode).toBe(204);
      });
    });
    describe('given correct id but invalid request body', () => {
      it('should return 204', async () => {
        const item = await Item.create(sampleItem);
        const itemPayload = {
          count: 'two',
          availableForSale: 'false',
          type: 'none',
        };
        const res = await request(app)
          .put(`/items/${item.id}`)
          .set('Accept', 'application/json')
          .send(itemPayload);
        expect(res.statusCode).toBe(400);
        await item.destroy();
        await item.save();
      });
    });
    describe('given correct id and correct request body', () => {
      it('should return 200,update count and availableForSale', async () => {
        const item = await Item.create(sampleItem);
        const itemPayload = {
          count: 3,
          availableForSale: false,
        };
        const res = await request(app)
          .put(`/items/${item.id}`)
          .set('Accept', 'application/json')
          .send(itemPayload);
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
  await Item.destroy({ truncate: true });
});
afterEach(async () => {
  await server.close();
});
