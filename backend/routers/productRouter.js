const express = require('express');
const {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    createProductReview,
    getProductReviews,
    deleteReviews
} = require('../controller/productController');
const router = express.Router();
const { isAuthenticatiedUser, authorizeRoles } = require('../middleware/auth');

router.route('/products').get(getAllProducts);
router.route('/product/new').post(isAuthenticatiedUser, authorizeRoles("admin"), createProduct);
router.route('/product/:id')
    .put(isAuthenticatiedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticatiedUser, authorizeRoles("admin"), deleteProduct);
//Middleware

router.route('product/:id').get(getProduct);
router.route('/review').put(isAuthenticatiedUser, createProductReview);
router.route('/reviews').get(getProductReviews).delete(isAuthenticatiedUser, deleteReviews);
module.exports = router;