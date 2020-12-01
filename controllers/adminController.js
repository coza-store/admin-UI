const Product = require('../models/productModel');

exports.getIndex = (req, res, next) => {
    res.render('admin/index', {
        pageTitle: 'Admin Page',
        path: '/',
        editing: false
    });
};

//render trang edit hoac add product
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/add-product',
        editing: false
    });
};

//method them product moi
exports.postAddProduct = (req, res, next) => {
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    const image_1 = req.body.imageUrl1;
    const image_2 = req.body.imageUrl2;
    const image_3 = req.body.imageUrl3;
    const filter = req.body.filter;
    const product = new Product({
        name: name,
        price: price,
        description: description,
        imageUrl: {
            detail_1: image_1,
            detail_2: image_2,
            detail_3: image_3
        },
        filter: filter,
        adminId: req.admin
    });
    product
        .save()
        .then(result => {
            console.log('Created product');
            res.redirect('/products');
        })
        .catch(err => {
            console.log(err);
        })
};

//render trang toan bo san pham
exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('admin/product-list', {
                pageTitle: 'Products',
                path: '/products',
                products: products
            })
        })
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const productId = req.params.productId;

    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/edit-product',
                editing: editMode,
                product: product
            });
        })
};

exports.postEditProduct = (req, res, next) => {
    //lay du lieu ma nguoi dung muon cap nhat
    const productId = req.body.productId;

    Product.findById(productId.trim())
        .then(product => {
            product.name = req.body.name;
            product.price = req.body.price;
            product.description = req.body.description;
            product.imageUrl.detail_1 = req.body.imageUrl1;
            product.imageUrl.detail_2 = req.body.imageUrl2;
            product.imageUrl.detail_3 = req.body.imageUrl3;
            product.filter = req.body.filter;
            return product.save()
        })
        .then(result => {
            console.log('Updated product');
            res.redirect('/products');
        })
        .catch(err => {
            console.log(err);
        })
};

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findByIdAndRemove(productId)
        .then(result => {
            console.log('Delete product')
            res.redirect('/products');
        })
};