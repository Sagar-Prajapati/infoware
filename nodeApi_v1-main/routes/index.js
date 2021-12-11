import express from 'express';

import customer from './v1/customer';
import owner from './v1/owner';
import products from './v1/products';
import orders from './v1/orders';

const router = express.Router();

router.use('/customer', customer);
router.use('/owner', owner);
router.use('/products', products);
router.use('/orders', orders);

export default router;
