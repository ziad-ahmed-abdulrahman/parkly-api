import { body, param, query } from 'express-validator';

export const garageIdValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid garage ID format')
];

export const createGarageValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Garage name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Garage name must be between 3 and 100 characters'),
    body('address')
        .trim()
        .notEmpty()
        .withMessage('Address is required')
        .isLength({ max: 300 })
        .withMessage('Address cannot exceed 300 characters'),
    body('location')
        .notEmpty()
        .withMessage('Location is required')
        .isObject()
        .withMessage('Location must be an object'),
    body('location.type')
        .notEmpty()
        .withMessage('Location type is required')
        .equals('Point')
        .withMessage('Location type must be Point'),
    body('location.coordinates')
        .isArray({ min: 2, max: 2 })
        .withMessage('Location coordinates must be an array of [longitude, latitude]'),
    body('location.coordinates.*')
        .isNumeric()
        .withMessage('Coordinates must be numbers'),
    body('capacity')
        .notEmpty()
        .withMessage('Capacity is required')
        .isInt({ min: 1 })
        .withMessage('Capacity must be an integer of at least 1'),
    body('availableSpaces')
        .notEmpty()
        .withMessage('Available spaces is required')
        .isInt({ min: 0 })
        .withMessage('Available spaces must be a non-negative integer')
        .custom((value, { req }) => {
            if (req.body.capacity !== undefined && value > req.body.capacity) {
                throw new Error('Available spaces cannot exceed capacity');
            }
            return true;
        }),
    body('pricePerHour')
        .notEmpty()
        .withMessage('Price per hour is required')
        .isFloat({ min: 0 })
        .withMessage('Price per hour must be a non-negative number'),
    body('ownerId')
        .optional()
        .isMongoId()
        .withMessage('Invalid ownerId format')
];

export const editGarageValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid garage ID format'),
    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Garage name cannot be empty')
        .isLength({ min: 3, max: 100 })
        .withMessage('Garage name must be between 3 and 100 characters'),
    body('address')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Address cannot be empty')
        .isLength({ max: 300 })
        .withMessage('Address cannot exceed 300 characters'),
    body('location')
        .optional()
        .isObject()
        .withMessage('Location must be an object'),
    body('location.type')
        .optional()
        .equals('Point')
        .withMessage('Location type must be Point'),
    body('location.coordinates')
        .optional()
        .isArray({ min: 2, max: 2 })
        .withMessage('Location coordinates must be an array of [longitude, latitude]'),
    body('location.coordinates.*')
        .optional()
        .isNumeric()
        .withMessage('Coordinates must be numbers'),
    body('capacity')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Capacity must be an integer of at least 1'),
    body('availableSpaces')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Available spaces must be a non-negative integer'),
    body('pricePerHour')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Price per hour must be a non-negative number')
];

export const updateAvailableSpacesValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid garage ID format'),
    body('availableSpaces')
        .notEmpty()
        .withMessage('availableSpaces is required')
        .isInt({ min: 0 })
        .withMessage('Available spaces must be a non-negative integer')
];

export const searchGaragesValidation = [
    query('longitude')
        .notEmpty()
        .withMessage('longitude is required')
        .isFloat({ min: -180, max: 180 })
        .withMessage('longitude must be between -180 and 180'),
    query('latitude')
        .notEmpty()
        .withMessage('latitude is required')
        .isFloat({ min: -90, max: 90 })
        .withMessage('latitude must be between -90 and 90'),
    query('maxDistance')
        .optional()
        .isFloat({ min: 1, max: 50000 })
        .withMessage('maxDistance must be between 1 and 50000 meters'),
    query('minAvailableSpaces')
        .optional()
        .isInt({ min: 0 })
        .withMessage('minAvailableSpaces must be a non-negative integer'),
    query('maxPricePerHour')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('maxPricePerHour must be a non-negative number'),
    query('minRating')
        .optional()
        .isFloat({ min: 0, max: 5 })
        .withMessage('minRating must be between 0 and 5')
];
