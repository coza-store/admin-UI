const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    imageUrl: {
        detail: {
            type: String,
            require: true
        },

    },
    email: {
        type: String,
        require: true
    },
    adress: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);