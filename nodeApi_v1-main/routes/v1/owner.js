import express from 'express';
import { registerOwner, ownerLogin } from '../../api/owner';
import { addProduct, getProducts } from '../../api/products';

import { isLoggedIn } from '../../libs/middlewares/auth_checker';

const router = express.Router();

router.post('/register', registerOwner);
router.post('/login', ownerLogin);
router.post('/product', isLoggedIn, addProduct);
router.get('/products', isLoggedIn, getProducts);

export default router;
