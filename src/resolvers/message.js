export default {
  Mutation: {
    createMessage: async (parent, args, { models, user }) => {
      try {
        await models.Message.create({ ...args, userId: user.id });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
  Query: {
    messages: async (parent, { channelId }, { models }) =>
      models.Message.findAll(
        { order: [['created_at', 'ASC']] },
        { where: { channelId } },
        { raw: true },
      ),
  },
  Message: {
    user: ({ userId }, args, { models }) =>
      models.User.findOne({ where: { id: userId } }, { raw: true }),
  },
};
