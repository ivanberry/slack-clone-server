import bcrypt from 'bcrypt';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isAlphanumeric: {
          args: true,
          msg: 'username only allow alphanumeric characters',
        },
        len: {
          args: [6, 20],
          msg: 'username length must be between 6 ~ 20',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: 'Valid Email',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6, 20],
          msg: 'password length must be between 5 ~ 20',
        },
      },
    },
  });

  User.hook('afterValidate', (user) => {
    /* eslint-disable */
    user.password = bcrypt.hashSync(user.password, 12);
  });

  User.associate = (models) => {
    User.belongsToMany(models.Team, {
      through: model.Member,
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    });

    // N:M
    User.belongsToMany(models.Channel, {
      through: 'channel_memeber',
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    });
  };

  return User;
};
