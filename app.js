const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./controllers/errorController');
const Admin = require('./models/adminModel');
const app = express();

//storage image for user
const imageStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images/products');
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

app.use(multer({ storage: imageStorage, fileFilter: imageFilter }).array('imageUrl', 3));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use((req, res, next) => {
    Admin.findById('5fc50e849cac83019154ce65')
        .then(admin => {
            req.admin = admin;
            next();
        })
        .catch(err => console.log(err));
});

app.use(adminRoutes);

app.use(errorHandler.render404Page);

mongoose
    .connect('mongodb+srv://admin:admincoza@cluster0.cjf9m.mongodb.net/coza-db?retryWrites=true&w=majority')
    .then(result => {
        Admin.findOne()
            .then(admin => {
                if (!admin) {
                    const admin = new Admin({
                        name: 'admin',
                        email: 'admin-coza@gmail.com',
                    });
                    admin.save();
                }
            })
        app.listen(process.env.PORT || 4000);
        console.log('Connected to Database');
    })
    .catch(err => console.log(err));