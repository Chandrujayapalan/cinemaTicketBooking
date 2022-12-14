const mongoose = require('mongoose')
// const moment = require('moment')

const Schema = mongoose.Schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    phone: {
        type: Number,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: Number,
    },
    // dateTime: {
    //     type: Date,
    //     default: moment().format("HH:MM A"),
    // },
},
    { timestamps: true })
const User = mongoose.model('User', userSchema)

module.exports = User