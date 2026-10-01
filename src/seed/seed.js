import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dns from 'node:dns';

import User from '../models/user.js';
import Garage from '../models/garage.js';
import Review from '../models/review.js';

dns.setServers(['1.1.1.1']);

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: 'parkly' });

        console.log('Database connected');

        await User.deleteMany({});
        await Garage.deleteMany({});
        await Review.deleteMany({});

        // =========================
        // Owner
        // =========================

        const ownerPassword =
            await bcrypt.hash(
                process.env.SEED_OWNER_PASSWORD,
                10
            );

        const owner = await User.create({
            firstName:
                process.env.SEED_OWNER_FIRST_NAME,

            lastName:
                process.env.SEED_OWNER_LAST_NAME,

            email:
                process.env.SEED_OWNER_EMAIL,

            password: ownerPassword,

            role: 'owner',

            isVerified: true
        });

        // =========================
        // Manager
        // =========================

        const managerPassword =
            await bcrypt.hash(
                process.env.SEED_MANAGER_PASSWORD,
                10
            );

        const manager = await User.create({
            firstName:
                process.env.SEED_MANAGER_FIRST_NAME,

            lastName:
                process.env.SEED_MANAGER_LAST_NAME,

            email:
                process.env.SEED_MANAGER_EMAIL,

            password: managerPassword,

            role: 'manager',

            isVerified: true
        });

        // =========================
        // Garage
        // =========================

        const garage = await Garage.create({
            ownerId: owner._id,

            name:
                process.env.SEED_GARAGE_NAME,

            address:
                process.env.SEED_GARAGE_ADDRESS,

            location: {
                type: 'Point',

                coordinates: [
                    Number(
                        process.env.SEED_GARAGE_LONGITUDE
                    ),

                    Number(
                        process.env.SEED_GARAGE_LATITUDE
                    )
                ]
            },

            capacity:
                Number(
                    process.env.SEED_GARAGE_CAPACITY
                ),

            availableSpaces:
                Number(
                    process.env.SEED_GARAGE_AVAILABLE_SPACES
                ),

            pricePerHour:
                Number(
                    process.env.SEED_GARAGE_PRICE_PER_HOUR
                )
        });

        // =========================
        // Review
        // =========================

        const rating =
            Number(
                process.env.SEED_REVIEW_RATING
            );

        const review = await Review.create({
            garageId: garage._id,

            rating,

            comment:
                process.env.SEED_REVIEW_COMMENT,

            ipAddress:
                process.env.SEED_REVIEW_IP
        });

        // =========================
        // Update Garage Rating
        // =========================

        garage.totalReviews = 1;
        garage.averageRating = rating;

        await garage.save();

        console.log('Seed completed successfully');

        console.log({
            ownerId: owner._id,
            managerId: manager._id,
            garageId: garage._id,
            reviewId: review._id
        });

    } catch (error) {
        console.error('Seed failed:', error);

    } finally {
        await mongoose.disconnect();

        console.log('Database disconnected');
    }
};

seed();