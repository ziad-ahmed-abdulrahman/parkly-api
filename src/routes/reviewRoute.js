import express from 'express';
import {
    createReview,
    getGarageReviews,
    getSingleReview,
    editReview,
    deleteReview
} from '../controllers/review.controller.js';
import rateLimiterMiddleware from '../middlewares/rateLimiterMiddleware.js';
import validate from '../middlewares/validate.js';
import {
    createReviewValidation,
    editReviewValidation,
    reviewGarageParamValidation,
    reviewIdValidation
} from '../validators/review.validator.js';

const reviewRoute = express.Router();

reviewRoute.post('/', rateLimiterMiddleware(300, 5), createReviewValidation, validate, createReview);
reviewRoute.get('/garage/:garageId', reviewGarageParamValidation, validate, getGarageReviews);
reviewRoute.get('/:id', reviewIdValidation, validate, getSingleReview);
reviewRoute.patch('/garage/:garageId', rateLimiterMiddleware(300, 5), editReviewValidation, validate, editReview);
reviewRoute.delete('/garage/:garageId', rateLimiterMiddleware(300, 5), reviewGarageParamValidation, validate, deleteReview);

export default reviewRoute;
