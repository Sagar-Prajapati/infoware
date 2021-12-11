import express from 'express';

import { addProduct, browseProducts, getProducts } from '../../api/products';

import { isLoggedIn } from '../../libs/middlewares/auth_checker';

const router = express.Router();

router.post('/', isLoggedIn, addProduct);
router.get('/browse', isLoggedIn, browseProducts);
router.get('/', isLoggedIn, getProducts);

export default router;
