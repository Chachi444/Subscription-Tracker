import { Router } from 'express';
import { signUp, signIn } from '../controllers/auth.controller.js ';

const authRouter = Router();

//path: /api/v1/auth/sign-up
authRouter.post('/sign-up', signUp);
//path: /api/v1/auth/sign-in
authRouter.post('/sign-in', signIn);
//path: /api/v1/auth/sign-out
//authRouter.post('/sign-out', signOut);

//signIn, signOut

export default authRouter;