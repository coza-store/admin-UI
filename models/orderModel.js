const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [{
        product: { type: Object, required: true },
        quantity: { type: Number, required: true },
        size: { type: String, required: false },
        color: { type: String, required: true }
    }],
    user: {
        name: { type: String, required: true },
        email: { type: String, require: true },
        phone: { type: String, require: true },
        userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
    },
    shipping: {
        address: { type: String, require: true },
        detail_address: { type: String, require: false },
        note: { type: String, require: false }
    },
    status: { type: String, default: 'unconfirmed' },
    totalPrice: { type: Number, required: true },
    dateShow: { type: String, required: true },
    dateFilter: { type: Date, required: true }
});

module.exports = mongoose.model('Order', orderSchema);