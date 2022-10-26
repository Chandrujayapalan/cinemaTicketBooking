const mongoose = require('mongoose')

const Schema = mongoose.Schema

const seatSchema = new Schema({
    // showTimeId: {
    //     type: Schema.Types.ObjectId, 
    //     ref: "ShowTime",
    //     required: true,
    // },
    // movieId: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Movie",
    //     required: true,
    // },
    totalSeat: [{
        seatNo: {
            type: Number
        },
        status: {
            type: Boolean,
             default: false
        },
    }],
    // totalSeat: {
    //     type: Array,
    //     // required: true   
    // },
    seatsRemaining: {
        type: Number,
        // required: true   
    },
    TicketPrice: {
        type: Number,
        required: true
    },
    
    
},
    { timestamps: true })
const Seat = mongoose.model('Seat', seatSchema)

module.exports = Seat