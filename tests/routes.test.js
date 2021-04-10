const request = require('supertest');
const { Ingredient } = require('../api/models');
const app = require('../index');

const ingredientsURL = '/ingredients';

const getLatestIngredient = () => Ingredient.findOne({
  order: [['createdAt', 'DESC']],
});

describe('Ingredient API', () => {
  it('should show all ingredients', async () => {
    const response = await request(app)
      .get(ingredientsURL);
    expect(response.statusCode)
      .toBe(200);
    const number = await Ingredient.count();
    expect(response.body)
      .toHaveLength(number);
  });

  it('should show an ingredient', async () => {
    const id = 1;
    const response = await request(app)
      .get(`${ingredientsURL}/${id}`);
    expect(response.statusCode)
      .toEqual(200);
    const ingredient = (await Ingredient.findByPk(id)).toJSON();
    expect(response.body)
      .toEqual(ingredient);
  });

  it('shouldn\'t show an ingredient', async () => {
    const res = await request(app)
      .get(`${ingredientsURL}/10000`);
    expect(res.statusCode)
      .toEqual(200);
    expect(res.body)
      .toBeNull();
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
      });
    expect(res.statusCode)
      .toEqual(201);

    const latestIngredient = (await getLatestIngredient()).toJSON();

    const expectedIngredient = res.body;
    delete expectedIngredient.createdAt;
    delete expectedIngredient.updatedAt;

    expect(expectedIngredient)
      .toEqual(latestIngredient);
  });

  it('should update a ingredient', async () => {
    const createdIngredient = await Ingredient.create({
      name: 'Milka',
      isCountable: false,
      price: 5.55,
      unit: 'g',
      quantity: 5.5,
    });

    const newIngredient = {
      name: 'Milk',
      isCountable: true,
      price: 1.55,
      unit: 'l',
      quantity: 1.5,
    };

    const res = await request(app)
      .put(`${ingredientsURL}/${createdIngredient.id}`)
      .send(newIngredient);
    expect(res.statusCode)
      .toEqual(200);

    expect(res.body)
      .toEqual((await getLatestIngredient()).toJSON());
  });

  it('should delete a ingredient', async () => {
    const createdIngredient = await Ingredient.create({
      name: 'Milka',
      isCountable: false,
      price: 5.55,
      unit: 'g',
      quantity: 5.5,
    });

    const res = await request(app)
      .del(`${ingredientsURL}/${createdIngredient.id}`);
    expect(res.statusCode)
      .toEqual(200);

    const foundIngredient = await Ingredient.findByPk(createdIngredient.id);
    expect(foundIngredient)
      .toBeNull();
  });
});
