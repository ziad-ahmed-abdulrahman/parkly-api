import User from '../models/user.js';
import sendEmail from '../services/emailService.js';
import httpStatusText from '../utils/httpStatusText.js';
import bcrypt from 'bcrypt';

const getMe = async (req, res) => {
    const user = await User.findById(req.user.id, {
        password: false,
        code: false,
        codeOperation: false,
        codeExpiresAt: false,
        __v: false
    });

    if (!user) {
        return res.status(404).json({
            status: httpStatusText.FAIL,
            data: null
        });
    }

    return res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: user
    });
};

const editMe = async (req, res) => {
    const { firstName, lastName } = req.body;

    const user = await User.findByIdAndUpdate(
        req.user.id,
        { firstName, lastName },
        {
            returnDocument: 'after',
            runValidators: true,
            projection: {
                password: false,
                code: false,
                codeOperation: false,
                codeExpiresAt: false,
                __v: false
            }
        }
    );

    if (!user) {
        return res.status(404).json({
            status: httpStatusText.FAIL,
            data: null
        });
    }

    return res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: user
    });
};

const deleteMe = async (req, res) => {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
        return res.status(404).json({
            status: httpStatusText.FAIL,
            data: null
        });
    }

    return res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: null
    });
};

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
        return res.status(404).json({
            status: httpStatusText.FAIL,
            data: null
        });
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({
            status: httpStatusText.FAIL,
            message: 'Old password is incorrect',
            data: null
        });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await sendEmail(
        user.email,
        'Password Changed Successfully',
        `Hello ${user.firstName},\n\nYour password has been changed successfully.\n\nIf you did not make this change, please contact support immediately.\n`
    );

    return res.status(200).json({
        status: httpStatusText.SUCCESS,
        message: 'Password changed successfully',
        data: null
    });
};

const getAllUsers = async (req, res) => {
    const { search, role, page = 1, limit = 10, sort = 'firstName' } = req.query;
    const filter = {};

    if (search) {
        filter.$or = [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }

    if (role) {
        if (!['owner', 'manager'].includes(role)) {
            return res.status(400).json({
                status: httpStatusText.FAIL,
                message: 'Invalid role',
                data: null
            });
        }
        filter.role = role;
    }

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);
    const allowedSortFields = ['firstName', 'lastName', 'email', 'createdAt'];

    if (!allowedSortFields.includes(sort)) {
        return res.status(400).json({
            status: httpStatusText.FAIL,
            message: 'Invalid sort field',
            data: null
        });
    }

    const skip = (pageNumber - 1) * limitNumber;

    const [users, totalUsers] = await Promise.all([
        User.find(filter, {
            password: false,
            code: false,
            codeOperation: false,
            codeExpiresAt: false,
            __v: false
        })
            .sort(sort)
            .skip(skip)
            .limit(limitNumber),
        User.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalUsers / limitNumber);

    return res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: users,
        pagination: {
            currentPage: pageNumber,
            limit: limitNumber,
            totalUsers,
            totalPages,
            hasNextPage: pageNumber < totalPages,
            hasPreviousPage: pageNumber > 1
        }
    });
};

const getSingleUser = async (req, res) => {
    const user = await User.findById(req.params.id, {
        password: false,
        code: false,
        codeOperation: false,
        codeExpiresAt: false,
        __v: false
    });

    if (!user) {
        return res.status(404).json({
            status: httpStatusText.FAIL,
            data: null
        });
    }

    return res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: user
    });
};

const createUser = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    const existingUser = await User.exists({ email });
    if (existingUser) {
        return res.status(409).json({
            status: httpStatusText.FAIL,
            message: 'Email already exists',
            data: null
        });
    }

    if (!['owner', 'manager'].includes(role)) {
        return res.status(400).json({
            status: httpStatusText.FAIL,
            message: 'Invalid role',
            data: null
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        isVerified: false
    });

    return res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified
        }
    });
};

const editUser = async (req, res) => {
    const { firstName, lastName, email, password, role, isVerified } = req.body;
    const updateData = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (password !== undefined) updateData.password = await bcrypt.hash(password, 10);

    if (role !== undefined) {
        if (!['owner', 'manager'].includes(role)) {
            return res.status(400).json({
                status: httpStatusText.FAIL,
                message: 'Invalid role',
                data: null
            });
        }
        updateData.role = role;
    }

    if (isVerified !== undefined) updateData.isVerified = isVerified;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
        returnDocument: 'after',
        runValidators: true,
        projection: {
            password: false,
            code: false,
            codeOperation: false,
            codeExpiresAt: false,
            __v: false
        }
    });

    if (!user) {
        return res.status(404).json({
            status: httpStatusText.FAIL,
            data: null
        });
    }

    return res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: user
    });
};

const deleteUser = async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        return res.status(404).json({
            status: httpStatusText.FAIL,
            data: null
        });
    }

    return res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: null
    });
};

export {
    getMe,
    editMe,
    deleteMe,
    changePassword,
    getAllUsers,
    getSingleUser,
    createUser,
    editUser,
    deleteUser
};