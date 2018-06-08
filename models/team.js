module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define('team', {
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
  });

  Team.associate = (models) => {
    Team.belongsToMany(models.User, {
      through: 'memeber',
      foreignKey: 'teamId',
    });

    Team.belongsTo(models.User, { foreignKey: 'owner' });
  };

  return Team;
};
