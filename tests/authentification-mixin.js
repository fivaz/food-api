const login = async (requestPromise) => {
  const response = await requestPromise
    .post('/login')
    .send({
      email: 'admin@admin.com',
      password: 'admin@admin.com',
    });

  return response.body;
};

module.exports = login;
