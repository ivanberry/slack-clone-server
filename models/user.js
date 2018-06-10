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
    password: DataTypes.STRING,
  });

  User.associate = (models) => {
    User.belongsToMany(models.Team, {
      through: 'memeber',
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
