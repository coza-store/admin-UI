const Product = require('../models/productModel');
const User = require('../models/userModel');
const ITEMS_PER_PAGE = 12;

exports.getIndex = (req, res, next) => {
    res.render('admin/index', {
        pageTitle: 'Dashboard',
        path: '/',
        editing: false
    });
};

//render trang toan bo san pham
exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Product.find({ name: regex })
            .countDocuments()
            .then(numOfProducts => {
                totalItems = numOfProducts;
                return Product
                    .find({ name: regex })
                    .skip((page - 1) * ITEMS_PER_PAGE)
                    .limit(ITEMS_PER_PAGE);

            })
            .then(products => {
                res.render('admin/product-list', {
                    pageTitle: 'All products',
                    path: '/products',
                    products: products,
                    currentPage: page,
                    totaProducts: totalItems,
                    hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                    hasPrevPage: page > 1,
                    nextPage: page + 1,
                    prevPage: page - 1,
                    lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
                    query: req.query.search
                })
            })
    } else {
        Product.find()
            .countDocuments()
            .then(numOfProducts => {
                totalItems = numOfProducts;
                return Product
                    .find()
                    .skip((page - 1) * ITEMS_PER_PAGE)
                    .limit(ITEMS_PER_PAGE);

            })
            .then(products => {
                res.render('admin/product-list', {
                    pageTitle: 'All products',
                    path: '/products',
                    products: products,
                    currentPage: page,
                    totaProducts: totalItems,
                    hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                    hasPrevPage: page > 1,
                    nextPage: page + 1,
                    prevPage: page - 1,
                    lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
                    query: ''
                })
            })
    }
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
    const images = req.files;
    const image_1 = '/' + images[0].path;
    const image_2 = '/' + images[1].path;
    const image_3 = '/' + images[2].path;
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
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

//render edit product
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

//post edit product
exports.postEditProduct = (req, res, next) => {
    //lay du lieu ma nguoi dung muon cap nhat
    const productId = req.body.productId;

    Product.findById(productId.trim())
        .then(product => {
            product.name = req.body.name;
            product.price = req.body.price;
            product.description = req.body.description;
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

//post delete product
exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findByIdAndRemove(productId)
        .then(result => {
            console.log('Delete product')
            res.redirect('/products');
        })
};

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


exports.getUser = (req, res, next) => {
    res.render('admin/config-user', {
        pageTitle: 'User',
        path: '/user',
        editing: false
    });
};

//method them product moi
exports.postAddUser= (req, res, next) => {
    const images = req.body.image;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const adress = req.body.adress;
    const password = req.body.password;
    
    const user = new User({
        first_name: first_name,
        last_name: last_name,
        email: email,
        images: images,
        adress: adress,
        password: password,
        adminId: req.admin
    });
    user
        .save()
        .then(result => {
            console.log('Created user');
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        })
};

exports.login = (req, res, next) => {
    res.render('includes/login-user', {
        pageTitle: 'User',
        path: '/',
        editing: false
    });
};

exports.logged = (req, res, next) => {
    res.render('includes/login-user', {
        pageTitle: 'User',
        path: '/',
        editing: false
    });
};