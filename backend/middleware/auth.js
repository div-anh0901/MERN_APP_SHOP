const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('./catchAsyncError');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
exports.isAuthenticatiedUser = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("PLease Login to access this resurce", 401));
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decode.id);
    next();
});

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resouce `,
                    403
                )
            );
        }
        next();
    };
};
