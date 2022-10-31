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
        let obj ={}
        if (movieName) {
            obj = {
                movieName: { "$regex": `${movieName}`, "$options": "i" },
                status: true
            }
        }
        console.log(obj)
        let getMovie = await Movie.find(obj)
        if (!getMovie.length){
            return res.status(400).json({
                status: 400,
                message: 'no moive found',
              
            })
    }else{
            return res.status(200).json({
                status: 200,
                message: 'data fetch successfully',
                data: getMovie
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
const getShow = async (req, res, next) => {
    try {
        let { theaterName , movieName ,date } = req.query
        let obj  ={status :true}
     
        if (movieName) {
            obj.match = {
                movieName: { "$regex": `${movieName}`, "$options": "i" },
               
            }
        }
        if (theaterName) {
            obj.match = {
                theaterName: { "$regex": `${theaterName}`, "$options": "i" },
             
            }
        }
        if (date) {
            obj.showDate = {$gte : date}    
            }
        let getShow = await ShowTime.find(obj)
            .populate({
                path: 'screenId',
                match: obj.match,
                populate: {
                    path: "theaterId",
                     match: obj.match
                }
            })
            .populate({
                path :'movieId',
                match: obj.match
            })
        if (!getShow.length){   
            return res.status(400).json({
                status: 400,
                message: 'No more Shows available for any moive',
            })
        }
   
        let getShow2 = getShow.filter(a => a.movieId !== null)
        let getShow3 = getShow.filter(a => a.screenId.theaterId !== null)
        let getShow4 = getShow.filter(a => moment(a.showDate).format("YYYY-MM-DD") === date)
   
        if (!getShow4.length){
            return res.status(400).json({
                status: 400,
                message: 'no Movies show found in date you selected',

            })
        }
        if (!getShow2.length){
            return res.status(400).json({
                status: 400,
                message: 'no Movies show found',
              
            })
        }
        if (!getShow3.length) {
            return res.status(400).json({
                status: 400,
                message: 'no theater shows found',

            })
        }
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
const getSeat = async (req, res, next) => {
    try {
        let {screenId , showTimeId } = req.params
        let getScreen = await Screen.findOne({_id :screenId})
        console.log(getScreen)
        let getSeat = await Seat.find({ status: true, screenId: screenId ,showTimeId: showTimeId })
        console.log(getSeat)
        let seats = getSeat.length
        let a = getScreen.seats
        let availableSeat = []
        for (let i = 1; i <= a; i++) {
            availableSeat.push(i)
        }
        let filterSeat = getSeat.map(b => b.seatNo)
        availableSeat = availableSeat.filter(c => !filterSeat.includes(c))
        if (!availableSeat.length){
            return res.status(400).json({
                status: 400,
                message: "No seats Available",
              
            })

        }
        let bookingSeats = {
            bookedSeats: getSeat.map(b => b.seatNo),
            availableSeat: availableSeat,
            totalSeats: a,
            totalSeatsRemaing: a - seats
        }
        console.log(bookingSeats)

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

const createBooking= async (req, res, next) => {
    try {
        let { seatNo, screenId, showTimeId } = req.body
        let getSeat = await Seat.find({ screenId: screenId, seatNo: { $in: seatNo }, showTimeId: showTimeId })

        if (!getSeat.length) {
            let seats = seatNo.map(a => {
                return {
                    screenId: screenId,
                    showTimeId: showTimeId,
                    seatNo: a,
                    userId: req.user.id
                }
            })
            await Seat.insertMany(seats)
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
            let seatNumber = seatNo
            totalPrice = seatNo.length * totalPrice[0]
            let screenName = getSeat.map(a => a.screenId.screenName)
            screenName = screenName[0]
            let movieName = getSeat.map(a => a.showTimeId.movieId.movieName)
            movieName = movieName[0]
            let dateTime = getSeat.map(a => moment(a.showTimeId.showDate).format("YYYY-MM-DD") + " " + a.showTimeId.showTiming)
            dateTime = dateTime[0]


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
            await booking.save()
            return res.status(200).json({
                status: 200,
                message: 'Booking successfully',
                data: booking
            })


        } else {
            return res.status(400).json({
                status: 400,
                message: 'please select another seat from the following',
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

const getBooking = async (req, res, next) => {
    try {
        let { bookingId } = req.query
       
        let getBooking = await Booking.findById(bookingId)
        if (!getBooking) {
            return res.status(400).json({
                status: 400,
                message: 'no bookings found',

            })
        } else {
            return res.status(200).json({
                status: 200,
                message: 'data fetch successfully',
                data: getBooking
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

const getAllBooking = async (req, res, next) => {
    try {
        

        let getBooking = await Booking.find({userId :req.user.id ,status :true})
        if (!getBooking.length) {
            return res.status(400).json({
                status: 400,
                message: 'no bookings found',

            })
        } else {
            return res.status(200).json({
                status: 200,
                message: 'data fetch successfully',
                data: getBooking
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

const cancelBooking = async (req, res, next) => {
    try {

        let {id} = req.params
        let {status} = req.body
       
        let getBooking = await Booking.findByIdAndUpdate(  id ,{ status: status })
        if (getBooking.status == true) {
         await Seat.deleteMany({ seatNo: { $in: getBooking.seatNumber }})

            return res.status(200).json({
                status: 200,
                message: 'ticket canceled successfully'
            })
      }else {
            return res.status(400).json({
                status: 400,
                message: 'no booking is there',
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
module.exports = { register, login, getMovie, getShow, getSeat, createBooking, getBooking, getAllBooking, cancelBooking }