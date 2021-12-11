import db from '../db';
import bcrypt from 'bcryptjs';
import logger from '../libs/logger';
import jwt from 'jsonwebtoken';
import config from '../config';
import { getTransaction } from '../libs/utils';
import { OwnerSchema, VerifyLogin } from '../libs/schemas';

export const registerOwner = async (req, res) => {
  const trx = await getTransaction(db);
  try {
    const { error, value: data } = OwnerSchema.validate(req.body);
    if (error) {
      await trx.rollback(error);
      return res.badRequest(error.message);
    }

    const { name, email, phone, role, password: pass } = data;

    const [alredyExistingOwner] = await db('owner_accounts')
      .transacting(trx)
      .select('*')
      .where({ email });

    if (alredyExistingOwner) {
      await trx.rollback(new Error('this owner alreay exist'));
      return res.badRequest('this owner alreay exist');
    }

    await db('owner_accounts')
      .transacting(trx)
      .insert({
        name,
        email,
        phone,
        role,
        password: bcrypt.hashSync(pass, 8)
      });

    await trx.commit();
    return res.ok();
  } catch (error) {
    await trx.rollback();
    logger.error(`[registerOwner] error: ${error.stack}`);
    return res.internalServerError();
  }
};

export const ownerLogin = async (req, res) => {
  const trx = await getTransaction(db);
  try {
    const { error, value: data } = VerifyLogin.validate(req.body);

    if (error) {
      await trx.rollback(error);
      return res.badRequest(error.message);
    }

    const { email, password } = data;

    const [ownerData] = await db('owner_accounts')
      .transacting(trx)
      .select('*')
      .where({ email });

    if (!ownerData) {
      await trx.rollback(new Error('Owner not found'));
      return res.badRequest('Owner not found');
    }

    if (!bcrypt.compareSync(password, ownerData.password)) {
      await trx.rollback(new Error('Wrong Password'));
      return res.badRequest('Wrong Password');
    }

    const payload = {
      ownerId: ownerData.id,
      name: ownerData.name,
      email: email,
      type: 'owner'
    };

    const token = jwt.sign(payload, config.jwt.secret);

    await db('owner_tokens')
      .transacting(trx)
      .delete()
      .where({ ownerId: ownerData.id });

    await db('owner_tokens').transacting(trx).insert({
      ownerId: ownerData.id,
      token
    });
    await trx.commit();
    return res.ok({ token, message: 'login success' });
  } catch (error) {
    await trx.rollback(error);
    logger.error(`[ownerLogin] error: ${error.stack}`);
    return res.internalServerError();
  }
};
