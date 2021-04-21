const request = require('supertest');
const { User } = require('../api/models');
const app = require('../index');

describe('User API', () => {
  it('should login an user and return him with a token', async () => {
    const email = 'admin@admin.com';
    const password = 'admin@admin.com';
    const res = await request(app)
      .post('/login')
      .send({
        email,
        password,
      });

    expect(res.statusCode)
      .toBe(200);

    const userModel = await User.findOne({ where: { email } });
    const user = userModel.toJSON();

    expect(res.body)
      .toMatchObject(user);
    expect(res.body)
      .toHaveProperty('token');
    expect(res.body)
      .not
      .toHaveProperty('password');
  });

  it('should fail the login', async () => {
    const email = 'admin@admin.com';
    const password = 'test@test.com';
    const res = await request(app)
      .post('/login')
      .send({
        email,
        password,
      });

    expect(res.statusCode)
      .toBe(401);

    expect(res.body)
      .toBe('incorrect email or password');
  });

  it('should register a new user and return him with a token', async () => {
    const data = {
      name: 'new tester',
      email: `test@test${Math.random()}.com`,
      password: 'test@test.com',
    };
    const res = await request(app)
      .post('/register')
      .send(data);

    expect(res.statusCode)
      .toEqual(200);

    const userModel = await User.findOne({ where: { email: data.email } });
    const user = userModel.toJSON();

    expect(res.body)
      .toMatchObject(user);
    expect(res.body)
      .toHaveProperty('token');
    expect(res.body)
      .not
      .toHaveProperty('password');
  });
});
