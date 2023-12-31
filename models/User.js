const {Schema, model} = require('mongoose');

/*
Mongoose will automatically ignore all extra fields
not declared here.
*/
const UserSchema = Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
});

module.exports = model('User', UserSchema);