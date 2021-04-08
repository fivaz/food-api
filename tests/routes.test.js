const request = require('supertest');
const app = require('../index');

const ingredientsURL = '/ingredients';

// TODO stop the process after tests are completed in webstorm test runner

describe('Ingredient API', () => {
    it('should show all ingredients', async () => {
        const response = await request(app).get(ingredientsURL);
        expect(response.statusCode).toBe(200);
        //TODO check how test the database later
        // expect(response.body).toHaveLength(7);
    });
    it('should show an ingredient', async () => {
        const res = await request(app).get(`${ingredientsURL}/1`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('name');
    });
    it('shouldn\'t show an ingredient', async () => {
        const res = await request(app).get(`${ingredientsURL}/10`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeNull();
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
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('name');
    });
    it('should update a ingredient', async () => {
        const res = await request(app)
            .put(`${ingredientsURL}/6`)
            .send({
                name: 'Milk',
                isCountable: true,
                price: 1.55,
                unit: 'l',
                quantity: 1.5,
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('name');
    });
    it('should delete a ingredient', async () => {
        const res = await request(app)
            .del(`${ingredientsURL}/4`);
        expect(res.statusCode).toEqual(200);
    });
});
