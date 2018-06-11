import { pick } from 'lodash';

/* eslint-disable */
export const formatErrors = (e, models) => {
  if (e instanceof models.sequelize.ValidationError) {
    return e.errors.map((x) => pick(x, ['path', 'message']));
  }
  return [{ path: 'Ooops', messag: 'something went wrong' }];
};
