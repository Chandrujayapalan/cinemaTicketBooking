
const Booking = require('../model/booking')
const Movie = require('../model/movie')
const Seat = require('../model/seat')
const ShowTime = require('../model/showTimings')
const Screen = require('../model/screen')


const getMovie = async (req, res, next) => {
    try {
        let { movieName } = req.query
        let obj
        if (movieName) {
            obj = {
                movieName: { $regex: `${movieName}` },
            }
        }
        console.log(obj)
        let getScreen = await Movie.find(obj)
        console.log(getScreen)
        return res.status(200).json({
            status: 200,
            message: 'data fetch successfully',
            data: getScreen
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 400,
            err: " Something went Wrong",
            message: error.message
        })
    }
}
const getShow = async (req, res, next) => {
    try {
        let getShow = await ShowTime.find({ status: true })
            .populate({
                path: 'screenId',
                populate: {
                    path: "theaterId"
                }
            }).populate('movieId')
        return res.status(200).json({
            status: 200,
            message: 'data fetch successfully',
            data: getShow
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 400,
            err: " Something went Wrong",
            message: error.message
        })
    }
}
const createSeat = async (req, res, next) => {
    try {
        //  

        let { seatNo } = req.body
        let { screenId, showTimeId } = req.params
        let getScreen = await Screen.findOne({ screenId: screenId })
        console.log(getScreen.seats >= seatNo)
        if (getScreen.seats >= seatNo) {
            let getSeat = await Seat.find({ screenId: screenId, seatNo: seatNo, showTimeId: showTimeId })
            if (!getSeat.length) {
                let seat = new Seat({
                    screenId: screenId,
                    seatNo: seatNo,
                    showTimeId: showTimeId
                })
                await seat.save()
                return res.status(200).json({
                    status: 200,
                    message: 'Added successfully',
                    data: seat
                })
            } else {
                return res.status(400).json({
                    status: 400,
                    message: 'please select another seat from the following',
                })
            }
        } else {
            return res.status(400).json({
                status: 400,
                message: 'screen has limited seats',

            })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 400,
            err: " Something went Wrong",
            message: error.message
        })
    }
}

const getSeat = async (req, res, next) => {
    try {
        
        let{screenId} = req.params
        let getShow = await Seat.find({ status: true , screenId :screenId})
            
        return res.status(200).json({
            status: 200,
            message: 'data fetch successfully',
            data: getShow
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 400,
            err: " Something went Wrong",
            message: error.message
        })
    }
}


const createBooking = async (req, res, next) => {
    try {
        let { movieName, screenName, dateTime, seatNumber, totalPrice } = req.body
        let booking = new Booking({
            movieName: movieName,
            screenName: screenName,
            dateTime: dateTime,
            seatNumber: seatNumber,
            totalPrice: totalPrice,
            userId: req.user.id
        })

        return res.status(200).json({
            status: 200,
            message: 'Added successfully',
            data: getScreen

        })

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 400,
            err: " Something went Wrong",
            message: error.message
        })
    }
}


module.exports = { getMovie, getShow, createBooking, createSeat }