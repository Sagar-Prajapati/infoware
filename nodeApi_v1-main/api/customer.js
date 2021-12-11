import db from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';
import logger from '../libs/logger';
import { getTransaction } from '../libs/utils';
import { CustomerSchema, VerifyLogin } from '../libs/schemas';

export const registerCurstomer = async (req, res) => {
  const trx = await getTransaction(db);
  try {
    const { error, value: data } = CustomerSchema.validate(req.body);
    if (error) {
      await trx.rollback(error);
      return res.badRequest(error.message);
    }

    const { name, email, phone, address, password: pass } = data;

    const [alredyExistingCustomer] = await db('customers')
      .transacting(trx)
      .select('*')
      .where({ email });

    if (alredyExistingCustomer) {
      await trx.rollback(new Error('this customer alreay exist'));
      return res.badRequest('this customer alreay exist');
    }

    const [newCustomer] = await db('customers')
      .transacting(trx)
      .insert({
        name,
        email,
        phone,
        password: bcrypt.hashSync(pass, 8)
      })
      .returning('*');

    if (address) {
      await db('addresses').transacting(trx).insert({
        customerId: newCustomer.id,
        streetAddress: address.streetAddress,
        locality: address.locality,
        postalCode: address.postalCode,
        city: address.city,
        state: address.state,
        country: address.country
      });
    }

    await trx.commit();
    return res.ok('registration successfull');
  } catch (error) {
    await trx.rollback(error);
    logger.error(`[registerCustomer] error: ${error.stack}`);
    return res.internalServerError();
  }
};

export const customerLogin = async (req, res) => {
  const trx = await getTransaction(db);
  try {
    const { error, value: data } = VerifyLogin.validate(req.body);

    if (error) {
      await trx.rollback(error);
      return res.badRequest(error.message);
    }

    const { email, password } = data;

    const [customerData] = await db('customers')
      .transacting(trx)
      .select('*')
      .where({ email });

    if (!customerData) {
      await trx.rollback(new Error('no Customer found'));
      return res.badRequest('No customer found');
    }

    if (!bcrypt.compareSync(password, customerData.password)) {
      await trx.rollback(new Error('Wronhg Password'));
      return res.badRequest('Wrong password');
    }

    const payload = {
      customerId: customerData.id,
      name: customerData.name,
      email: email,
      type: 'customer'
    };

    const token = jwt.sign(payload, config.jwt.secret);

    await db('customer_tokens')
      .transacting(trx)
      .delete()
      .where({ customerId: customerData.id });

    await db('customer_tokens').transacting(trx).insert({
      customerId: customerData.id,
      token
    });

    await trx.commit();
    return res.ok({ token, message: 'login success' });
  } catch (error) {
    await trx.rollback(error);
    logger.error(`[customerLogin] error: ${error.stack}`);
    return res.internalServerError();
  }
};
