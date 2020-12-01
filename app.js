const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./controllers/errorController');
const Admin = require('./models/adminModel');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

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
