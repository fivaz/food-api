const request = require('supertest');
const { User } = require('../api/models');
const app = require('../index');

const usersUrl = '/users';

async function registerUser() {
  const data = {
    name: 'tester',
    email: `test@test${Math.random()}.com`,
    password: 'test@test.com',
  };
  const { id } = await User.create(data);

  const loginResponse = await request(app)
    .post('/login')
    .send({
      email: data.email,
      password: data.password,
    });

  return {
    id,
    token: loginResponse.body.token,
  };
}

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
      .toBe(200);

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

  it('should update an user and return him with a token', async () => {
    const { id, token } = await registerUser();

    const newData = {
      name: 'new tester',
      email: `newtest@newtest${Math.random()}.com`,
    };

    const res = await request(app)
      .put(`${usersUrl}/${id}`)
      .send(newData)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode)
      .toBe(200);

    expect(res.body)
      .toMatchObject(newData);
    expect(res.body)
      .toHaveProperty('token');
    expect(res.body)
      .not
      .toHaveProperty('password');
  });

  it('should delete an user', async () => {
    const { id, token } = await registerUser();

    const res = await request(app)
      .del(`${usersUrl}/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode)
      .toBe(200);

    const foundDish = await User.findByPk(id);
    expect(foundDish)
      .toBeNull();
  });
});
