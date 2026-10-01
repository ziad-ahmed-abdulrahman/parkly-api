import { body, param } from 'express-validator';

export const createReviewValidation = [
    body('garageId')
        .notEmpty()
        .withMessage('garageId is required')
        .isMongoId()
        .withMessage('Invalid garageId format'),
    body('rating')
        .notEmpty()
        .withMessage('rating is required')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be an integer between 1 and 5'),
    body('comment')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Comment cannot exceed 500 characters')
];

export const editReviewValidation = [
    param('garageId')
        .isMongoId()
        .withMessage('Invalid garageId format'),
    body('rating')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be an integer between 1 and 5'),
    body('comment')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Comment cannot exceed 500 characters')
];

export const reviewGarageParamValidation = [
    param('garageId')
        .isMongoId()
        .withMessage('Invalid garageId format')
];

export const reviewIdValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid review ID format')
];
