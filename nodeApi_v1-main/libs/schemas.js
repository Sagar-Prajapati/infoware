import Joi from '@hapi/joi';

/***********Customer schema*********/
export const CustomerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  password: Joi.string().required(),
  address: Joi.object({
    streetAddress: Joi.string(),
    locality: Joi.string(),
    postalCode: Joi.number(),
    city: Joi.string(),
    state: Joi.string(),
    country: Joi.string()
  })
});

/**********verify login schema *************/
export const VerifyLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

/**********Owner schema **********/

export const OwnerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  role: Joi.string().valid('admin', 'owner', 'manager'),
  password: Joi.string().required()
});

/**************Product schema *******/

export const CategorySchema = Joi.object({
  category: Joi.string().required(),
  description: Joi.string()
});

export const ProductSchema = Joi.object({
  name: Joi.string().required(),
  sku: Joi.string().required(),
  categoryId: Joi.number().required(),
  description: Joi.string(),
  currency: Joi.string(),
  unitPrice: Joi.number().required()
});

export const BrowseProducts = Joi.object({
  id: Joi.number(),
  name: Joi.string(),
  categoryId: Joi.number()
});

/********order schema******/
export const OrderSchema = Joi.object({
  productId: Joi.number().required(),
  customerId: Joi.number().required(),
  addressId: Joi.number().required(),
  quantity: Joi.number().required(),
  discountApplied: Joi.number(),
  totalAmount: Joi.number()
});
