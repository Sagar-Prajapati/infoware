import express from 'express';
import { customerLogin, registerCurstomer } from '../../api/customer';
import { browseProducts } from '../../api/products';
import { getOrderByCustomerId } from '../../api/orders';

import { isLoggedIn } from '../../libs/middlewares/auth_checker';

const router = express.Router();

router.post('/register', registerCurstomer);
router.post('/login', customerLogin);

router.get('/product', isLoggedIn, browseProducts);
router.get('/orders/:customerId', isLoggedIn, getOrderByCustomerId);

export default router;
