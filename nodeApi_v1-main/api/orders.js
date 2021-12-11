import db from '../db';
import logger from '../libs/logger';
import { getTransaction, getRandomString } from '../libs/utils';
import { OrderSchema } from '../libs/schemas';

export const newOrder = async (req, res) => {
  const trx = await getTransaction(db);
  try {
    const { error, value: data } = OrderSchema.validate(req.body);
    if (error) {
      await trx.rollback(error);
      return res.badRequest(error.message);
    }

    const {
      productId,
      customerId,
      addressId,
      quantity,
      discountApplied,
      totalAmount
    } = data;

    const [productData] = await db('products')
      .transacting(trx)
      .select('*')
      .where({ id: productId });

    if (!productData) {
      await trx.rollback(new Error('this product not found'));
      return res.badRequest('this product not found');
    }

    const [customerData] = await db('customers')
      .transacting(trx)
      .select('*')
      .where({ id: customerId });

    if (!customerData) {
      await trx.rollback(new Error('this customer not found'));
      return res.badRequest('this customer not found');
    }

    const [addressData] = await db('addresses')
      .transacting(trx)
      .select('*')
      .where({ id: addressId, customerId });

    if (!addressData) {
      await trx.rollback(new Error('not a valid address'));
      return res.badRequest('not a valid address');
    }

    const todaysDate = new Date();
    const orderId = `${todaysDate.getFullYear()}${
      todaysDate.getMonth() + 1
    }${todaysDate.getDate()}${getRandomString(5)}`;

    await db('orders').transacting(trx).insert({
      orderId,
      productId,
      customerId,
      addressId,
      quantity,
      discountApplied,
      totalAmount
    });

    await trx.commit();
    return res.ok('order placed');
  } catch (error) {
    await trx.rollback(error);
    logger.error(`[newOrder] error: ${error.stack}`);
    return res.internalServerError();
  }
};

export const getorders = async (req, res) => {
  try {
    const orders = await db('orders').select(
      'orders.*',
      db.raw(`
        (
          SELECT row_to_json(c) FROM 
          (
            SELECT *
            FROM products
            WHERE products.id = orders."productId"
          ) c
        ) 
        "product"`),
      db.raw(`
        (
          SELECT row_to_json(c) FROM 
          (
            SELECT id,name,email,phone
            FROM customers
            WHERE customers.id = orders."customerId"
          ) c
        ) 
        "customer"`),
      db.raw(`
        (
          SELECT row_to_json(c) FROM 
          (
            SELECT *
            FROM addresses
            WHERE addresses.id = orders."addressId"
          ) c
        ) 
        "address"`)
    );

    return res.ok(orders);
  } catch (error) {
    logger.error(`[getOrders] error: ${error.stack}`);
    return res.internalServerError();
  }
};

export const getOrderByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.params;

    const orders = await db('orders')
      .select(
        'orders.*',
        db.raw(`
        (
          SELECT row_to_json(c) FROM 
          (
            SELECT *
            FROM products
            WHERE products.id = orders."productId"
          ) c
        ) 
        "product"`),
        db.raw(`
        (
          SELECT row_to_json(c) FROM 
          (
            SELECT id,name,email,phone
            FROM customers
            WHERE customers.id = orders."customerId"
          ) c
        ) 
        "customer"`),
        db.raw(`
        (
          SELECT row_to_json(c) FROM 
          (
            SELECT *
            FROM addresses
            WHERE addresses.id = orders."addressId"
          ) c
        ) 
        "address"`)
      )
      .where({ customerId });

    return res.ok(orders);
  } catch (error) {
    logger.error(`[getOrderByCustomerId] error: ${error.stack}`);
    return res.internalServerError();
  }
};
