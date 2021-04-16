module.exports = {
  SALT_ROUNDS: 10,
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'secretkey',
};
