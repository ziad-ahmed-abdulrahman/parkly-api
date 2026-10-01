import httpStatusText from '../utils/httpStatusText.js';

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                status: httpStatusText.FAIL,
                message: 'Authentication required',
                data: null
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: httpStatusText.FAIL,
                message: 'You are not allowed to access this resource',
                data: null
            });
        }

        next();
    };
};

export default authorize;