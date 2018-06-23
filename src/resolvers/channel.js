import { formatErrors } from '../utils';

export default {
  Mutation: {
    createChannel: async (parent, args, { models }) => {
      try {
        const channel = await models.Channel.create(args);
        return {
          ok: true,
          channel,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      }
    },
  },
};
