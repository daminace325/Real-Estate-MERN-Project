import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';


export const adminDashboard = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return next(errorHandler(401, 'Unauthorized'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const validUser = await User.findById(decoded.id);

        if (!validUser || !validUser.isAdmin) {
            return next(errorHandler(403, 'Access Denied!'));
        }

        const users = await User.find({ _id: { $ne: validUser._id } }, '-password');

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}