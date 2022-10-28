const Booking = require('../model/booking')
const Movie = require('../model/movie')
const Seat = require('../model/seat')
const ShowTime = require('../model/showTimings')
const Screen = require('../model/screen')
const User = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const register = async (req, res, next) => {
    try {
        let { name, email, phone, password } = req.body

        let user = await User.findOne({ $or: [{ email: email }, { phone: phone }] })
        if (!user) {
            let userData = new User({
                name: name,
                email: email,
                phone: phone,
                password: await bcrypt.hash(password, 10),
                userType: 3,
            })
            let user = await userData.save()
            return res.status(200).json({
                status: 200,
                message: 'Added successfully user',
                data: user
            })
        } else {
            return res.json({ status: 400, message: "Already exists" })
        }
    }
    catch (error) {
        return res.status(400).json({
            status: 400,
            err: " Something went Wrong",
            message: error.message
        })
    }
}
const login = async (req, res, next) => {
    try {
        let { username, password } = req.body
        let user = await User.findOne({ email: username, userType: 3 })
        console.log(user)
        if (user) {
            var validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({
                    status: 400,
                    message: 'password does not match'
                })
            } else {
                let token = jwt.sign({ id: user.id, userType: user.userType }, process.env.TOKEN_KEY, { expiresIn: '10d' })
                return res.status(200).json({
                    status: 200,
                    message: " login successfully by user",
                    userType: user.userType,
                    data: token
                })
            }
        } else {
            return res.json({
                status: 400,
                message: 'no user found '
            })
        }
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 400,
            err: " Something went Wrong",
            message: error.message
        })
    }
}
const getMovie = async (req, res, next) => {
    try {
        let { movieName } = req.query
        let obj
        if (movieName) {
            obj = {
                movieName: { $regex: `${movieName}` },
                status: true
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
            })
            .populate('movieId')
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
        let { seatNo, screenId, showTimeId } = req.body
        let getScreen = await Screen.findOne({ status: true, screenId: screenId })
        console.log(getScreen.seats >= seatNo)
        if (getScreen.seats >= seatNo) {
            let getSeat = await Seat.find({ screenId: screenId, seatNo: seatNo, showTimeId: showTimeId })
            if (!getSeat.length) {
                let seat = new Seat({
                    screenId: screenId,
                    seatNo: seatNo,
                    showTimeId: showTimeId,
                    userId: req.user.id
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
        let { screenId, showTimeId } = req.params
        let getSeat = await Seat.find({ status: true, screenId: screenId, showTimeId: showTimeId })
        let getScreen = await Screen.findOne({ _id: screenId, status: true })
        let seats = getSeat.length
        let availableSeat = []
        for (let i = 1; i <= getScreen.seats; i++) {
            availableSeat.push(i)
        }
        let filterSeat = getSeat.map(b => b.seatNo)
        availableSeat = availableSeat.filter(c => !filterSeat.includes(c))
        let bookingSeats = {
            bookedSeats: getSeat.map(b => b.seatNo),
            availableSeat: availableSeat,
            totalSeats: getScreen.seats,
            totalSeatsRemaing: getScreen.seats - seats
        }

        return res.status(200).json({
            status: 200,
            message: 'data fetch successfully',
            data: bookingSeats
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
        let { screenId, showTimeId } = req.body
        let getScreen = await Screen.findOne({ screenId: screenId, status: true }).populate('theaterId')
        // console.log(getScreen)
        let getSeat = await Seat.find({ status: true, screenId: screenId, showTimeId: showTimeId, userId: req.user.id })
            .populate({
                path: 'screenId',
                populate: {
                    path: "theaterId"

                },
            })
            .populate({
                path: 'showTimeId',
                populate: {
                    path: "movieId"
                }
            })
        let totalPrice = getSeat.map(a => a.screenId.ticketPrice)
        let theaterName = getSeat.map(a => a.screenId.theaterId.theaterName)
        theaterName = theaterName[0]
        let seatNumber = getSeat.map(a => a.seatNo)
        totalPrice = getSeat.length * totalPrice[0]
        let screenName = getSeat.map(a => a.screenId.screenName)
        screenName = screenName[0]
        let movieName = getSeat.map(a => a.showTimeId.movieId.movieName)
        movieName = movieName[0]
        let dateTime = getSeat.map(a => moment(a.showTimeId.startDate).format("YYYY-MM-DD") + " " + a.showTimeId.showTiming)
        dateTime = dateTime[0]

        let findBook = await Booking.find({ seatNumber: { $in: seatNumber  } , userId : req.user.id})


        let booking = new Booking({
            movieName: movieName,
            screenName: screenName,
            theaterName: theaterName,
            dateTime: dateTime,
            seatNumber: seatNumber,
            totalPrice: totalPrice,
            userId: req.user.id
        })
        // console.log(booking)
        // await booking.save() 
        return res.status(200).json({
            status: 200,
            message: 'Added successfully',
            data: booking
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
module.exports = { register, login, getMovie, getShow, createBooking, createSeat, getSeat }