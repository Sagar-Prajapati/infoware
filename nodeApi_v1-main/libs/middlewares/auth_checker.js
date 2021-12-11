import jwt from 'jsonwebtoken';
import db from '../../db';

import config from '../../config';

export const isLoggedIn = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.unauthorized('Authentication required');
    }

    const token = req.headers.authorization.replace(/Bearer /, '');

    const decoded = jwt.verify(token, config.jwt.secret);

    const { type } = decoded;

    req.user = {
      ownerId: decoded.ownerId,
      customerId: decoded.customerId,
      name: decoded.name,
      email: decoded.email,
      type: decoded.type
    };

    if (type === 'customer') {
      const [customerToken] = await db('customer_tokens')
        .select('token')
        .where({ token })
        .limit(1);

      if (!customerToken) {
        return res.forbidden({ message: 'Token expired!' });
      }
      next();
    } else {
      const [ownerToken] = await db('owner_tokens')
        .select('token')
        .where({ token })
        .limit(1);

      if (!ownerToken) {
        return res.forbidden({ message: 'Token expired!' });
      }
      next();
    }
  } catch (error) {
    return res.unauthorized('Authentication required');
  }
};
