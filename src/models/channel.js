module.exports = (sequelize, DataTypes) => {
  const Channel = sequelize.define('channel', {
    name: DataTypes.STRING,
    public: DataTypes.BOOLEAN,
  });

  Channel.associate = (models) => {
    Channel.belongsTo(models.Team, {
      foreignKey: {
        name: 'teamId',
        field: 'team_id',
      },
    });

    // N:M
    Channel.belongsToMany(models.User, {
      through: 'channel_memeber',
      foreignKey: {
        name: 'ChannelId',
        field: 'channel_id',
      },
    });
  };

  return Channel;
};
