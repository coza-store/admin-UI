const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: false },
    name: { type: String, require: true },
    email: { type: String, require: true },
    phone: { type: String, required: false },
    password: { type: String, require: true },
    userImage: { type: String, require: false },
    active: { type: Boolean, require: true },
    lock: { type: Boolean, required: false, default: false },
    token: String,
    tokenExpiredTime: Date,
    cart: {
        items: [{
            productId: { type: Schema.Types.ObjectId, ref: 'Product', require: true },
            quantity: { type: Number, require: true },
            size: { type: String, require: false },
            color: { type: String, require: true }
        }],
        totalQty: { type: Number, require: true },
        totalPrice: { type: Number, require: true }
    }
});

module.exports = mongoose.model('User', userSchema);