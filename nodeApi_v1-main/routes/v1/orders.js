import express from 'express';

import { newOrder, getorders } from '../../api/orders';

import { isLoggedIn } from '../../libs/middlewares/auth_checker';

const router = express.Router();

router.post('/', isLoggedIn, newOrder);
router.get('/', isLoggedIn, getorders);

export default router;
