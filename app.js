const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const multer = require('multer');

const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./controllers/errorController');
const Admin = require('./models/adminModel');

const MongoDBStore = require('connect-mongodb-session')(session);
const passport = require('passport');

const app = express();

const MONGODB_URL = 'mongodb+srv://admin:admincoza@cluster0.cjf9m.mongodb.net/coza-db';
const store = new MongoDBStore({
    uri: MONGODB_URL,
    collection: 'adsessions'
});
require('./config/passport');

//storage image handle
const productImageStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images/admin');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

const imageFilter = (req, file, callback) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        callback(null, true);
    } else {
        callback(null, false);
    }
};


app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(multer({ storage: productImageStorage, fileFilter: imageFilter }).fields([
    { name: 'imageUrl', maxCount: 3 },
    { name: 'userImage', maxCount: 1 }
]));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(session({
    secret: 'adsecret',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use((req, res, next) => {
    res.locals.session = req.session;
    if (!req.session.passport) {
        return next();
    }
    Admin.findById(req.session.passport.user)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(adminRoutes);

app.use(authRoutes);

app.use(errorHandler.render404Page);

mongoose
    .connect(MONGODB_URL)
    .then(result => {
        app.listen(process.env.PORT || 4000);
        console.log('Connected to Database');
    })
    .catch(err => console.log(err));