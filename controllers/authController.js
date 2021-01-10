const passport = require('passport');
const bcrypt = require('bcryptjs');
const Admin = require('../models/adminModel');
const { validationResult } = require('express-validator/check');

//render trang dang nhap
exports.getLogIn = (req, res, next) => {
    return res.render('auth/login', {
        pageTitle: 'Log in',
        path: '/login',
        errorMessage: '',
        oldInput: {
            email: '',
            password: ''
        }
    });
};

// xu ly an dang nhap
exports.postLogIn = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    passport.authenticate('local.signin', function(err, user, info) {
        if (info) {
            let message = info.message;
            if (message == 'Admin Not Found') {
                return res.status(422).render('auth/login', {
                    pageTitle: 'Login',
                    path: '/login',
                    errorMessage: message,
                    oldInput: {
                        email: email,
                        password: password,
                    }
                });
            }
            if (message == 'Incorrect Password') {
                return res.status(422).render('auth/login', {
                    pageTitle: 'Login',
                    path: '/login',
                    errorMessage: message,
                    oldInput: {
                        email: email,
                        password: password,
                    }
                });
            }
            if (message == 'This account has been locked') {
                return res.status(422).render('auth/login', {
                    pageTitle: 'Login',
                    path: '/login',
                    errorMessage: message,
                    oldInput: {
                        email: email,
                        password: password,
                    },
                    validationCond: ''
                });
            }
        }
        // req / res held in closure
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return req.session.save((err) => {
                console.log(err);
                if (req.session.oldUrl) {
                    let oldUrl = req.session.oldUrl;
                    req.session.oldUrl = null;
                    res.redirect(oldUrl);
                } else {
                    res.redirect('/');
                }
            });

        });

    })(req, res, next);
};

//xu ly an dang xuat
exports.postLogOut = (req, res, next) => {
    return req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    })
};

exports.getSetting = async(req, res, next) => {
    res.render('auth/setting', {
        pageTitle: 'Settings',
        path: '/setting',
        isAuthenticated: req.isAuthenticated(),
        user: req.user,
        errorMessage: '',
        errorMessage2: ''
    });
};

//xu ly chinh sua thong tin nguoi dung
exports.postSetting = async(req, res, next) => {
    const image = req.files['userImage'];
    const email = req.body.email;
    const fullname = req.body.name;
    const phone = req.body.phone;
    let errors = validationResult(req);
    if (phone) {
        if (phone.length != 10) {
            errors.array()[0].msg = 'Invalid phone number';
        }
    }
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/setting', {
            pageTitle: 'Settings',
            path: '/setting',
            isAuthenticated: req.isAuthenticated(),
            user: req.user,
            errorMessage: errors.array()[0].msg,
            errorMessage2: '',
        });
    }
    if (image) {
        req.user.userImage = image[0].path;
    }
    if (email != req.user.email) {
        req.user.email = email;
    }
    if (fullname) {
        req.user.name = fullname;
    }
    if (phone) {
        req.user.phone = phone;
    }
    return req.user.save()
        .then(result => {
            console.log('Update admin information');
            res.redirect('/setting');
        })
        .catch(err => console.log(err));
};

//xu ly doi mat khau trong tranng setting
exports.postResetSetting = async(req, res, next) => {
    const currentPassword = req.body.currentPswd;
    const newPassword = req.body.newPswd;
    let errors = validationResult(req);;
    if (!req.user.validPassword(currentPassword)) {
        errors.array()[0].msg = 'Current Password is incorrect';
    }
    if (newPassword == currentPassword) {
        errors.array()[0].msg = 'New password must be different from current'
    }
    if (!errors.isEmpty()) {
        res.status(422).render('auth/setting', {
            pageTitle: 'Settings',
            path: '/setting',
            isAuthenticated: req.isAuthenticated(),
            user: req.user,
            errorMessage: '',
            errorMessage2: errors.array()[0].msg,
        });
    }
    bcrypt.hash(newPassword, 12)
        .then(hashedPassword => {
            req.user.password = hashedPassword;
            return req.user.save();
        })
        .then(result => {
            res.redirect('/setting');
        })
        .catch(err => console.log(err));
};