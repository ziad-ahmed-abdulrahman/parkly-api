import express from 'express';
import {
    createGarage,
    getAllGarages,
    getSingleGarage,
    editGarage,
    deleteGarage,
    updateAvailableSpaces,
    getMyGarages,
    searchGarages
} from '../controllers/garage.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorize from '../middlewares/authorizeMiddleware.js';
import rateLimiterMiddleware from '../middlewares/rateLimiterMiddleware.js';
import validate from '../middlewares/validate.js';
import {
    garageIdValidation,
    createGarageValidation,
    editGarageValidation,
    updateAvailableSpacesValidation,
    searchGaragesValidation
} from '../validators/garage.validator.js';

const garageRoute = express.Router();

garageRoute.get('/search', rateLimiterMiddleware(60, 30), searchGaragesValidation, validate, searchGarages);
garageRoute.get('/', getAllGarages);
garageRoute.get('/my', authMiddleware, authorize('owner'), getMyGarages);
garageRoute.get('/:id', garageIdValidation, validate, getSingleGarage);

garageRoute.post('/', authMiddleware, authorize('owner', 'manager'), createGarageValidation, validate, createGarage);
garageRoute.patch('/:id', authMiddleware, authorize('owner', 'manager'), editGarageValidation, validate, editGarage);
garageRoute.patch('/:id/available-spaces', authMiddleware, authorize('owner', 'manager'), updateAvailableSpacesValidation, validate, updateAvailableSpaces);
garageRoute.delete('/:id', authMiddleware, authorize('owner', 'manager'), garageIdValidation, validate, deleteGarage);

export default garageRoute;