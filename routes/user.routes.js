import { Router } from 'express';
import { getUser, getUsers } from '../controllers/user.controller.js';
import authorize from '../middlewares/auth.middleware.js';

const userRouter = Router();



userRouter.get('/', getUsers);

// userRouter.put('/profile', (req, res) => res.send({ message: 'Update Profile' }));
userRouter.get('/:id', authorize, getUser);

userRouter.post('/', (req, res) => res.send({ message: 'CREATE new user' }));

userRouter.put('/:id', (req, res) => res.send({ message: 'UPDATE new user by ID' }));

userRouter.delete('/:id', (req, res) => res.send({ message: 'DELETE user by ID' }));

export default userRouter;
