const { escapeRegex, toArraySize, toArrayColor } = require('../models/service/module.js');
const queryString = require('query-string');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const mongoose = require('mongoose');
const ITEMS_PER_PAGE = 12;

exports.getIndex = (req, res, next) => {
    res.render('admin/index', {
        pageTitle: 'Dashboard',
        path: '/',
        user: req.user,
        isAuthenticated: req.isAuthenticated()
    });
};

//render trang toan bo san pham
exports.getProducts = async(req, res, next) => {
    const page = +req.body.page || 1;
    let totalItems = await Product.find().countDocuments();
    let products = await Product.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);

    res.render('admin/product-list', {
        pageTitle: 'All products',
        path: '/products',
        products: products,
        user: req.user,
        isAuthenticated: req.isAuthenticated(),
        totaProducts: totalItems,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        color: '',
        tag: '',
        low: '',
        high: '',
        priceRange: '',
        sort: ''
    });
};
exports.postProducts = async(req, res, next) => {
    const page = +req.body.page || 1;

    let search = req.body.search ? req.body.search : "";
    const regexSearch = new RegExp(escapeRegex(search), 'gi');
    let color = req.body.color ? req.body.color : "";
    const regexColor = new RegExp(escapeRegex(color), 'gi');
    let tag = req.body.tag ? req.body.tag : "";
    const regexTag = new RegExp(escapeRegex(tag), 'gi');
    let lowest = req.body.lowestPrice ? req.body.lowestPrice : 0;
    let highest = req.body.highestPrice ? req.body.highestPrice : 10000000000;
    let sort = req.body.sort;
    let totalItems, products;

    //normal case
    if (sort != "" && sort != 'lowtohigh' && sort != 'hightolow') {
        totalItems = await Product
            .find({ $and: [{ name: regexSearch }, { color: regexColor }, { filter: regexTag }, { price: { $gte: lowest, $lte: highest } }, ] })
            .countDocuments();
        products = await Product
            .find({ $and: [{ name: regexSearch }, { color: regexColor }, { filter: regexTag }, { price: { $gte: lowest, $lte: highest } }] })
            .sort({
                [sort]: -1
            })
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);
    } else if (sort == 'lowtohigh') {
        totalItems = await Product
            .find({ $and: [{ name: regexSearch }, { color: regexColor }, { filter: regexTag }, { price: { $gte: lowest, $lte: highest } }, ] })
            .countDocuments();
        products = await Product
            .find({ $and: [{ name: regexSearch }, { color: regexColor }, { filter: regexTag }, { price: { $gte: lowest, $lte: highest } }] })
            .sort({ price: 1 })
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);
    } //high to low price sort case
    else if (sort == 'hightolow') {
        totalItems = await Product
            .find({ $and: [{ name: regexSearch }, { color: regexColor }, { filter: regexTag }, { price: { $gte: lowest, $lte: highest } }, ] })
            .countDocuments();
        products = await Product
            .find({ $and: [{ name: regexSearch }, { color: regexColor }, { filter: regexTag }, { price: { $gte: lowest, $lte: highest } }] })
            .sort({ price: -1 })
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);
    } else {
        totalItems = await Product
            .find({ $and: [{ name: regexSearch }, { color: regexColor }, { filter: regexTag }, { price: { $gte: lowest, $lte: highest } }, ] })
            .countDocuments();
        products = await Product
            .find({ $and: [{ name: regexSearch }, { color: regexColor }, { filter: regexTag }, { price: { $gte: lowest, $lte: highest } }] })
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);
    }

    let priceRange = lowest + '-' + highest;
    if (highest == 10000000000) {
        priceRange = lowest;
    }
    return res.render('admin/product-list', {
        pageTitle: 'All products',
        path: '/products',
        products: products,
        user: req.user,
        isAuthenticated: req.isAuthenticated(),
        totaProducts: totalItems,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        color: color,
        tag: tag,
        low: lowest,
        high: highest,
        priceRange: priceRange,
        sort: sort
    });
}

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
    const images = req.files['imageUrl'];
    let image_1, image_2, image_3;
    if (images[0]) {
        image_1 = '/' + images[0].path;
    }
    if (images[1]) {
        image_2 = '/' + images[1].path;
    }

    if (images[2]) {
        image_3 = '/' + images[2].path;
    }

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

exports.getOrders = async(req, res, next) => {
    const page = +req.body.page || 1;
    let totalItems = await Order.find().countDocuments();
    let orders = await Order.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);

    res.render('admin/order-list', {
        pageTitle: 'Order list',
        path: '/orders',
        orders: orders,
        user: req.user,
        isAuthenticated: req.isAuthenticated(),
        totaOrders: totalItems,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        sort: '',
        status: ''
    });
};

exports.postOrders = async(req, res, next) => {
    const page = +req.body.page || 1;

    let search = req.body.search ? req.body.search : "";
    let objID = new mongoose.mongo.ObjectID((search.length < 12) ? "123456789012" : search);
    const regexSearch = new RegExp(escapeRegex(search), 'gi');
    let status = req.body.status ? req.body.status : "";
    const regexStatus = new RegExp(escapeRegex(status), 'gi');
    let sort = req.body.sort;
    let totalItems, orders;
    if (sort == 'latest') {
        totalItems = await Order.find({ $and: [{ $or: [{ _id: objID }, { "user.name": regexSearch }] }, { status: regexStatus }] }).countDocuments();
        orders = await Order.find({ $and: [{ $or: [{ _id: objID }, { "user.name": regexSearch }] }, { status: regexStatus }] }).sort({ dateFilter: -1 }).skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
    } else if (sort == 'oldest') {
        totalItems = await Order.find({ $and: [{ $or: [{ _id: objID }, { "user.name": regexSearch }] }, { status: regexStatus }] }).countDocuments();
        orders = await Order.find({ $and: [{ $or: [{ _id: objID }, { "user.name": regexSearch }] }, { status: regexStatus }] }).sort({ dateFilter: 1 }).skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
    } else {
        totalItems = await Order.find({ $and: [{ $or: [{ _id: objID }, { "user.name": regexSearch }] }, { status: regexStatus }] }).countDocuments();
        orders = await Order.find({ $and: [{ $or: [{ _id: objID }, { "user.name": regexSearch }] }, { status: regexStatus }] }).skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
    }
    res.render('admin/order-list', {
        pageTitle: 'Order list',
        path: '/orders',
        orders: orders,
        user: req.user,
        isAuthenticated: req.isAuthenticated(),
        totalOrders: totalItems,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        sort: sort,
        status: status
    });
};

exports.confirmOrder = async(req, res, next) => {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);
    order.status = 'checked';
    order.save();
    res.status(200).json({
        message: 'Success !'
    })
}