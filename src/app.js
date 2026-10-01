import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import dns from 'node:dns';

import httpStatusText from './utils/httpStatusText.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import garageRoute from './routes/garageRoute.js';
import reviewRoute from './routes/reviewRoute.js';

dotenv.config();
dns.setServers(['1.1.1.1']);

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/garages', garageRoute);
app.use('/api/reviews', reviewRoute);

app.use((req, res) => {
    return res.status(404).json({
        status: httpStatusText.ERROR,
        message: `Route ${req.originalUrl} not found`,
        data: null,
        code: 404
    });
});

try {
    await mongoose.connect(process.env.MONGO_URI, {
        dbName: 'parkly'
    });
    console.log('Database connected successfully');
} catch (error) {
    console.log('Database connection error : ', error.message);
}

app.use((err, req, res, next) => {
    if (err.name === 'CastError') {
        return res.status(400).json({
            status: httpStatusText.FAIL,
            message: `Invalid ${err.path}: ${err.value}`,
            data: null,
            code: 400
        });
    }

    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message).join(', ');
        return res.status(400).json({
            status: httpStatusText.FAIL,
            message: messages,
            data: null,
            code: 400
        });
    }

    if (err.code === 11000) {
        return res.status(409).json({
            status: httpStatusText.FAIL,
            message: 'Duplicate key error: value already exists',
            data: null,
            code: 409
        });
    }

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            status: httpStatusText.FAIL,
            message: 'Invalid JSON payload',
            data: null,
            code: 400
        });
    }

    return res.status(500).json({
        status: httpStatusText.ERROR,
        message: err.message,
        data: null,
        code: 500
    });
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`Listening on port ${process.env.PORT || 5000}`);
});
