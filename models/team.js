module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define(
    'team',
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    { underscored: true },
  );

  Team.associate = (models) => {
    Team.belongsToMany(models.User, {
      through: 'memeber',
      foreignKey: {
        name: 'teamId',
        field: 'team_id',
      },
    });

    Team.belongsTo(models.User, { foreignKey: 'owner' });
  };

  return Team;
};
