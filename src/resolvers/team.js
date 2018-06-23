import { formatErrors } from '../utils';
import requiresAuth from '../permissions';

export default {
  Query: {
    allTeams: requiresAuth.createResolver(
      async (parent, args, { models, user }) =>
        models.Team.findAll({ where: { owner: user.id } }, { raw: true }),
    ),
  },
  Mutation: {
    createTeam: requiresAuth.createResolver(
      async (parent, args, { models, user }) => {
        try {
          const response = await models.sequelize.transaction(async () => {
            const team = await models.Team.create({ ...args, owner: user.id });
            await models.Channel.create({
              name: 'general',
              public: true,
              teamId: team.id,
            });
            return team;
          });
          return {
            ok: true,
            team: response,
          };
        } catch (err) {
          return {
            ok: false,
            errors: formatErrors(err, models),
          };
        }
      },
    ),
    addTeamMember: requiresAuth.createResolver(
      async (parent, { email, teamId }, { models, user }) => {
        try {
          const teamPromise = models.Team.findOne(
            { where: { id: teamId } },
            { raw: true },
          );
          const userToAddPromise = models.User.findOne(
            {
              where: { email },
            },
            { raw: true },
          );

          const [team, userToAdd] = await Promise.all([
            teamPromise,
            userToAddPromise,
          ]);

          if (!userToAdd) {
            return {
              ok: false,
              errors: [
                {
                  path: 'email',
                  message: 'Could not find the user',
                },
              ],
            };
          }

          if (team.owner !== user.id) {
            return {
              ok: false,
              errors: [
                {
                  path: 'email',
                  message: 'You can not add members to this team',
                },
              ],
            };
          }

          await models.Member.create({ userId: userToAdd.id, teamId });

          return {
            ok: true,
          };
        } catch (err) {
          return {
            ok: false,
            errors: formatErrors(err, models),
          };
        }
      },
    ),
  },
  Team: {
    // overwrite the default model property
    channels: ({ id }, args, { models }) =>
      models.Channel.findAll({ where: { teamId: id } }),
  },
};
