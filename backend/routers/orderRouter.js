const express = require('express');
const {
    newOrder,
    getSingleOrder,
    myOrder,
    getAllOrder,
    updateOrder,
    deleteOrder
} = require('../controller/orderController');
const router = express.Router();
const {
    isAuthenticatiedUser,
    authorizeRoles
} = require('../middleware/auth');

router.route('/order/new').post(isAuthenticatiedUser, newOrder);

router.route('/order/:id').get(isAuthenticatiedUser, authorizeRoles("admin"), getSingleOrder);

router.route('/orders/me').get(isAuthenticatiedUser, myOrder);

router.route("/admin/orders").get(isAuthenticatiedUser, authorizeRoles("admin"), getAllOrder);

router.route("/admin/order/:id")
    .put(updateOrder)
    .delete(isAuthenticatiedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;