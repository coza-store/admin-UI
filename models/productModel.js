const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        detail_1: {
            type: String,
            require: true
        },
        detail_2: {
            type: String,
            require: false
        },
        detail_3: {
            type: String,
            require: false
        }
    },
    filter: {
        type: String,
        require: true
    },
    size: { type: Array },
    color: { type: Array },
    viewCount: { type: Number },
    hasSold: { type: Number }
});

module.exports = mongoose.model('Product', productSchema);