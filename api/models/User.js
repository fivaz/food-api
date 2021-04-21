const bcrypt = require('bcryptjs');
const { Model } = require('sequelize');
const { SALT_ROUNDS } = require('../helpers/vars');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    async checkPassword(password) {
      return bcrypt.compare(password, this.password);
    }

    static associate() {
      const hashPassword = async (user) => {
        // TODO check I can fix this issue
        // eslint-disable-next-line no-param-reassign
        user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
      };
      User.beforeSave(hashPassword);
    }
  }

  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: [
          'password',
        ],
      },
    },
  });
  return User;
};
