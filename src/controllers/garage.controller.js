import Garage from '../models/garage.js';
import User from '../models/user.js';
import Review from '../models/review.js';
import httpStatusText from '../utils/httpStatusText.js';

const createGarage = async (req, res) => {
    const {
        name,
        address,
        location,
        capacity,
        availableSpaces,
        pricePerHour,
        ownerId
    } = req.body;

    let garageOwnerId;

    if (req.user.role === 'owner') {
        garageOwnerId = req.user.id;
    } else if (req.user.role === 'manager') {
        if (!ownerId) {
            return res.status(400).json({
                status: httpStatusText.FAIL,
                message: 'ownerId is required',
                data: null
            });
        }

        const owner = await User.findOne({
            _id: ownerId,
            role: 'owner'
        });

        if (!owner) {
            return res.status(404).json({
                status: httpStatusText.FAIL,
                message: 'Owner not found',
                data: null
            });
        }

        garageOwnerId = owner._id;
    }

    if (availableSpaces < 0 || availableSpaces > capacity) {
        return res.status(400).json({
            status: httpStatusText.FAIL,
            message: 'Available spaces must be between 0 and capacity',
            data: null
        });
    }

    const garage = await Garage.create({
        ownerId: garageOwnerId,
        name,
        address,
        location,
        capacity,
        availableSpaces,
        pricePerHour
    });

    return res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: garage
    });
};

const getAllGarages = async (req, res) => {
    const garages = await Garage.find({}, { __v: false });
    return res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: garages
    });
};

const getSingleGarage = async (req, res) => {
    const garage = await Garage.findById(req.params.id, { __v: false });
    if (!garage) {
        return res.status(404).json({
            status: httpStatusText.FAIL,
            message: 'Garage not found',
            data: null
        });
    }

    return res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: garage
    });
};

const editGarage = async (req, res) => {
    const garage = await Garage.findById(req.params.id);
    if (!garage) {
        return res.status(404).json({
            status: httpStatusText.FAIL,
            message: 'Garage not found',
            data: null
        });
    }

    if (req.user.role === 'owner' && garage.ownerId.toString() !== req.user.id.toString()) {
        return res.status(403).json({
            status: httpStatusText.FAIL,
            message: 'You are not allowed to edit this garage',
            data: null
        });
    }

    const {
        name,
        address,
        location,
        capacity,
        availableSpaces,
        pricePerHour
    } = req.body;

    const newCapacity = capacity ?? garage.capacity;
    const newAvailableSpaces = availableSpaces ?? garage.availableSpaces;

    if (newAvailableSpaces < 0 || newAvailableSpaces > newCapacity) {
        return res.status(400).json({
            status: httpStatusText.FAIL,
            message: 'Available spaces must be between 0 and capacity',
            data: null
        });
    }

    garage.name = name ?? garage.name;
    garage.address = address ?? garage.address;
    garage.location = location ?? garage.location;
    garage.capacity = newCapacity;
    garage.availableSpaces = newAvailableSpaces;
    garage.pricePerHour = pricePerHour ?? garage.pricePerHour;

    await garage.save();

    return res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: garage
    });
};

const deleteGarage = async (req, res) => {
    const garage = await Garage.findById(req.params.id);
    if (!garage) {
        return res.status(404).json({
            status: httpStatusText.FAIL,
            message: 'Garage not found',
            data: null
        });
    }

    if (req.user.role === 'owner' && garage.ownerId.toString() !== req.user.id.toString()) {
        return res.status(403).json({
            status: httpStatusText.FAIL,
            message: 'You are not allowed to delete this garage',
            data: null
        });
    }

    await Review.deleteMany({ garageId: garage._id });
    await garage.deleteOne();

    return res.status(200).json({
        status: httpStatusText.SUCCESS,
        message: 'Garage deleted successfully',
        data: null
    });
};

const updateAvailableSpaces = async (req, res) => {
    const { availableSpaces } = req.body;

    const garage = await Garage.findById(req.params.id);
    if (!garage) {
        return res.status(404).json({
            status: httpStatusText.FAIL,
            message: 'Garage not found',
            data: null
        });
    }

    if (req.user.role === 'owner' && garage.ownerId.toString() !== req.user.id.toString()) {
        return res.status(403).json({
            status: httpStatusText.FAIL,
            message: 'You are not allowed to update this garage',
            data: null
        });
    }

    if (availableSpaces === undefined || availableSpaces === null) {
        return res.status(400).json({
            status: httpStatusText.FAIL,
            message: 'availableSpaces is required',
            data: null
        });
    }

    if (availableSpaces < 0 || availableSpaces > garage.capacity) {
        return res.status(400).json({
            status: httpStatusText.FAIL,
            message: 'Available spaces must be between 0 and garage capacity',
            data: null
        });
    }

    garage.availableSpaces = availableSpaces;
    await garage.save();

    return res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: garage
    });
};

const getMyGarages = async (req, res) => {
    const garages = await Garage.find({ ownerId: req.user.id }, { __v: false });
    return res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: garages
    });
};

const searchGarages = async (req, res) => {
    const {
        longitude,
        latitude,
        maxDistance = 5000,
        minAvailableSpaces,
        maxPricePerHour,
        minRating
    } = req.query;

    if (longitude === undefined || latitude === undefined) {
        return res.status(400).json({
            status: httpStatusText.FAIL,
            message: 'longitude and latitude are required',
            data: null
        });
    }

    const longitudeNumber = Number(longitude);
    const latitudeNumber = Number(latitude);
    const maxDistanceNumber = Number(maxDistance);

    if (
        !Number.isFinite(longitudeNumber) ||
        !Number.isFinite(latitudeNumber) ||
        !Number.isFinite(maxDistanceNumber)
    ) {
        return res.status(400).json({
            status: httpStatusText.FAIL,
            message: 'Invalid location or distance values',
            data: null
        });
    }

    if (longitudeNumber < -180 || longitudeNumber > 180) {
        return res.status(400).json({
            status: httpStatusText.FAIL,
            message: 'Invalid longitude',
            data: null
        });
    }

    if (latitudeNumber < -90 || latitudeNumber > 90) {
        return res.status(400).json({
            status: httpStatusText.FAIL,
            message: 'Invalid latitude',
            data: null
        });
    }

    if (maxDistanceNumber <= 0 || maxDistanceNumber > 50000) {
        return res.status(400).json({
            status: httpStatusText.FAIL,
            message: 'maxDistance must be between 1 and 50000 meters',
            data: null
        });
    }

    const filter = {};

    if (minAvailableSpaces !== undefined) {
        const minAvailableSpacesNumber = Number(minAvailableSpaces);
        if (!Number.isFinite(minAvailableSpacesNumber) || minAvailableSpacesNumber < 0) {
            return res.status(400).json({
                status: httpStatusText.FAIL,
                message: 'Invalid minAvailableSpaces',
                data: null
            });
        }
        filter.availableSpaces = { $gte: minAvailableSpacesNumber };
    }

    if (maxPricePerHour !== undefined) {
        const maxPricePerHourNumber = Number(maxPricePerHour);
        if (!Number.isFinite(maxPricePerHourNumber) || maxPricePerHourNumber < 0) {
            return res.status(400).json({
                status: httpStatusText.FAIL,
                message: 'Invalid maxPricePerHour',
                data: null
            });
        }
        filter.pricePerHour = { $lte: maxPricePerHourNumber };
    }

    if (minRating !== undefined) {
        const minRatingNumber = Number(minRating);
        if (!Number.isFinite(minRatingNumber) || minRatingNumber < 0 || minRatingNumber > 5) {
            return res.status(400).json({
                status: httpStatusText.FAIL,
                message: 'minRating must be between 0 and 5',
                data: null
            });
        }
        filter.averageRating = { $gte: minRatingNumber };
    }

    const garages = await Garage.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [longitudeNumber, latitudeNumber]
                },
                key: 'location',
                distanceField: 'distance',
                maxDistance: maxDistanceNumber,
                spherical: true,
                query: filter
            }
        },
        {
            $project: { __v: 0 }
        }
    ]);

    return res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: garages
    });
};

export {
    createGarage,
    getAllGarages,
    getSingleGarage,
    editGarage,
    deleteGarage,
    updateAvailableSpaces,
    getMyGarages,
    searchGarages
};