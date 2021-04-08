const request = require('supertest');
const app = require('../index');

const ingredientsURL = '/ingredients/';

describe('Ingredient API', () => {
    it('should show all ingredients', async () => {
        const res = await request(app).get(ingredientsURL);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(7);
    });
    it('should show an ingredient', async () => {
        const res = await request(app).get(`${ingredientsURL}1`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('name');
    });
    it('shouldn\'t show an ingredient', async () => {
        const res = await request(app).get(`${ingredientsURL}10`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeNull();
    });
    // ,
//     // it('should create a new ingredient', async () => {
//     //     const res = await request(app)
//     //         .post(ingredientsURL)
//     //         .send({
//     //             firstName: 'Bob',
//     //             lastName: 'Doe',
//     //             email: 'bob@doe.com',
//     //             password: '12345678'
//     //         });
//     //     expect(res.statusCode).toEqual(201);
//     //     expect(res.body).toHaveProperty('ingredient');
//     // }),
//     // it('should update a ingredient', async () => {
//     //     const res = await request(app)
//     //         .put('/api/ingredients/3')
//     //         .send({
//     //             firstName: 'Bob',
//     //             lastName: 'Smith',
//     //             email: 'bob@doe.com',
//     //             password: 'abc123'
//     //         });
//     //     expect(res.statusCode).toEqual(200);
//     //     expect(res.body).toHaveProperty('ingredient');
//     // }),
//     // it('should delete a ingredient', async () => {
//     //     const res = await request(app)
//     //         .del('/api/ingredients/3');
//     //     expect(res.statusCode).toEqual(204);
//     // });
});
