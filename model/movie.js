const mongoose = require('mongoose')

const Schema = mongoose.Schema

const movieSchema = new Schema({
    movieName: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
         required: true,
    },
    releaseDate: {
        type: Date,
        required: true
    },
},
    { timestamps: true })
const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie