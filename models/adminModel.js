const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, require: true },
    phone: { type: String, required: false },
    userImage: { type: String, require: false },
    role: { type: String, required: true },
    lock: { type: Boolean, required: false, default: false },

});

adminSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}
module.exports = mongoose.model('Admin', adminSchema);