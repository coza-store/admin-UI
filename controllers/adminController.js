const { escapeRegex, toArraySize, toArrayColor } = require('../models/service/module.js');
const queryString = require('query-string');
const Product = require('../models/productModel');
const ITEMS_PER_PAGE = 12;

exports.getIndex = (req, res, next) => {
    res.render('admin/index', {
        pageTitle: 'Dashboard',
        path: '/',
        editing: false
    });
};

//render trang toan bo san pham
exports.getProducts = async(req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;
    const nextQuery = {...req.query, page: page + 1 };
    const prevQuery = {...req.query, page: page - 1 };
    const currentQuery = {...req.query, page: page };
    const qC = queryString.stringify(currentQuery);
    const qN = queryString.stringify(nextQuery);
    const qP = queryString.stringify(prevQuery);

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
                res.render('shop/product-list', {
                    pageTitle: 'All products',
                    path: '/products',
                    products: products,
                    // user: req.user,
                    // isAuthenticated: req.isAuthenticated(),
                    totaProducts: totalItems,
                    currentPage: page,
                    currentPageQuery: qC,
                    hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                    hasPrevPage: page > 1,
                    nextPage: page + 1,
                    nextPageQuery: qN,
                    prevPage: page - 1,
                    prevPageQuery: qP
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
                    // user: req.user,
                    // isAuthenticated: req.isAuthenticated(),
                    totaProducts: totalItems,
                    currentPage: page,
                    currentPageQuery: qC,
                    hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                    hasPrevPage: page > 1,
                    nextPage: page + 1,
                    nextPageQuery: qN,
                    prevPage: page - 1,
                    prevPageQuery: qP
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
    const size = req.body.size;
    const color = req.body.color;
    let sizeArr = toArraySize(size);
    let colorArr = toArrayColor(color);



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
        size: sizeArr,
        color: colorArr,
        viewCount: 0,
        hasSold: 0
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
            if (req.body.size) {
                product.size = toArraySize(req.body.size)
            }
            if (req.body.color) {
                product.color = toArrayColor(req.body.color)
            }
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