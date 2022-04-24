const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto');
//Register user
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: "this is a sample id",
            url: "profilepicUrl"
        }
    });

    const token = user.getJWTToken();
    sendToken(user, 201, res);

});

exports.loginUser = catchAsyncError(
    async (req, res, next) => {

        const { email, password } = req.body;

        //checking if user has given password and email both

        if (!email || !password) {
            return next(new ErrorHandler("Please Enter Email & Password", 400));
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorHandler("Invalid email or password", 401))
        }

        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            return next(new ErrorHandler("Invalid email or password", 401));
        }

        const token = user.getJWTToken();

        sendToken(user, 200, res);
    }
);

//Logout User
exports.logout = catchAsyncError(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logged out"
    });
});


// forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not found", 401));
    }

    // Get ResetPassword Token

    const resetToken = await user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get(
        "host"
    )}/api/v1/password/reset/${resetToken}`;
    const message = `Your passwor reset  token is: -\n\n ${resetPasswordUrl}\n\n you have not request this email
    the, please ignoreit`;


    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message
        });

        res.status(200).json({
            success: true,
            message: `Email send to ${user.email}  successFully`
        })


    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(err.message, 500));
    }
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {

    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler("Reset Password  Token is ivalid or has been expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password dose  not password", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);

});

//GET User Detail
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });

});

//Update User Password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incrorrent", 401));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password dose  not match", 400));
    }
    user.password = req.body.password;

    await user.save();


    sendToken(user, 200, res);
});


// update User Profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }

    //We will add clodinary later
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    });
});

// get all user
exports.getAllUser = catchAsyncError(async (req, res) => {
    const user = await User.find();
    res.status(200).json({
        success: true,
        user
    });
});


//get  single  user (admin)
exports.getSingleUser = catchAsyncError(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler("User dose  not  exist with ", 401));
    }

    res.status(200).json({
        success: true,
        user
    });
});


// delete User Role   --Admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }


    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    });
});


// delete User 
exports.deleteUser = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.params.id);
    // we will remove cloudinary later
    if (!user) {
        return next(new ErrorHandler(`User dose not exist with Id : ${req.params.id}`, 401));
    }
    await user.remove();
    res.status(200).json({
        success: true
    });
});
