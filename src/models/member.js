module.exports = (sequelize, DataTypes) => {
  const Memeber = sequelize.define('member', {
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Memeber;
};
