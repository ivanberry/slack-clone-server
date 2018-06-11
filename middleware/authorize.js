import jwt from 'jsonwebtoken';

export default (option) => {
  const { SECRET, refreshTokens } = option;
  return async (req, res, next) => {
    const { token } = req.headers['x-token'];
    if (token) {
      try {
        const { user } = jwt.decode(token, SECRET);
        req.user = user;
      } catch (error) {
        const refreshToken = req.headers['x-refresh-token'];
        const newTokens = await refreshTokens();
        res.set('x-token', newTokens);
        res.set('x-refresh-token', refreshToken);
        next();
      }
    }
    next();
  };
};
