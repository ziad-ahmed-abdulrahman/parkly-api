import jwt from 'jsonwebtoken';
import httpStatusText from '../utils/httpStatusText.js';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            status: httpStatusText.FAIL,
            message: 'Authentication required',
            data: null
        });
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
        return res.status(401).json({
            status: httpStatusText.FAIL,
            message: 'Invalid authorization format',
            data: null
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        next();
    } catch (error) {
        return res.status(401).json({
            status: httpStatusText.FAIL,
            message: 'Invalid or expired token',
            data: null
        });
    }
};

export default authMiddleware;