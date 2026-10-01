import Review from '../models/review.js';
import Garage from '../models/garage.js';
import httpStatusText from '../utils/httpStatusText.js';

const createReview = async (req, res) => {
    const { garageId, rating, comment } = req.body;
    const numericRating = Number(rating);

    if (rating === undefined || isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
        return res.status(400).json({
            status: httpStatusText.FAIL,
            message: 'Rating must be a number between 1 and 5',
            data: null
        });
    }

    const garage = await Garage.findById(garageId);
    if (!garage) {
        return res.status(404).json({
            status: httpStatusText.FAIL,
            message: 'Garage not found',
            data: null
        });
    }

    const ipAddress = req.ip;
    const existingReview = await Review.findOne({ garageId, ipAddress });
    if (existingReview) {
        return res.status(409).json({
            status: httpStatusText.FAIL,
            message: 'You have already reviewed this garage',
            data: null
        });
    }

    const review = await Review.create({
        garageId,
        ipAddress,
        rating: numericRating,
        comment
    });

    const totalReviews = garage.totalReviews + 1;
    const newAverageRating = (garage.averageRating * garage.totalReviews + numericRating) / totalReviews;

    garage.totalReviews = totalReviews;
    garage.averageRating = Number(newAverageRating.toFixed(2));
    await garage.save();

    return res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: review
    });
};

const getGarageReviews = async (req, res) => {
    const { garageId } = req.params;

    const garage = await Garage.exists({ _id: garageId });
    if (!garage) {
        return res.status(404).json({
            status: httpStatusText.FAIL,
            message: 'Garage not found',
            data: null
        });
    }

    const reviews = await Review.find({ garageId }, { __v: false, ipAddress: false }).sort({ createdAt: -1 });

    return res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: reviews
    });
};

const getSingleReview = async (req, res) => {
    const review = await Review.findById(req.params.id, { __v: false, ipAddress: false });
    if (!review) {
        return res.status(404).json({
            status: httpStatusText.FAIL,
            message: 'Review not found',
            data: null
        });
    }

    return res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: review
    });
};

const editReview = async (req, res) => {
    const { rating, comment } = req.body;
    const { garageId } = req.params;
    const ipAddress = req.ip;

    const review = await Review.findOne({ garageId, ipAddress });
    if (!review) {
        return res.status(404).json({
            status: httpStatusText.FAIL,
            message: 'Review not found',
            data: null
        });
    }

    const oldRating = review.rating;

    if (rating !== undefined) {
        const numericRating = Number(rating);
        if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({
                status: httpStatusText.FAIL,
                message: 'Rating must be a number between 1 and 5',
                data: null
            });
        }
        review.rating = numericRating;
    }

    review.comment = comment ?? review.comment;
    await review.save();

    if (rating !== undefined) {
        const garage = await Garage.findById(garageId);
        if (garage && garage.totalReviews > 0) {
            const newAverageRating = (garage.averageRating * garage.totalReviews - oldRating + review.rating) / garage.totalReviews;
            garage.averageRating = Number(newAverageRating.toFixed(2));
            await garage.save();
        }
    }

    return res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: review
    });
};

const deleteReview = async (req, res) => {
    const { garageId } = req.params;
    const ipAddress = req.ip;

    const review = await Review.findOne({ garageId, ipAddress });
    if (!review) {
        return res.status(404).json({
            status: httpStatusText.FAIL,
            message: 'Review not found',
            data: null
        });
    }

    const garage = await Garage.findById(garageId);
    await review.deleteOne();

    if (garage) {
        const reviews = await Review.find({ garageId });
        garage.totalReviews = reviews.length;

        if (reviews.length === 0) {
            garage.averageRating = 0;
        } else {
            const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
            garage.averageRating = Number((totalRating / reviews.length).toFixed(2));
        }

        await garage.save();
    }

    return res.status(200).json({
        status: httpStatusText.SUCCESS,
        message: 'Review deleted successfully',
        data: null
    });
};

export {
    createReview,
    getGarageReviews,
    getSingleReview,
    editReview,
    deleteReview
};