const request = require('supertest');
const db = require('../api/models');
const app = require('../index');
const login = require('./authentification-mixin');
const modelNotFound = require('../api/helpers/ModelNotFoundError');

const ingredientsURL = '/ingredients';
const { Ingredient } = db;
let user = null;

async function createIngredient() {
  const { id } = await Ingredient.create({
    name: 'Milka',
    isCountable: false,
    price: 5.55,
    unit: 'g',
    quantity: 5.5,
    userId: 1,
  });
  return id;
}

describe('Ingredient API', () => {
  beforeAll(async () => {
    user = await login(request(app));
  });

  it('should show all ingredients', async () => {
    const res = await request(app)
      .get(ingredientsURL)
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode)
      .toBe(200);

    const ingredientsModels = await Ingredient.scope(['defaultScope', { method: ['fromUser', user.id] }])
      .findAll();

    const ingredientsObjects = JSON.parse(JSON.stringify(ingredientsModels));

    expect(res.body)
      .toStrictEqual(ingredientsObjects);
  });

  it('should show all ingredients with quantities for a dish', async () => {
    const dishId = 1;
    const res = await request(app)
      .get(ingredientsURL)
      .query({ dishId })
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode)
      .toBe(200);

    const ingredientsModels = await Ingredient.scope(['defaultScope', { method: ['withDish', user.id, dishId] }])
      .findAll();

    const ingredientsObjects = JSON.parse(JSON.stringify(ingredientsModels));

    expect(res.body)
      .toStrictEqual(ingredientsObjects);
  });

  it('should show an ingredient', async () => {
    const id = 1;
    const res = await request(app)
      .get(`${ingredientsURL}/${id}`)
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode)
      .toBe(200);

    const ingredientModel = await Ingredient.scope(['defaultScope', { method: ['fromUser', user.id] }])
      .findByPk(id);

    const ingredient = ingredientModel.toJSON();

    expect(res.body)
      .toEqual(ingredient);
  });

  it('shouldn\'t show an ingredient', async () => {
    const res = await request(app)
      .get(`${ingredientsURL}/10000`)
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode)
      .toBe(404);

    expect(res.body)
      .toBe(modelNotFound.message);
  });

  it('should create a new ingredient', async () => {
    const res = await request(app)
      .post(ingredientsURL)
      .send({
        name: 'Butter',
        isCountable: true,
        price: 3.25,
        unit: 'g',
        quantity: 200,
      })
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode)
      .toBe(201);

    const createdIngredientId = res.body.id;

    const ingredientModel = await Ingredient.scope(['defaultScope', { method: ['fromUser', user.id] }])
      .findByPk(createdIngredientId);

    const ingredientObject = ingredientModel.toJSON();

    expect(res.body)
      .toStrictEqual(ingredientObject);
  });

  it('should update a ingredient', async () => {
    const id = await createIngredient();

    const newIngredient = {
      name: 'Milk',
      isCountable: true,
      price: 1.55,
      unit: 'l',
      quantity: 1.5,
    };

    const res = await request(app)
      .put(`${ingredientsURL}/${id}`)
      .send(newIngredient)
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode)
      .toBe(200);

    const ingredientModel = await Ingredient.scope(['defaultScope', { method: ['fromUser', user.id] }])
      .findByPk(id);

    const ingredient = ingredientModel.toJSON();

    expect(res.body)
      .toStrictEqual(ingredient);
  });

  it('should delete a ingredient', async () => {
    const id = await createIngredient();

    const res = await request(app)
      .del(`${ingredientsURL}/${id}`)
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode)
      .toBe(200);

    const foundIngredient = await Ingredient.findByPk(id);
    expect(foundIngredient)
      .toBeNull();
  });
});
