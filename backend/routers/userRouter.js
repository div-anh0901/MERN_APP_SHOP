const express = require('express');
const { registerUser,
    loginUser,
    logout,
    forgotPassword,
    resetPassword,
    getUserDetails,
    updatePassword,
    updateProfile,
    getAllUser,
    getSingleUser,
    updateUserRole,
    deleteUser } = require('../controller/userController');
const router = express.Router();
const {
    isAuthenticatiedUser,
    authorizeRoles
} = require('../middleware/auth');



router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logout);
router.route('/me').get(isAuthenticatiedUser, getUserDetails);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/update').put(isAuthenticatiedUser, updatePassword);
router.route('/me/update').put(isAuthenticatiedUser, updateProfile);
router.route('/password/reset/:token').put(resetPassword);
router.route('/admin/users').get(isAuthenticatiedUser, authorizeRoles("admin"), getAllUser);
router.route('/admin/user/:id')
    .get(isAuthenticatiedUser, authorizeRoles("admin"), getSingleUser)
    .put(isAuthenticatiedUser, authorizeRoles("admin"), updateUserRole)
    .delete(isAuthenticatiedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;