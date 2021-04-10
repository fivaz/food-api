const request = require('supertest');
const db = require('../api/models');
const app = require('../index');

const mealsURL = '/meals';
const { Meal } = db;

const getLatestMeal = () => Meal.scope(['defaultScope', 'full'])
  .findOne({ order: [['id', 'DESC']] });

async function createMeal() {
  const { id } = await Meal.create({
    name: 'Cassoulet',
    category: 'lunch',
    ingredients: [
      { id: 2, mealIngredients: { quantity: 100 } },
      { id: 2, mealIngredients: { quantity: 20 } },
      { id: 4, mealIngredients: { quantity: 25 } },
    ],
  });
  return id;
}

describe('Meal API', () => {
  it('should show all meals', async () => {
    const response = await request(app)
      .get(mealsURL);
    expect(response.statusCode)
      .toBe(200);

    const meal = await Meal.count();

    expect(response.body)
      .toHaveLength(meal);
  });

  it('should show all meals with ingredients', async () => {
    const response = await request(app)
      .get(mealsURL)
      .query({ scope: 'full' });
    expect(response.statusCode)
      .toBe(200);

    const mealsWithIngredientsModels = await Meal.scope(['defaultScope', 'full'])
      .findAll();

    const mealsWithIngredientsObjects = JSON.parse(JSON.stringify(mealsWithIngredientsModels));

    expect(response.body)
      .toEqual(mealsWithIngredientsObjects);
  });

  it('should show a meal', async () => {
    const id = 1;
    const response = await request(app)
      .get(`${mealsURL}/${id}`);
    expect(response.statusCode)
      .toEqual(200);

    const meal = (await Meal.findByPk(id)).toJSON();
    expect(response.body)
      .toMatchObject(meal);
  });

  it('shouldn\'t show an meal', async () => {
    const res = await request(app)
      .get(`${mealsURL}/10000`);
    expect(res.statusCode)
      .toEqual(200);

    expect(res.body)
      .toBeNull();
  });

  it('should create a new meal', async () => {
    const res = await request(app)
      .post(mealsURL)
      .send({
        name: 'Fillet de Perche',
        category: 'dinner',
        ingredients: [
          { id: 2, mealIngredients: { quantity: 100 } },
          { id: 2, mealIngredients: { quantity: 20 } },
          { id: 4, mealIngredients: { quantity: 25 } },
        ],
      });
    expect(res.statusCode)
      .toEqual(201);

    expect(res.body)
      .toStrictEqual((await getLatestMeal()).toJSON());
  });

  it('should update a meal', async () => {
    const id = await createMeal();
    const newMeal = {
      name: 'Nutella and Peanut butter Sandwich',
      category: 'tea',
      ingredients: [
        { id: 2, mealIngredients: { quantity: 99 } },
        { id: 3, mealIngredients: { quantity: 88 } },
        { id: 4, mealIngredients: { quantity: 77 } },
      ],
    };

    const res = await request(app)
      .put(`${mealsURL}/${id}`)
      .send(newMeal);
    expect(res.statusCode)
      .toEqual(200);

    expect(res.body)
      .toStrictEqual((await Meal.scope(['defaultScope', 'full'])
        .findByPk(id)).toJSON());
  });

  it('should delete a meal', async () => {
    const id = await createMeal();

    const res = await request(app)
      .del(`${mealsURL}/${id}`);
    expect(res.statusCode)
      .toEqual(200);

    const foundMeal = await Meal.findByPk(id);
    expect(foundMeal)
      .toBeNull();
  });
});
