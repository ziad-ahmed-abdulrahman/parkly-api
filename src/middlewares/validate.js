import { validationResult } from 'express-validator';
import httpStatusText from '../utils/httpStatusText.js';

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: httpStatusText.FAIL,
            message: errors.array()[0].msg,
            data: null
        });
    }
    next();
};

export default validate;
