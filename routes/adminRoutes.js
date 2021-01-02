const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();
router.get('/', adminController.getIndex);

// /add-product => get
router.get('/add-product', adminController.getAddProduct);

// /add-product => post
router.post('/add-product', adminController.postAddProduct);

// /products => get
router.get('/products', adminController.getProducts);

// get edit product
router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);



module.exports = router;