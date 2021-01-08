const express = require('express');
const { check } = require('express-validator/src/middlewares/check');
const adminController = require('../controllers/adminController');
const router = express.Router();
const checkAuth = require('../middleware/protect-routes');

router.get('/', checkAuth, adminController.getIndex);

// /add-product => get
router.get('/add-product', checkAuth, adminController.getAddProduct);

// /add-product => post
router.post('/add-product', checkAuth, adminController.postAddProduct);

// /products => get
router.get('/products', checkAuth, adminController.getProducts);

router.post('/products', checkAuth, adminController.postProducts);
// get edit product
router.get('/edit-product/:productId', checkAuth, adminController.getEditProduct);

router.post('/edit-product', checkAuth, adminController.postEditProduct);

router.post('/delete-product', checkAuth, adminController.postDeleteProduct);

router.get('/orders', checkAuth, adminController.getOrders);

router.post('/orders', checkAuth, adminController.postOrders);

router.put('/order/confirm/:orderId', checkAuth, adminController.confirmOrder);

router.get('/order/invoice/:orderId', checkAuth, adminController.getInvoice);



module.exports = router;