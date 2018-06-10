import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { pick } from 'lodash';

export const createTokens = async (user, secret, secret2) => {
  const token = await jwt.sign({ user: pick(user, 'id') }, secret, {
    expiresIn: '1h',
  });

  const refreshToken = await jwt.sign(
    {
      user: pick(user, 'id'),
    },
    secret2,
    {
      expiresIn: '7d',
    },
  );

  console.log([token, refreshToken]);

  return [token, refreshToken];
};

export const tryLogin = async (email, password, models, SERCRET, SERCRET2) => {
  const user = await models.User.findOne({ where: { email }, raw: true });
  if (!user) {
    return {
      ok: false,
      errors: [
        {
          path: 'password',
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
    password,
    SERCRET,
    refreshTokenSecret,
  );

  return {
    ok: true,
    token,
    refreshToken,
  };
};
