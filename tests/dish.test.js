const request = require('supertest');
const db = require('../api/models');
const app = require('../index');

const dishesURL = '/dishes';
const { Dish } = db;

async function createDish() {
  const { id } = await Dish.create({
    name: 'Cassoulet',
    category: 'lunch',
    ingredients: [
      { id: 2, dishIngredients: { quantity: 100 } },
      { id: 2, dishIngredients: { quantity: 20 } },
      { id: 4, dishIngredients: { quantity: 25 } },
    ],
  });
  return id;
}

async function getLatestDish() {
  return (await Dish.scope(['defaultScope', 'full'])
    .findOne({ order: [['id', 'DESC']] })).toJSON();
}

describe('Dish API', () => {
  it('should show all dishes', async () => {
    const response = await request(app)
      .get(dishesURL);
    expect(response.statusCode)
      .toBe(200);

    const dish = await Dish.count();

    expect(response.body)
      .toHaveLength(dish);
  });

  it('should show all dishes with ingredients', async () => {
    const response = await request(app)
      .get(dishesURL)
      .query({ scope: 'full' });
    expect(response.statusCode)
      .toBe(200);

    const dishesWithIngredientsModels = await Dish.scope(['defaultScope', 'full'])
      .findAll();

    const dishesWithIngredientsObjects = JSON.parse(JSON.stringify(dishesWithIngredientsModels));

    expect(response.body)
      .toStrictEqual(dishesWithIngredientsObjects);
  });

  it('should show a dish', async () => {
    const id = 1;
    const response = await request(app)
      .get(`${dishesURL}/${id}`);
    expect(response.statusCode)
      .toEqual(200);

    const dish = (await Dish.findByPk(id)).toJSON();

    expect(response.body)
      .toStrictEqual(dish);
  });

  it('shouldn\'t show a dish', async () => {
    const res = await request(app)
      .get(`${dishesURL}/10000`);
    expect(res.statusCode)
      .toEqual(200);

    expect(res.body)
      .toBeNull();
  });

  it('should create a new dish', async () => {
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
      });
    expect(res.statusCode)
      .toEqual(201);

    expect(res.body)
      .toStrictEqual(await getLatestDish());
  });

  it('should update a dish', async () => {
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
      .send(newDish);
    expect(res.statusCode)
      .toEqual(200);

    const dish = (await Dish.scope(['defaultScope', 'full'])
      .findByPk(id)).toJSON();

    expect(res.body)
      .toStrictEqual(dish);
  });

  it('should delete a dish', async () => {
    const id = await createDish();

    const res = await request(app)
      .del(`${dishesURL}/${id}`);
    expect(res.statusCode)
      .toEqual(200);

    const foundDish = await Dish.findByPk(id);
    expect(foundDish)
      .toBeNull();
  });
});
