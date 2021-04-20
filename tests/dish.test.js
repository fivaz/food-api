const request = require('supertest');
const db = require('../api/models');
const app = require('../index');
const login = require('./authentification-mixin');

const dishesURL = '/dishes';
const { Dish } = db;
let user = null;

async function createDish() {
  const { id } = await Dish.create({
    name: 'Cassoulet',
    category: 'lunch',
    userId: 1,
    ingredients: [
      { id: 2, dishIngredients: { quantity: 100 } },
      { id: 2, dishIngredients: { quantity: 20 } },
      { id: 4, dishIngredients: { quantity: 25 } },
    ],
  });
  return id;
}

describe('Dish API', () => {
  beforeAll(async () => {
    user = await login(request(app));
  });

  it('should show all dishes with ingredients', async () => {
    const res = await request(app)
      .get(dishesURL)
      .query({ scope: 'full' })
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode)
      .toBe(200);

    const dishesModels = await Dish.scope(['defaultScope', { method: ['full', user.id] }])
      .findAll();

    const dishesObjects = JSON.parse(JSON.stringify(dishesModels));

    expect(res.body)
      .toStrictEqual(dishesObjects);
  });

  it('should show all dishes simple', async () => {
    const res = await request(app)
      .get(dishesURL)
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode)
      .toBe(200);

    const dishesModels = await Dish.scope(['defaultScope', { method: ['fromUser', user.id] }])
      .findAll();

    const dishesObjects = JSON.parse(JSON.stringify(dishesModels));

    expect(res.body)
      .toStrictEqual(dishesObjects);
  });

  it('should show a dish simple', async () => {
    const id = 1;
    const res = await request(app)
      .get(`${dishesURL}/${id}`)
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode)
      .toEqual(200);

    const dishModel = await Dish.scope(['defaultScope', { method: ['fromUser', user.id] }])
      .findByPk(id);

    const dish = dishModel.toJSON();

    expect(res.body)
      .toStrictEqual(dish);
  });

  it('should show a dish with ingredients', async () => {
    const id = 1;
    const res = await request(app)
      .get(`${dishesURL}/${id}`)
      .query({ scope: 'full' })
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode)
      .toEqual(200);

    const dishModel = await Dish.scope(['defaultScope', { method: ['full', user.id] }])
      .findByPk(id);

    const dish = dishModel.toJSON();

    expect(res.body)
      .toStrictEqual(dish);
  });

  it('shouldn\'t show a dish', async () => {
    const res = await request(app)
      .get(`${dishesURL}/10000`)
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode)
      .toEqual(200);

    expect(res.body)
      .toBeNull();
  });

  it('should create a new dish and return it simple', async () => {
    const res = await request(app)
      .post(dishesURL)
      .send({
        name: 'Fillet de Perche',
        category: 'dinner',
        ingredients: [
          { id: 2, dishIngredients: { quantity: 100 } },
          { id: 2, dishIngredients: { quantity: 20 } },
          { id: 4, dishIngredients: { quantity: 25 } },
        ],
      })
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode)
      .toEqual(201);

    const createdDishId = res.body.id;

    const dishModel = await Dish.scope(['defaultScope', { method: ['fromUser', user.id] }])
      .findByPk(createdDishId);

    const dishObject = dishModel.toJSON();

    expect(res.body)
      .toStrictEqual(dishObject);
  });

  it('should create a new dish and return it complete', async () => {
    const res = await request(app)
      .post(dishesURL)
      .query({ scope: 'full' })
      .send({
        name: 'Fillet de Perche',
        category: 'dinner',
        ingredients: [
          { id: 2, dishIngredients: { quantity: 100 } },
          { id: 2, dishIngredients: { quantity: 20 } },
          { id: 4, dishIngredients: { quantity: 25 } },
        ],
      })
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode)
      .toEqual(201);

    const createdDishId = res.body.id;

    const dishModel = await Dish.scope(['defaultScope', { method: ['full', user.id] }])
      .findByPk(createdDishId);

    const dishObject = dishModel.toJSON();

    expect(res.body)
      .toStrictEqual(dishObject);
  });

  it('should update a dish and return it simple', async () => {
    const id = await createDish();

    const newDish = {
      name: 'Nutella and Peanut butter Sandwich',
      category: 'tea',
      ingredients: [
        { id: 2, dishIngredients: { quantity: 99 } },
        { id: 3, dishIngredients: { quantity: 88 } },
        { id: 4, dishIngredients: { quantity: 77 } },
      ],
    };

    const res = await request(app)
      .put(`${dishesURL}/${id}`)
      .send(newDish)
      .set('Authorization', `Bearer ${user.token}`);
    expect(res.statusCode)
      .toEqual(200);

    const dishModel = await Dish.scope(['defaultScope', { method: ['fromUser', user.id] }])
      .findByPk(id);

    const dishObject = dishModel.toJSON();

    expect(res.body)
      .toStrictEqual(dishObject);
  });

  it('should update a dish and return it complete', async () => {
    const id = await createDish();

    const newDish = {
      name: 'Nutella and Peanut butter Sandwich',
      category: 'tea',
      ingredients: [
        { id: 2, dishIngredients: { quantity: 99 } },
        { id: 3, dishIngredients: { quantity: 88 } },
        { id: 4, dishIngredients: { quantity: 77 } },
      ],
    };

    const res = await request(app)
      .put(`${dishesURL}/${id}`)
      .query({ scope: 'full' })
      .send(newDish)
      .set('Authorization', `Bearer ${user.token}`);
    expect(res.statusCode)
      .toEqual(200);

    const dishModel = await Dish.scope(['defaultScope', { method: ['full', user.id] }])
      .findByPk(id);

    const dishObject = dishModel.toJSON();

    expect(res.body)
      .toStrictEqual(dishObject);
  });

  it('should delete a dish', async () => {
    const id = await createDish();

    const res = await request(app)
      .del(`${dishesURL}/${id}`)
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode)
      .toEqual(200);

    const foundDish = await Dish.findByPk(id);
    expect(foundDish)
      .toBeNull();
  });
});
