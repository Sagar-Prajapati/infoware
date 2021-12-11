import db from '../db';
import logger from '../libs/logger';
import { getTransaction } from '../libs/utils';
import { BrowseProducts, ProductSchema } from '../libs/schemas';

export const addProduct = async (req, res) => {
  const trx = await getTransaction(db);
  try {
    const { error, value: data } = ProductSchema.validate(req.body);
    if (error) {
      await trx.rollback(error);
      return res.badRequest(error.message);
    }

    const { name, sku, categoryId, description, currency, unitPrice } = data;

    const [alredyExistingProduct] = await db('products')
      .transacting(trx)
      .select('*')
      .where({ sku });

    if (alredyExistingProduct) {
      await trx.rollback(new Error('this product already exist'));
      return res.badRequest('this product already exist');
    }

    const [verifyCategoty] = await db('product_categories')
      .transacting(trx)
      .select('*')
      .where({ id: categoryId });

    if (!verifyCategoty) {
      await trx.rollback(new Error('this category not found'));
      return res.badRequest('this category not found');
    }

    await db('products').transacting(trx).insert({
      name,
      sku,
      categoryId,
      description,
      currency,
      unitPrice
    });

    await trx.commit();
    return res.ok('product added');
  } catch (error) {
    await trx.rollback(error);
    logger.error(`[addProduct] error: ${error.stack}`);
    return res.internalServerError();
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await db('products')
      .select('products.*', 'product_categories.category as category')
      .leftJoin(
        'product_categories',
        'product_categories.id',
        'products.categoryId'
      );
    return res.ok(products);
  } catch (error) {
    logger.error(`[getProducts] error: ${error.stack}`);
    return res.internalServerError();
  }
};

export const browseProducts = async (req, res) => {
  try {
    const { error, value: data } = BrowseProducts.validate(req.query);
    if (error) {
      await trx.rollback(error);
      return res.badRequest(error.message);
    }

    const { id, name, categoryId } = data;

    const query = `${id ? `products.id = ${id}` : ''}
    ${name ? `products."name" ilike '%${name}%'` : ''}
    ${categoryId ? `products."categoryId"=${categoryId}` : ''}`;

    const products = await db('products')
      .select('products.*', 'product_categories.category as category')
      .leftJoin(
        'product_categories',
        'product_categories.id',
        'products.categoryId'
      )
      .where(db.raw(query));

    return res.ok(products);
  } catch (error) {
    logger.error(`[browseProducts] error: ${error.stack}`);
    return res.internalServerError();
  }
};
