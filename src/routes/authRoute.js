import express from 'express';
import {
    register,
    login,
    sendActivationCode,
    activate,
    sendForgetPasswordCode,
    resetPassword
} from '../controllers/auth.controller.js';
import rateLimiterMiddleware from '../middlewares/rateLimiterMiddleware.js';
import validate from '../middlewares/validate.js';
import {
    registerValidation,
    loginValidation,
    sendActivationCodeValidation,
    activateValidation,
    sendForgetPasswordCodeValidation,
    resetPasswordValidation
} from '../validators/auth.validator.js';

const authRouter = express.Router();

authRouter.post('/register', rateLimiterMiddleware(60, 5), registerValidation, validate, register);
authRouter.post('/login', rateLimiterMiddleware(60, 5), loginValidation, validate, login);
authRouter.post('/send-activation-code', rateLimiterMiddleware(300, 3), sendActivationCodeValidation, validate, sendActivationCode);
authRouter.post('/activate', rateLimiterMiddleware(300, 5), activateValidation, validate, activate);
authRouter.post('/send-forget-password-code', rateLimiterMiddleware(300, 3), sendForgetPasswordCodeValidation, validate, sendForgetPasswordCode);
authRouter.post('/reset-password', rateLimiterMiddleware(300, 5), resetPasswordValidation, validate, resetPassword);

export default authRouter;