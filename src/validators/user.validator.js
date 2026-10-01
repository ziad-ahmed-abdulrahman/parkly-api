import { body, param, query } from 'express-validator';

export const userIdValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid user ID format')
];

export const editMeValidation = [
    body('firstName')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('First name cannot be empty')
        .isLength({ min: 3, max: 100 })
        .withMessage('First name must be between 3 and 100 characters'),
    body('lastName')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Last name cannot be empty')
        .isLength({ min: 3, max: 100 })
        .withMessage('Last name must be between 3 and 100 characters')
];

export const changePasswordValidation = [
    body('oldPassword')
        .notEmpty()
        .withMessage('Old password is required'),
    body('newPassword')
        .notEmpty()
        .withMessage('New password is required')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
];

export const createUserValidation = [
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('First name must be between 3 and 100 characters'),
    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Last name must be between 3 and 100 characters'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('role')
        .notEmpty()
        .withMessage('Role is required')
        .isIn(['owner', 'manager'])
        .withMessage('Role must be either owner or manager')
];

export const editUserValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid user ID format'),
    body('firstName')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('First name cannot be empty')
        .isLength({ min: 3, max: 100 })
        .withMessage('First name must be between 3 and 100 characters'),
    body('lastName')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Last name cannot be empty')
        .isLength({ min: 3, max: 100 })
        .withMessage('Last name must be between 3 and 100 characters'),
    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('role')
        .optional()
        .isIn(['owner', 'manager'])
        .withMessage('Role must be either owner or manager'),
    body('isVerified')
        .optional()
        .isBoolean()
        .withMessage('isVerified must be a boolean')
];

export const getAllUsersValidation = [
    query('role')
        .optional()
        .isIn(['owner', 'manager'])
        .withMessage('Role must be either owner or manager'),
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be an integer of at least 1'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be an integer between 1 and 100'),
    query('sort')
        .optional()
        .isIn(['firstName', 'lastName', 'email', 'createdAt'])
        .withMessage('Invalid sort field')
];
