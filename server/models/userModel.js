const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true
        },
        password: {
            type: String,
            require: true
        },
        profilePic: {
            type: String,
            require: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('users', userSchema);