import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { pick } from 'lodash';

export const createTokens = async (user, secret, secret2) => {
  const token = await jwt.sign(
    { user: pick(user, ['id', 'username']) },
    secret,
    {
      expiresIn: '1h',
    },
  );

  const refreshToken = await jwt.sign(
    {
      user: pick(user, 'id'),
    },
    secret2,
    {
      expiresIn: '7d',
    },
  );

  return [token, refreshToken];
};

export const tryLogin = async (email, password, models, SERCRET, SERCRET2) => {
  const user = await models.User.findOne({ where: { email }, raw: true });
  if (!user) {
    return {
      ok: false,
      errors: [
        {
          path: 'email',
          message: "User does't exist",
        },
      ],
    };
  }

  // user exist, so we shoud compare the password with jwt
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return {
      ok: false,
      errors: [
        {
          path: 'password',
          message: 'Invalid password',
        },
      ],
    };
  }

  const refreshTokenSecret = user.password + SERCRET2;
  const [token, refreshToken] = await createTokens(
    user,
    SERCRET,
    refreshTokenSecret,
  );

  return {
    ok: true,
    token,
    refreshToken,
  };
};

export const refreshTokens = async (
  token,
  refreshToken,
  models,
  SERCRET,
  SERCRET2,
) => {
  let userId = 0;
  try {
    const {
      user: { id },
    } = jwt.decode(refreshToken);
    userId = id;
  } catch (error) {
    return {};
  }
  if (!userId) return {};

  const user = await models.User.findOne({ where: { id: userId }, raw: true });
  const refreshSecret = user.password + SERCRET2;
  if (!user) return {};

  try {
    jwt.verify(refreshToken, refreshSecret);
  } catch (error) {
    return {};
  }

  const [newToken, newRefreshToken] = await createTokens(
    user,
    SERCRET,
    refreshSecret,
  );

  return {
    token,
    newToken,
    refreshToken: newRefreshToken,
    user,
  };
};
