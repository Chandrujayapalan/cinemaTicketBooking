const Booking = require('../model/booking')
const Movie = require('../model/movie')
const Seat = require('../model/seat')
const ShowTime = require('../model/showTimings')
const Screen = require('../model/screen')
const User = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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
             let { seatNo } = req.body
        let { screenId, showTimeId } = req.params
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
        let getScreen = await Screen.find({ _id: screenId, status: true })
        console.log(getScreen)
        let seats = getSeat.length
        getScreen = getScreen.map(a => {
            return {
                bookedSeats: getSeat.map(a => a.seatNo),
                totalSeats: a.seats,
                totalSeatsRemaing: a.seats - seats
            }
        })

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


const createBooking = async (req, res, next) => {
    try {
        let { screenId, showTimeId } = req.params
        let getScreen = await Screen.findOne({ screenId: screenId })
        let getSeat = await Seat.find({ status: true, screenId: screenId, showTimeId: showTimeId, userId: req.user.id }).populate({
            path: 'showTimeId', populate: {
                path: "movieId"
            }
        })
        let seatNumber = getSeat.map(a => a.seatNo)
        let totalPrice = getSeat.length * getScreen.ticketPrice
        let movieName = getSeat.map(a => a.showTimeId.movieId.movieName)
        movieName = movieName[0]
        let dateTime = getSeat.map(a => a.showTimeId.showTiming)
        dateTime = dateTime[0]

        let theaterName = getSeat.map(a => a.screenId.theaterId.theaterName)
        theaterName = theaterName[0]

        console.log(dateTime)
        let booking = new Booking({
            movieName: movieName,
            screenName: getScreen.screenName,
            theaterName: theaterName,
            dateTime: dateTime,
            seatNumber: seatNumber,
            totalPrice: totalPrice,
            userId: req.user.id
        })
        console.log(booking)
        await booking.save()
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
module.exports = { register , login ,getMovie, getShow, createBooking, createSeat, getSeat }