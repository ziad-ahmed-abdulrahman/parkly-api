import express from 'express';
import {
    getMe,
    editMe,
    deleteMe,
    changePassword,
    getAllUsers,
    getSingleUser,
    createUser,
    editUser,
    deleteUser
} from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorize from '../middlewares/authorizeMiddleware.js';
import rateLimiterMiddleware from '../middlewares/rateLimiterMiddleware.js';
import validate from '../middlewares/validate.js';
import {
    userIdValidation,
    editMeValidation,
    changePasswordValidation,
    createUserValidation,
    editUserValidation,
    getAllUsersValidation
} from '../validators/user.validator.js';

const userRoute = express.Router();

userRoute.get('/me', authMiddleware, getMe);
userRoute.patch('/me', authMiddleware, editMeValidation, validate, editMe);
userRoute.delete('/me', authMiddleware, deleteMe);
userRoute.patch('/me/password', authMiddleware, rateLimiterMiddleware(300, 5), changePasswordValidation, validate, changePassword);

userRoute.get('/', authMiddleware, authorize('manager'), getAllUsersValidation, validate, getAllUsers);
userRoute.get('/:id', authMiddleware, authorize('manager'), userIdValidation, validate, getSingleUser);
userRoute.post('/', authMiddleware, authorize('manager'), createUserValidation, validate, createUser);
userRoute.patch('/:id', authMiddleware, authorize('manager'), editUserValidation, validate, editUser);
userRoute.delete('/:id', authMiddleware, authorize('manager'), userIdValidation, validate, deleteUser);

export default userRoute;