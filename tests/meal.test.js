const request = require('supertest');
const db = require('../api/models');
const app = require('../index');
const login = require('./authentification-mixin');

const mealsURL = '/meals';
const { Meal } = db;
let user = null;

async function createMeal() {
  const { id } = await Meal.create({
    date: new Date(),
    dishId: 1,
    userId: 1,
  });
  return id;
}

describe('Meal API', () => {
  beforeAll(async () => {
    user = await login(request(app));
  });

  it('should show meals only', async () => {
    const res = await request(app)
      .get(mealsURL)
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode)
      .toBe(200);

    const mealsModels = await Meal.scope(['defaultScope', { method: ['fromUser', user.id] }])
      .findAll();

    const mealsObjects = JSON.parse(JSON.stringify(mealsModels));

    expect(res.body)
      .toStrictEqual(mealsObjects);
  });

  it('should show meals with dishes', async () => {
    const res = await request(app)
      .get(mealsURL)
      .query({ scope: 'full' })
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode)
      .toBe(200);

    const mealsModels = await Meal.scope(['defaultScope', { method: ['full', user.id] }])
      .findAll();

    const mealsObjects = JSON.parse(JSON.stringify(mealsModels));

    expect(res.body)
      .toStrictEqual(mealsObjects);
  });

  it('should show a meal simple', async () => {
    const id = 1;
    const res = await request(app)
      .get(`${mealsURL}/${id}`)
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode)
      .toEqual(200);

    const mealModel = await Meal.scope(['defaultScope', { method: ['fromUser', user.id] }]).findByPk(id);

    const mealObject = JSON.parse(JSON.stringify(mealModel));

    expect(res.body)
      .toStrictEqual(mealObject);
  });

  it('should show a meal with its dish', async () => {
    const id = 1;
    const res = await request(app)
      .get(`${mealsURL}/${id}`)
      .query({ scope: 'full' })
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode)
      .toEqual(200);

    const mealModel = await Meal.scope(['defaultScope', { method: ['full', user.id] }]).findByPk(id);

    const mealObject = JSON.parse(JSON.stringify(mealModel));

    expect(res.body)
      .toStrictEqual(mealObject);
  });

  it('should create a new meal and return it simple', async () => {
    const res = await request(app)
      .post(mealsURL)
      .send({
        date: new Date(),
        dishId: 1,
      })
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode)
      .toEqual(201);

    const createdMealId = res.body.id;

    const mealModel = await Meal.scope(['defaultScope', { method: ['fromUser', user.id] }])
      .findByPk(createdMealId);

    const mealObject = JSON.parse(JSON.stringify(mealModel));

    expect(res.body)
      .toStrictEqual(mealObject);
  });

  it('should create a new meal and return it with its dish', async () => {
    const res = await request(app)
      .post(mealsURL)
      .query({ scope: 'full' })
      .send({
        date: new Date(),
        dishId: 1,
      })
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode)
      .toEqual(201);

    const createdMealId = res.body.id;

    const mealModel = await Meal.scope(['defaultScope', { method: ['full', user.id] }])
      .findByPk(createdMealId);

    const mealObject = JSON.parse(JSON.stringify(mealModel));

    expect(res.body)
      .toStrictEqual(mealObject);
  });

  it('should update a meal and return it simple', async () => {
    const id = await createMeal();

    const res = await request(app)
      .put(`${mealsURL}/${id}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        date: new Date(),
        dishId: 3,
      });

    expect(res.statusCode)
      .toEqual(200);

    const updatedMealId = res.body.id;
    const mealModel = await Meal.scope(['defaultScope', { method: ['fromUser', user.id] }])
      .findByPk(updatedMealId);
    const mealObject = JSON.parse(JSON.stringify(mealModel));

    expect(res.body)
      .toStrictEqual(mealObject);
  });

  it('should update a meal and return it with its dish', async () => {
    const id = await createMeal();

    const res = await request(app)
      .put(`${mealsURL}/${id}`)
      .query({ scope: 'full' })
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        date: new Date(),
        dishId: 3,
      });

    expect(res.statusCode)
      .toEqual(200);

    const updatedMealId = res.body.id;
    const mealModel = await Meal.scope(['defaultScope', { method: ['full', user.id] }])
      .findByPk(updatedMealId);
    const mealObject = JSON.parse(JSON.stringify(mealModel));

    expect(res.body)
      .toStrictEqual(mealObject);
  });

  it('should update a meal date', async () => {
    const id = await createMeal();

    const res = await request(app)
      .put(`${mealsURL}/${id}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        date: new Date(),
      });

    expect(res.statusCode)
      .toEqual(200);

    const updatedMealId = res.body.id;
    const mealModel = await Meal.scope(['defaultScope', { method: ['fromUser', user.id] }])
      .findByPk(updatedMealId);
    const mealObject = JSON.parse(JSON.stringify(mealModel));

    expect(res.body)
      .toStrictEqual(mealObject);
  });

  it('should update a meal dish', async () => {
    const id = await createMeal();

    const res = await request(app)
      .put(`${mealsURL}/${id}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        dishId: 2,
      });

    expect(res.statusCode)
      .toEqual(200);

    const updatedMealId = res.body.id;
    const updatedMealModel = await Meal.scope(['defaultScope', { method: ['fromUser', user.id] }])
      .findByPk(updatedMealId);

    const createdMealObject = JSON.parse(JSON.stringify(updatedMealModel));
    expect(res.body)
      .toStrictEqual(createdMealObject);
  });

  it('should delete a meal', async () => {
    const id = await createMeal();

    const res = await request(app)
      .del(`${mealsURL}/${id}`)
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode)
      .toEqual(200);

    const foundMeal = await Meal.findByPk(id);
    expect(foundMeal)
      .toBeNull();
  });
});
